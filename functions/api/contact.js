/**
 * Cloudflare Pages Function — POST /api/contact
 * Receives contact form submissions and forwards them via Resend API.
 *
 * Required env vars (Pages Dashboard → Settings → Environment variables):
 *   RESEND_API_KEY  — Resend API key (re_...)
 * Optional env vars:
 *   CONTACT_TO      — destination inbox (default: samytcheikman@gmail.com)
 *   CONTACT_FROM    — verified sender (default: Portfolio <onboarding@resend.dev>)
 *
 * Frontend: existing assets/vendor/php-email-form/validate.js POSTs FormData
 * and expects plain-text "OK" on success, error text otherwise.
 */

// Simple in-memory rate limit: 5 requests / 60s per IP (per isolate).
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const max = 5;
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (arr.length > max) {
    const retryAfter = Math.ceil((arr[0] + windowMs - now) / 1000);
    return retryAfter;
  }
  return 0;
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const ip =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const retryAfter = rateLimited(ip);
    if (retryAfter > 0) {
      return new Response(
        `Too many requests. Please retry in ${retryAfter}s.`,
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "Content-Type": "text/plain",
          },
        },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let name = "",
      email = "",
      subject = "",
      message = "",
      company = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      name = body.name || "";
      email = body.email || "";
      subject = body.subject || "";
      message = body.message || "";
      company = body.company || "";
    } else {
      const fd = await request.formData();
      name = (fd.get("name") || "").toString();
      email = (fd.get("email") || "").toString();
      subject = (fd.get("subject") || "").toString();
      message = (fd.get("message") || "").toString();
      company = (fd.get("company") || "").toString();
    }

    // Honeypot — bots fill hidden "company" field. Fake success.
    if (company.trim() !== "") {
      return new Response("OK", { status: 200 });
    }

    name = name.trim();
    email = email.trim();
    subject = subject.trim();
    message = message.trim();

    if (name.length < 2 || name.length > 100)
      return new Response("Please enter a valid name (2-100 characters).", {
        status: 400,
      });
    if (!EMAIL_RE.test(email) || email.length > 254)
      return new Response("Please enter a valid email address.", {
        status: 400,
      });
    if (subject.length < 2 || subject.length > 150)
      return new Response("Please enter a subject (2-150 characters).", {
        status: 400,
      });
    if (message.length < 10 || message.length > 5000)
      return new Response("Please enter a message (10-5000 characters).", {
        status: 400,
      });

    if (!env.RESEND_API_KEY) {
      return new Response(
        "Email service is not configured yet. Please try again later.",
        { status: 500 },
      );
    }

    const to = env.CONTACT_TO || "samytcheikman@gmail.com";
    const from = env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: `${name} <${email}>`,
        subject: `[Portfolio] ${subject}`,
        text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
        html: `<p>From: <strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p>Subject: <strong>${escapeHtml(subject)}</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", res.status, errText);
      return new Response("Failed to send message. Please try again later.", {
        status: 502,
      });
    }

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("Contact function error:", err);
    return new Response("Something went wrong. Please try again later.", {
      status: 500,
    });
  }
}

export function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
