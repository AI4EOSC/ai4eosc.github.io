import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const stories = defineCollection({
	loader: glob({ pattern: "[!_]*.md", base: "./src/content/stories" }),
	schema: z.object({
		title: z.string(),
		type: z.string(),
		date: z.date(),
		excerpt: z.string(),
		icon: z.string().optional(),
		image: z.string().optional(),
		externalUrl: z.url().optional(),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: "[!_]*.yml", base: "./src/content/projects" }),
	schema: z.object({
		type: z.enum(["origin", "extension", "associated"]),
		status: z.enum(["finished", "new", "active"]),
		title: z.string(),
		tagline: z.string(),
		description: z.string(),
		logo: z.string().optional(),
		outputsLabel: z.string().optional(),
		outputs: z.array(z.string()),
		funding: z.number().optional(),
		grant: z.string().optional(),
		programme: z.string().optional(),
		period: z.string().optional(),
		lead: z.string().optional(),
		partners: z.array(z.string()).optional(),
		url: z.url().optional(),
		grantUrl: z.url().optional(),
		social: z
			.object({
				linkedin: z.url().optional(),
				x: z.url().optional(),
				bluesky: z.url().optional(),
				youtube: z.url().optional(),
				github: z.url().optional(),
				email: z.email().optional(),
			})
			.optional(),
	}),
});

const communities = defineCollection({
	loader: glob({ pattern: "[!_]*.yml", base: "./src/content/communities" }),
	schema: z.object({
		title: z.string(),
		iconId: z.string(),
		users: z.number().optional(),
		tagline: z.string(),
		description: z.string().optional(),
		via: z.string().optional(),
		viaUrl: z.url().optional(),
		gatewaySlug: z.string().optional(),
		tools: z.array(z.string()).optional(),
		slug: z.string(),
	}),
});

const gateways = defineCollection({
	loader: glob({ pattern: "[!_]*.yml", base: "./src/content/gateways" }),
	schema: z.object({
		title: z.string(),
		status: z.enum(["active", "new", "coming-soon"]),
		users: z.number().optional(),
		tagline: z.string(),
		description: z.string().optional(),
		euProject: z.string().optional(),
		projectId: z.string().optional(),
		community: z.string().optional(),
		communitySlug: z.string().optional(),
		operatedBy: z.array(z.string()).optional(),
		accessType: z.string().optional(),
		accessDesc: z.string().optional(),
		tools: z.array(z.string()).optional(),
		logo: z.string().optional(),
		url: z.url().optional(),
		slug: z.string(),
	}),
});

const products = defineCollection({
	loader: glob({ pattern: "[!_]*.yml", base: "./src/content/products" }),
	schema: z.object({
		category: z.string(),
		title: z.string(),
		tagline: z.string(),
		status: z.string(),
		description: z.string(),
		iconId: z.string(),
		theme: z.string(),
		features: z.array(z.string()),
		visitLabel: z.string(),
		visitHref: z.url(),
		docsHref: z.url().optional(),
		order: z.number(),
	}),
});

export const collections = { stories, projects, communities, gateways, products };
