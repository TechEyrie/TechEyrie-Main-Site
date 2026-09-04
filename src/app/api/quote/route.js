import nodemailer from "nodemailer";
import {
  QUOTE_FORM_TYPES,
  getSmtpConfig,
  validateQuoteForm,
} from "../../../lib/quoteForm.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const validated = validateQuoteForm(body);
  if (!validated.ok) {
    return Response.json(
      { ok: false, errors: validated.errors },
      { status: 400 },
    );
  }

  const smtp = getSmtpConfig();
  if (!smtp.ok) {
    console.error("[quote] Missing SMTP env:", smtp.missing.join(", "));
    return Response.json(
      { ok: false, error: "Email service is not configured." },
      { status: 500 },
    );
  }

  const { type, name, email, message, phone, company } = validated.data;
  const meta = QUOTE_FORM_TYPES[type];
  const submittedAt = new Date().toISOString();

  const text = [
    `${meta.label}`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    company ? `Company: ${company}` : null,
    `Type: ${type}`,
    `Submitted: ${submittedAt}`,
    "",
    "Message:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#14201b">
      <h2 style="margin:0 0 12px">${escapeHtml(meta.label)}</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
      <p><strong>Type:</strong> ${escapeHtml(type)}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
      <p style="margin:16px 0 6px"><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;background:#f5f7f6;padding:12px;border-radius:8px">${escapeHtml(message)}</pre>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transporter.sendMail({
      from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
      to: smtp.to,
      replyTo: email,
      subject: meta.subject,
      text,
      html,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[quote] SMTP send failed:", err?.message || err);
    return Response.json(
      { ok: false, error: "Failed to send message. Please try again." },
      { status: 502 },
    );
  }
}
