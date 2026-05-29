/**
 * Standalone API server for the contact form.
 * Runs alongside the static Astro site on the VM.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx node api-server.mjs
 *
 * In production, configure nginx to proxy /api/* to http://localhost:3001
 */

import { createServer } from "http";
import { Resend } from "resend";

const PORT = process.env.API_PORT ?? 3001;

const TOPIC_LABELS = {
	platform: "Platform access & accounts",
	technical: "Technical support",
	ecosystem: "Joining the ecosystem",
	research: "Research collaboration",
	press: "Press & communications",
	other: "Other",
};

function parseFormData(body) {
	const params = new URLSearchParams(body);
	return Object.fromEntries(params.entries());
}

async function handleContact(req, res) {
	let body = "";
	for await (const chunk of req) body += chunk;

	const fields = parseFormData(body);
	const { name, email, topic, message } = fields;

	if (!name?.trim() || !email?.trim() || !topic || !message?.trim()) {
		res.writeHead(400, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ ok: false, error: "Missing fields" }));
		return;
	}

	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		console.error("RESEND_API_KEY is not set");
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ ok: false, error: "Server misconfiguration" }));
		return;
	}

	try {
		const resend = new Resend(apiKey);
		await resend.emails.send({
			from: "AI4EOSC Contact Form <noreply@ai4eosc.eu>",
			to: "ai4eosc@csic.es",
			replyTo: email.trim(),
			subject: `[Contact] ${TOPIC_LABELS[topic] ?? topic} — ${name.trim()}`,
			text: [
				`Name:    ${name.trim()}`,
				`Email:   ${email.trim()}`,
				`Topic:   ${TOPIC_LABELS[topic] ?? topic}`,
				"",
				message.trim(),
			].join("\n"),
		});

		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ ok: true }));
	} catch (err) {
		console.error("Resend error:", err);
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ ok: false, error: "Failed to send email" }));
	}
}

const server = createServer((req, res) => {
	// CORS for local dev
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	if (req.method === "POST" && req.url === "/api/contact") {
		handleContact(req, res);
		return;
	}

	res.writeHead(404, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
	console.log(`API server running on http://localhost:${PORT}`);
});
