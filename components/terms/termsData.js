import {
  AlertTriangle,
  Ban,
  Briefcase,
  Calendar,
  CheckCircle2,
  Copyright,
  Globe2,
  Handshake,
  Mail,
  ScrollText,
  Shield,
  Wallet,
} from "lucide-react";

export const TERMS_SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    Icon: ScrollText,
    content: `Welcome to Dapper ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our website, proposals, statements of work, and the professional services we deliver when you engage us.

By accessing our website or entering into an agreement for services, you agree to be bound by these Terms. If you do not agree, please do not use our site or sign our engagement documents.`,
  },
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    Icon: CheckCircle2,
    content: `Your use of our website, receipt of a proposal, or signature on an order form, master services agreement, or statement of work constitutes acceptance of these Terms and any additional terms referenced therein.

Where a signed agreement conflicts with these Terms, the signed agreement prevails for that engagement.`,
  },
  {
    id: "services",
    title: "Services & Deliverables",
    Icon: Briefcase,
    content: `We provide strategic, creative, and technical services as described in your contract (including scope, timelines, and fees). Deliverables, acceptance criteria, and revision rounds are defined per project or retainer.

We may use subcontractors or specialist partners under our direction; we remain responsible to you for performance of the services as agreed.`,
  },
  {
    id: "client-obligations",
    title: "Your Responsibilities",
    Icon: Handshake,
    content: `You agree to provide timely access to stakeholders, brand assets, data, approvals, and feedback reasonably required for us to perform the work. Delays on your side may affect schedules and may be addressed via change control where applicable.

You represent that materials you supply do not infringe third-party rights and that you have authority to engage us on behalf of your organization.`,
  },
  {
    id: "fees",
    title: "Fees, Invoicing & Taxes",
    Icon: Wallet,
    content: `Fees are as specified in your agreement. Unless otherwise stated, invoices are due upon receipt or within the net terms stated on the invoice. Late payments may incur interest or suspension of work as permitted by law and your contract.

Amounts are exclusive of applicable taxes unless stated otherwise; you are responsible for any VAT, sales tax, or withholding where validly charged.`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    Icon: Copyright,
    content: `Pre-existing materials, tools, and methodologies owned by either party remain that party's property. Ownership of custom deliverables is as set out in your agreement—often transfer upon full payment for assigned IP, with retained rights to general know-how and non-confidential aggregates.

You grant us a limited license to use your marks and materials solely to perform the services and showcase work where permitted in writing.`,
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    Icon: Shield,
    content: `Each party will protect the other's non-public information with at least reasonable care and use it only for the purpose of the engagement. Exceptions include information that is public, independently developed, or rightfully received from a third party.

Confidentiality obligations survive for the period stated in your agreement or, if silent, a reasonable period after the relationship ends.`,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    Icon: AlertTriangle,
    content: `To the fullest extent permitted by law, neither party is liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, data, or goodwill, except where excluded liability is unenforceable.

Our aggregate liability arising from services under a given agreement is typically capped at the fees paid to us under that agreement in the prior twelve (12) months, unless your contract states a different cap.`,
  },
  {
    id: "termination",
    title: "Term & Termination",
    Icon: Ban,
    content: `Engagements run for the term in your agreement. Either party may terminate for material breach not cured within a notice period defined in the contract, or as otherwise specified for retainers or convenience (with fees for work performed through termination).

Surviving provisions—including fees owed, confidentiality, IP, and limits of liability—remain in effect after termination.`,
  },
  {
    id: "governing-law",
    title: "Governing Law & Disputes",
    Icon: Globe2,
    content: `Unless your agreement specifies otherwise, these Terms are governed by the laws of the Netherlands, without regard to conflict-of-law rules. Courts in Rotterdam, Netherlands, shall have exclusive jurisdiction, subject to any mandatory consumer or employment protections that cannot be waived.

We prefer good-faith escalation and mediation before litigation where practical.`,
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    Icon: Calendar,
    content: `We may update these Terms from time to time. Revisions will be posted on this page; continued use of the website after changes constitutes acceptance of the updated Terms.

Engaged clients are bound by the Terms in effect at contract signing unless we mutually agree in writing to adopt newer Terms.`,
  },
  {
    id: "contact",
    title: "Contact",
    Icon: Mail,
    content: `Questions about these Terms:

Email: hello@dapper.agency
Phone: +31 10 307 6707
Address: Weena 70, 13th floor, 3012 CM Rotterdam, Netherlands`,
  },
];
