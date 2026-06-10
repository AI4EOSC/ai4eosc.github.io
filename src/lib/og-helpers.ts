import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";

// ── Types ─────────────────────────────────────────────────────────────────────
export type ThemeKey = "teal" | "black" | "blue" | "pink";

// ── Cached resources ──────────────────────────────────────────────────────────
const _fontBuffers: Record<string, Buffer> = {};
function loadStaticFont(name: string): Buffer {
	if (!_fontBuffers[name]) {
		_fontBuffers[name] = readFileSync(
			join(process.cwd(), `public/fonts/clashgrotesk/${name}.woff`),
		);
	}
	return _fontBuffers[name];
}

export function loadFontSet() {
	return [
		{
			name: "Clash-Grotesk",
			data: loadStaticFont("ClashGrotesk-Medium") as unknown as ArrayBuffer,
			weight: 500 as const,
			style: "normal" as const,
		},
		{
			name: "Clash-Grotesk",
			data: loadStaticFont("ClashGrotesk-Semibold") as unknown as ArrayBuffer,
			weight: 600 as const,
			style: "normal" as const,
		},
	];
}

let _logoSvgWhite: string | null = null;
export function whiteLogoSvg(): string {
	if (!_logoSvgWhite) {
		let svg = readFileSync(
			join(process.cwd(), "src/assets/logos/AI4-horizontal-light.svg"),
			"utf-8",
		);
		_logoSvgWhite = svg
			.replace(/fill:\s*#eb5d80/g, "fill: #ffffff")
			.replace(/fill:\s*#1d1d1b/g, "fill: #ffffff")
			.replace(/fill:\s*#02838d/g, "fill: #ffffff")
			.replace(/fill="#eb5d80"/g, 'fill="#ffffff"')
			.replace(/fill="#1d1d1b"/g, 'fill="#ffffff"')
			.replace(/fill="#02838d"/g, 'fill="#ffffff"');
	}
	return _logoSvgWhite;
}

// ── Logo constants ────────────────────────────────────────────────────────────
// viewBox: 841.89 × 276.44  →  ratio ≈ 0.3283
// Left whitespace ≈ 13.9 %  |  Top whitespace ≈ 25.7 %
const PAGE_LOGO_W = 680;
const PAGE_LOGO_H = Math.round(PAGE_LOGO_W * (276.44 / 841.89)); // ~223 px
const PAGE_LOGO_LEFT = Math.max(0, 0);
const PAGE_LOGO_TOP = Math.max(0, 55 - Math.round(PAGE_LOGO_H * 0.257)); // ~0 px  (visual content ~57px from top)

const STORY_LOGO_W = 380;
const STORY_LOGO_H = Math.round(STORY_LOGO_W * (276.44 / 841.89)); // ~125 px
const STORY_LOGO_LEFT = Math.max(0, 55 - Math.round(STORY_LOGO_W * 0.139)); // ~2 px
const STORY_LOGO_TOP = 630 - 52 - STORY_LOGO_H; // ~453 px

async function buildLogoPng(w: number, h: number): Promise<Buffer> {
	const svg = whiteLogoSvg().replace("<svg ", `<svg width="${w}" height="${h}" `);
	return sharp(Buffer.from(svg)).png().toBuffer();
}

// ── Background SVG generator ──────────────────────────────────────────────────
// Full fidelity: radialGradient (SVG-native) + linearGradient + circles with glow.
// Proper SVG viewport clip eliminates the corner-glow artefact that satori box-shadow caused.
//
// Coordinate system: 1200 × 630 px, gradientUnits="userSpaceOnUse"
// Linear gradient at 140 deg — direction vector: (sin140°, cos140°) ≈ (0.6428, 0.7660)
// Gradient line through centre (600, 315), half-length ≈ 677 px:
//   start (165, -203)  →  end (1035, 833)

function radialDef(
	id: string,
	cx: number,
	cy: number, // pixel coords in 1200×630 space
	rx: number,
	ry: number, // pixel radii
	color: string,
	opacity: number,
	spreadFrac: number, // 0-1: fraction of rx/ry at which gradient becomes transparent
): string {
	return (
		`<radialGradient id="${id}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"` +
		` gradientTransform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${rx.toFixed(1)} ${ry.toFixed(1)})">` +
		`<stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/>` +
		`<stop offset="${Math.round(spreadFrac * 100)}%" stop-color="${color}" stop-opacity="0"/>` +
		`<stop offset="100%" stop-color="${color}" stop-opacity="0"/>` +
		`</radialGradient>`
	);
}

function buildBgSvg(theme: ThemeKey): string {
	const W = 1200,
		H = 630;

	// Exact gradients from PageHero.astro CSS (pixel coords for 1200×630)
	// Linear gradient at 140deg — direction (sin140°, cos140°) ≈ (0.6428, 0.7660)
	// Line through centre (600,315), half-diagonal ≈ 677px → start(165,-203) end(1035,833)
	type ThemeCfg = {
		linearStops: string;
		radials: [number, number, number, number, string, number, number][];
		glowColor: string;
	};

	const T: Record<ThemeKey, ThemeCfg> = {
		teal: {
			linearStops:
				`<stop offset="0%" stop-color="#002d30"/>` +
				`<stop offset="38%" stop-color="#005060"/>` +
				`<stop offset="100%" stop-color="#008792"/>`,
			radials: [
				// [cx, cy, rx, ry, color, opacity, spreadFrac]  — pixel values
				[0.12 * W, 0.12 * H, 0.6 * W, 0.55 * H, "#ffffff", 0.14, 0.55],
				[0.85 * W, 0.88 * H, 0.55 * W, 0.45 * H, "#00282c", 0.45, 0.58],
				[0.55 * W, 0.48 * H, 0.4 * W, 0.35 * H, "#00c8d7", 0.12, 0.55],
			],
			glowColor: "#00c8d7",
		},
		black: {
			linearStops:
				`<stop offset="0%" stop-color="#111418"/>` +
				`<stop offset="50%" stop-color="#1a1f24"/>` +
				`<stop offset="100%" stop-color="#1e2228"/>`,
			radials: [
				[0.05 * W, 0.5 * H, 0.55 * W, 0.8 * H, "#008792", 0.14, 0.6],
				[0.92 * W, 0.5 * H, 0.4 * W, 0.7 * H, "#ec5d80", 0.1, 0.6],
				[0.5 * W, 0.0 * H, 0.6 * W, 0.5 * H, "#ffffff", 0.04, 0.5],
			],
			glowColor: "#00c8d7",
		},
		blue: {
			linearStops:
				`<stop offset="0%" stop-color="#071a58"/>` +
				`<stop offset="45%" stop-color="#0f38a8"/>` +
				`<stop offset="100%" stop-color="#2a5ed8"/>`,
			radials: [
				[0.14 * W, 0.16 * H, 0.55 * W, 0.48 * H, "#ffffff", 0.13, 0.55],
				[0.82 * W, 0.86 * H, 0.5 * W, 0.42 * H, "#000532", 0.5, 0.55],
			],
			glowColor: "#6496ff",
		},
		pink: {
			linearStops:
				`<stop offset="0%" stop-color="#6b0828"/>` +
				`<stop offset="38%" stop-color="#a01848"/>` +
				`<stop offset="100%" stop-color="#ec5d80"/>`,
			radials: [
				[0.12 * W, 0.12 * H, 0.6 * W, 0.55 * H, "#ffffff", 0.13, 0.55],
				[0.85 * W, 0.88 * H, 0.55 * W, 0.45 * H, "#500a1e", 0.45, 0.58],
				[0.55 * W, 0.48 * H, 0.4 * W, 0.35 * H, "#ff78a0", 0.12, 0.55],
			],
			glowColor: "#ec5d80",
		},
	};

	const cfg = T[theme];
	const glowC = cfg.glowColor;

	const linearDef =
		`<linearGradient id="lg" x1="165" y1="-203" x2="1035" y2="833" gradientUnits="userSpaceOnUse">` +
		cfg.linearStops +
		`</linearGradient>`;

	const radialDefs = cfg.radials
		.map(([cx, cy, rx, ry, color, op, spread], i) =>
			radialDef(`rg${i}`, cx, cy, rx, ry, color, op, spread),
		)
		.join("");

	const radialRects = cfg.radials
		.map((_, i) => `<rect width="${W}" height="${H}" fill="url(#rg${i})"/>`)
		.join("");

	// ── Circles: exterior glow only ──────────────────────────────────────────
	// Each circle has a <mask> that hides its interior (r < radius).
	// The blurred glow stroke is rendered under the mask → glow spreads outward only.
	// filterUnits="userSpaceOnUse" prevents incorrect region calc on corner-centered circles.
	const circleFilter =
		`<filter id="cglow" filterUnits="userSpaceOnUse" x="-500" y="-500" width="2800" height="1800">` +
		`<feGaussianBlur in="SourceGraphic" stdDeviation="22"/>` +
		`</filter>`;

	const circleMasks = [520, 365, 230]
		.map(
			(r) =>
				`<mask id="em${r}">` +
				`<rect width="${W}" height="${H}" fill="white"/>` +
				`<circle cx="${W}" cy="${H}" r="${r}" fill="black"/>` +
				`</mask>`,
		)
		.join("");

	const circles = [
		[520, 55, 0.45],
		[365, 38, 0.42],
		[230, 26, 0.4],
	]
		.map(
			([r, sw, op]) =>
				// Glow layer — masked to exterior
				`<g mask="url(#em${r})">` +
				`<circle cx="${W}" cy="${H}" r="${r}" fill="none" stroke="${glowC}" stroke-width="${sw}" opacity="${op}" filter="url(#cglow)"/>` +
				`</g>` +
				// Crisp white ring
				`<circle cx="${W}" cy="${H}" r="${r}" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1"/>`,
		)
		.join("");

	// ── Noise grain overlay (same feTurbulence as PageHero ::after, opacity 0.035) ──
	const noiseDefs =
		`<filter id="nf">` +
		`<feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>` +
		`</filter>` +
		`<pattern id="np" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">` +
		`<rect width="200" height="200" filter="url(#nf)"/>` +
		`</pattern>`;

	return (
		`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
		`<defs>${linearDef}${radialDefs}${circleMasks}${circleFilter}${noiseDefs}</defs>` +
		`<rect width="${W}" height="${H}" fill="url(#lg)"/>` +
		radialRects +
		circles +
		`<rect width="${W}" height="${H}" fill="url(#np)" opacity="0.035"/>` +
		`</svg>`
	);
}

// ── Satori → PNG ──────────────────────────────────────────────────────────────
async function satoriToPng(element: object): Promise<Buffer> {
	const svg = await satori(element as any, {
		width: 1200,
		height: 630,
		fonts: loadFontSet(),
	});
	return sharp(Buffer.from(svg)).png().toBuffer();
}

// ── Shared footer row (pill + separator + url) ───────────────────────────────
function footerRowEl(
	urlColor = "rgba(255,255,255,0.85)",
	dotColor = "rgba(255,255,255,0.85)",
): object {
	return {
		type: "div",
		props: {
			style: { display: "flex", alignItems: "center", gap: "22px" },
			children: [
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "12px",
							fontSize: "28px",
							fontWeight: "600",
							color: "rgba(255,255,255,0.85)",
							padding: "13px 32px",
							borderRadius: "999px",
							border: "1px solid rgba(255,255,255,0.25)",
							background: "rgba(255,255,255,0.12)",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										width: "10px",
										height: "10px",
										borderRadius: "50%",
										background: "#7fe8c4",
										flexShrink: 0,
									},
								},
							},
							{ type: "span", props: { children: "AI4EOSC Initiative" } },
						],
					},
				},
				{
					type: "div",
					props: {
						style: {
							width: "5px",
							height: "5px",
							borderRadius: "50%",
							background: dotColor,
							flexShrink: 0,
						},
					},
				},
				{
					type: "div",
					props: {
						style: { fontSize: "32px", fontWeight: "500", color: urlColor },
						children: "ai4eosc.eu",
					},
				},
			],
		},
	};
}

// ── Page OG text element (transparent — background rendered separately as SVG) ─
export function buildPageOgElement(title: string, subtitle: string): object {
	return {
		type: "div",
		props: {
			style: {
				width: "1200px",
				height: "630px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end",
				padding: "72px 80px",
				background: "transparent",
				fontFamily: '"Clash-Grotesk"',
				color: "#ffffff",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							fontSize: "68px",
							fontWeight: "600",
							lineHeight: "1.1",
							letterSpacing: "-1px",
							color: "#ffffff",
							marginBottom: "14px",
							maxWidth: "585px",
						},
						children: title,
					},
				},
				{
					type: "div",
					props: {
						style: {
							fontSize: "35px",
							fontWeight: "500",
							lineHeight: "1.4",
							color: "rgba(255,255,255,0.58)",
							marginBottom: "34px",
							maxWidth: "525px",
						},
						children: subtitle,
					},
				},
				footerRowEl(),
			],
		},
	};
}

// ── Footer-only element (used for story photo OG — no title/subtitle) ─────────
function buildFooterOnlyElement(): object {
	return {
		type: "div",
		props: {
			style: {
				width: "1200px",
				height: "630px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end",
				padding: "72px 80px",
				background: "transparent",
				fontFamily: '"Clash-Grotesk"',
				color: "#ffffff",
			},
			children: [footerRowEl("rgba(255,255,255,0.85)", "rgba(255,255,255,0.85)")],
		},
	};
}

// ── Render page OG: SVG background + satori text overlay + logo ───────────────
// Layer order (sharp composite):
//   1. SVG background PNG  (gradients + circles — sharp renders SVG natively with librsvg)
//   2. Satori text overlay PNG (transparent bg — only text visible)
//   3. White logo PNG        (top-left)
export async function renderOgPng(element: object, theme: ThemeKey = "teal"): Promise<Buffer> {
	const [bgPng, textPng, logoPng] = await Promise.all([
		sharp(Buffer.from(buildBgSvg(theme)))
			.png()
			.toBuffer(),
		satoriToPng(element),
		buildLogoPng(PAGE_LOGO_W, PAGE_LOGO_H),
	]);

	return sharp(bgPng)
		.composite([
			{ input: textPng, blend: "over" },
			{ input: logoPng, left: PAGE_LOGO_LEFT, top: PAGE_LOGO_TOP },
		])
		.png()
		.toBuffer();
}

// ── Story photo OG ────────────────────────────────────────────────────────────
// Replicates stories page CSS: mix-blend-mode: luminosity; opacity: 0.55
// over the stories teal gradient (#253d42 → #3a7d87).
// Layout matches page OGs: logo top-left (PAGE_LOGO), pill+url bottom row.

// Subtle bottom gradient — just enough for pill readability, not dark/heavy
const STORY_BOTTOM_OVERLAY = Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">` +
		`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
		`<stop offset="55%" stop-color="#000" stop-opacity="0"/>` +
		`<stop offset="85%" stop-color="#000" stop-opacity="0.30"/>` +
		`<stop offset="100%" stop-color="#000" stop-opacity="0.55"/>` +
		`</linearGradient></defs>` +
		`<rect width="1200" height="630" fill="url(#g)"/>` +
		`</svg>`,
);

export async function renderStoryPhotoOg(imageBuffer: Buffer): Promise<Buffer> {
	// Teal duotone via recomb() — maps grayscale luminosity to exact brand teal #008792.
	// After grayscale(), R=G=B=L. recomb row sums:
	//   R-out = 0                   → no red
	//   G-out = 0.1763 * 3 * L = 0.529L → 135/255 at L=1  (brand teal G=135)
	//   B-out = 0.1912 * 3 * L = 0.574L → 146/255 at L=1  (brand teal B=146)
	// Result: pure black in shadows → #008792 in highlights → darkened 28% for contrast.
	const duotone = await sharp(imageBuffer)
		.resize(1200, 630, { fit: "cover", position: "centre" })
		.grayscale()
		.toColorspace("srgb")
		.recomb([
			[0, 0, 0],
			[0.1763, 0.1763, 0.1763],
			[0.1912, 0.1912, 0.1912],
		])
		.modulate({ brightness: 0.72 })
		.toBuffer();

	const [footerPng, logoPng] = await Promise.all([
		satoriToPng(buildFooterOnlyElement()),
		buildLogoPng(PAGE_LOGO_W, PAGE_LOGO_H),
	]);

	return sharp(duotone)
		.composite([
			{ input: STORY_BOTTOM_OVERLAY, blend: "over" },
			{ input: footerPng, blend: "over" },
			{ input: logoPng, left: PAGE_LOGO_LEFT, top: PAGE_LOGO_TOP },
		])
		.png()
		.toBuffer();
}
