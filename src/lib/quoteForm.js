const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const QUOTE_FORM_TYPES = {
  quote: {
    label: "Get a Quote",
    subject: "New quote request — TechEyrie",
  },
  contact: {
    label: "Talk to Us",
    subject: "New contact request — TechEyrie",
  },
};

/**
 * Shared client/server validation for Talk to Us + Get a Quote.
 * @returns {{ ok: true, data: object } | { ok: false, errors: Record<string, string> }}
 */
export function validateQuoteForm(input = {}) {
  const errors = {};
  const type = String(input.type || "").trim().toLowerCase();
  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const message = String(input.message || "").trim();
  const companyName = String(input.companyName || input.company || "").trim();
  const phone = String(input.phone || "").trim();
  const website = String(input.website || "").trim(); // honeypot

  if (website) {
    return { ok: false, errors: { form: "Rejected." } };
  }

  if (!QUOTE_FORM_TYPES[type]) {
    errors.type = "Invalid form type.";
  }

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 120) {
    errors.name = "Name must be 120 characters or fewer.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email) || email.length > 254) {
    errors.email = "Enter a valid email address.";
  }

  if (phone && phone.length > 40) {
    errors.phone = "Phone must be 40 characters or fewer.";
  }

  if (companyName && companyName.length > 160) {
    errors.company = "Company must be 160 characters or fewer.";
  }

  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (message.length > 4000) {
    errors.message = "Message must be 4000 characters or fewer.";
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      type,
      name,
      email,
      message,
      phone: phone || undefined,
      company: companyName || undefined,
    },
  };
}

export function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const secure =
    String(process.env.SMTP_SECURE || "").toLowerCase() === "true" ||
    port === 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const to = process.env.QUOTE_TO_EMAIL?.trim();
  const fromEmail = process.env.QUOTE_FROM_EMAIL?.trim() || user;
  const fromName = process.env.QUOTE_FROM_NAME?.trim() || "Website";

  const missing = [];
  if (!host) missing.push("SMTP_HOST");
  if (!Number.isFinite(port) || port <= 0) missing.push("SMTP_PORT");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");
  if (!to) missing.push("QUOTE_TO_EMAIL");
  if (!fromEmail) missing.push("QUOTE_FROM_EMAIL");

  return {
    ok: missing.length === 0,
    missing,
    host,
    port,
    secure,
    user,
    pass,
    to,
    fromEmail,
    fromName,
  };
}
