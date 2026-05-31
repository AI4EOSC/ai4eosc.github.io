import type { APIRoute, GetStaticPaths } from 'astro';
import type { ThemeKey } from '../../lib/og-helpers';
import { buildPageOgElement, renderOgPng } from '../../lib/og-helpers';

const PAGES: { page: string; title: string; subtitle: string; theme: ThemeKey }[] = [
  { page: 'home',        title: 'AI4EOSC Initiative',    subtitle: 'Accelerating AI in the European Open Science Cloud',       theme: 'teal'  },
  { page: 'about',       title: 'About AI4EOSC',         subtitle: 'Our mission, story and the people behind the initiative',   theme: 'teal'  },
  { page: 'products',    title: 'AI4EOSC Products',       subtitle: 'Open infrastructure and services for AI in EOSC',          theme: 'black' },
  { page: 'stories',     title: 'AI4EOSC Stories',        subtitle: 'Case studies, research and news from the community',       theme: 'teal'  },
  { page: 'projects',    title: 'Ecosystem Projects',     subtitle: 'EU-funded projects that build and extend the platform',    theme: 'blue'  },
  { page: 'gateways',    title: 'Gateways',               subtitle: 'Domain-specific deployments of the AI4EOSC platform',     theme: 'teal'  },
  { page: 'communities', title: 'Scientific Communities', subtitle: 'Research domains using AI4EOSC across Europe',            theme: 'pink'  },
  { page: 'contact',     title: 'Get in touch',           subtitle: 'Contact the AI4EOSC team',                                theme: 'blue'  },
  { page: 'faq',         title: 'FAQ',                    subtitle: 'Frequently asked questions about the platform',           theme: 'pink'  },
];

export const getStaticPaths: GetStaticPaths = () =>
  PAGES.map(({ page, title, subtitle, theme }) => ({
    params: { page },
    props: { title, subtitle, theme },
  }));

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle, theme } = props as { title: string; subtitle: string; theme: ThemeKey };
  const png = await renderOgPng(buildPageOgElement(title, subtitle), theme);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
