# RSS Feed Importer

This directory contains the RSS feed importer script that automatically fetches news from AI4EOSC domains and creates story files.

## Script

- `import-rss-feeds.mjs`: Node.js script that fetches RSS feeds and creates story markdown files

## How it works

1. **Fetches RSS feeds** from:
   - https://origin.ai4eosc.eu/feed/
   - https://fluid.ai4eosc.eu/feed/
   - https://arena.ai4eosc.eu/feed/

2. **Parses XML** to extract:
   - Title
   - Link (used as external URL)
   - Publication date
   - Description (used as excerpt)
   - Featured image

3. **Checks for duplicates** by comparing external URLs with existing stories

4. **Creates new story files** in `src/content/stories/` with:
   - Filename format: `YYYY-MM-DD-slug.md`
   - Frontmatter with title, type (News), date, excerpt, image, and externalUrl
   - Empty body (since these are external stories)

## GitHub Action

The script is automatically run daily at 6 AM UTC via the `.github/workflows/import-rss-feeds.yml` workflow.

You can also trigger it manually from the GitHub Actions tab.

## Manual usage

To run the script manually:

```bash
node scripts/import-rss-feeds.mjs
```

This will fetch the latest RSS feeds and create story files for any new entries that don't already exist.
