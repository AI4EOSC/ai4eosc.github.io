#!/usr/bin/env node

/**
 * RSS Feed Importer
 * 
 * Fetches RSS feeds from AI4EOSC domains and creates story files
 * for new entries in src/content/stories
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// RSS feed URLs
const RSS_FEEDS = [
  'https://origin.ai4eosc.eu/feed/',
  'https://fluid.ai4eosc.eu/feed/',
  'https://arena.ai4eosc.eu/feed/'
];

// Path to stories directory
const STORIES_DIR = join(__dirname, '..', 'src', 'content', 'stories');

/**
 * Fetch and parse RSS feed
 */
async function fetchRssFeed(url) {
  try {
    console.log(`Fetching RSS feed from ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const text = await response.text();
    return parseRssFeed(text, url);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return [];
  }
}

/**
 * Parse RSS feed XML
 */
function parseRssFeed(xml, feedUrl) {
  const items = [];
  
  // Extract items from RSS feed
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    
    // Extract fields
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const description = extractTag(itemXml, 'description');
    const content = extractTag(itemXml, 'content:encoded') || description;
    
    // Extract image from content or description
    let imageUrl = '';
    const imgMatch = (content || description).match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) {
      imageUrl = imgMatch[1];
    }
    
    if (title && link && pubDate) {
      items.push({
        title: cleanText(title),
        link: link.trim(),
        pubDate: new Date(pubDate),
        description: cleanText(description),
        image: imageUrl,
        feedUrl
      });
    }
  }
  
  console.log(`Found ${items.length} items in ${feedUrl}`);
  return items;
}

/**
 * Extract content from XML tag
 */
function extractTag(xml, tagName) {
  const regex = new RegExp(`<${tagName}(?:[^>]*)><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tagName}>|<${tagName}(?:[^>]*)>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? (match[1] || match[2] || '').trim() : '';
}

/**
 * Clean HTML and entities from text
 */
function cleanText(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate filename from title and date
 */
function generateFilename(title, date) {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
  
  return `${dateStr}-${slug}.md`;
}

/**
 * Create story frontmatter
 */
function createStoryContent(item) {
  const dateStr = item.pubDate.toISOString().split('T')[0];
  
  // Truncate description to a reasonable length for excerpt
  let excerpt = item.description;
  if (excerpt.length > 200) {
    excerpt = excerpt.substring(0, 197) + '...';
  }
  
  const frontmatter = [
    '---',
    `title: "${item.title.replace(/"/g, '\\"')}"`,
    `type: News`,
    `date: ${dateStr}`,
    `excerpt: ${excerpt.replace(/"/g, '\\"')}`,
  ];
  
  if (item.image) {
    frontmatter.push(`image: ${item.image}`);
  }
  
  frontmatter.push(`externalUrl: ${item.link}`);
  frontmatter.push('---');
  frontmatter.push('');
  
  return frontmatter.join('\n');
}

/**
 * Get existing story files
 */
async function getExistingStories() {
  try {
    const files = await readdir(STORIES_DIR);
    const stories = new Set();
    
    for (const file of files) {
      if (file.endsWith('.md') && file !== '_template.md') {
        const content = await readFile(join(STORIES_DIR, file), 'utf-8');
        
        // Extract externalUrl from frontmatter
        const urlMatch = content.match(/externalUrl:\s*(.+)/);
        if (urlMatch) {
          stories.add(urlMatch[1].trim());
        }
      }
    }
    
    return stories;
  } catch (error) {
    console.error('Error reading existing stories:', error.message);
    return new Set();
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting RSS feed import...');
  
  // Get existing stories
  const existingUrls = await getExistingStories();
  console.log(`Found ${existingUrls.size} existing stories`);
  
  // Fetch all RSS feeds
  const allItems = [];
  for (const feedUrl of RSS_FEEDS) {
    const items = await fetchRssFeed(feedUrl);
    allItems.push(...items);
  }
  
  console.log(`Total items fetched: ${allItems.length}`);
  
  // Filter out existing stories
  const newItems = allItems.filter(item => !existingUrls.has(item.link));
  console.log(`New items to add: ${newItems.length}`);
  
  // Create story files for new items
  let createdCount = 0;
  for (const item of newItems) {
    const filename = generateFilename(item.title, item.pubDate);
    const filepath = join(STORIES_DIR, filename);
    const content = createStoryContent(item);
    
    try {
      await writeFile(filepath, content, 'utf-8');
      console.log(`Created: ${filename}`);
      createdCount++;
    } catch (error) {
      console.error(`Error creating ${filename}:`, error.message);
    }
  }
  
  console.log(`\nImport complete: ${createdCount} new stories created`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
