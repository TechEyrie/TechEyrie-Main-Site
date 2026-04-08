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
    content: `Welcome to Tech Eyrie, (we, our, us). These terms and conditions define the engagement of our website, proposals, and professional services we offer. 

    By accessing our website, you agree to be bound by these terms. If you do not agree, please refrain from signing our documents. 
`,
  },
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    Icon: CheckCircle2,
    content: `Your use of a website, proposals, signature, service agreement, or statement of work constitutes acceptance of these Terms and any additional terms. 

Where a signed agreement exists, it takes precedence. In the event of any conflict between these Terms and a formally executed document, the signed agreement will govern that specific engagement
`,
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
    content: `You agree to provide data, your business ideas,needs, goals and feedback for us to perform better. Delays on your side might affect the process and interrupt the business. 

You represent and warrant that any materials you provide do not infringe the rights of third parties, and that you have the full authority to engage us on behalf of your organization.`,
  },
  {
    id: "fees",
    title: "Fees, Invoicing & Taxes",
    Icon: Wallet,
    content: `Fees are mentioned in the agreement. Unless otherwise stated, invoices are due upon receipt or within the specified net terms outlined on each invoice. Timely settlement ensures continuity and momentum. Where payments are delayed, we reserve the right to apply interest or pause ongoing work, in accordance with applicable law and the terms of your contract.

All amounts are exclusive of applicable taxes unless stated otherwise. You remain responsible for any VAT, sales tax, or withholding obligations where they are validly applied.
`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    Icon: Copyright,
    content: `Materials, tools and methodologies remain that party’s property. Ownership of custom deliverables is defined within your agreement typically transferring upon full payment where intellectual property is assigned, while general know-how and non-confidential insights remain with us.

    You grant us a limited, considered license to use your brand assets and materials solely for the purpose of delivering our services and, where agreed in writing, to thoughtfully showcase selected work.
`,
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    Icon: Shield,
    content: `Each party will secure and protect the other party’s information to use only for the engagement purpose. Exceptions include information that is public, independently developed or received from a third-party rightfully. 

Confidentiality obligations remain in place for the duration defined in your agreement or, where not specified, for a reasonable period following the end of the relationship.`,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    Icon: AlertTriangle,
    content: `To full extent permitted by the law neither party is liable for indirect, special or consequential damages including, data, profit, or goodwill except where limitations cannot be legally applied.

Our total liability under any engagement is typically limited to the fees paid within the preceding twelve months, unless otherwise defined in your agreement.`,
  },
  {
    id: "termination",
    title: "Term & Termination",
    Icon: Ban,
    content: `Each engagement runs for the prescribed period in the agreement,Either party may terminate in the event of a material breach that remains unresolved within the defined notice period or as otherwise specified for ongoing or flexible engagements. Upon termination, fees for work completed up to that point remain payable.

Certain provisions—such as fees due, confidentiality, intellectual property, and limitations of liability—continue beyond the end of the engagement, ensuring continuity and protection for both parties.`,
  },
  {
    id: "governing-law",
    title: "Governing Law & Disputes",
    Icon: Globe2,
    content: `Unless otherwise specified, these Terms are governed by the laws with jurisdiction in the courts. This is subject to any mandatory protections that cannot be waived.

    Where possible, we favor resolution through good-faith discussion and mediation because the best outcomes are rarely adversarial.`,
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    Icon: Calendar,
    content: `We may update these Terms from time to time to reflect evolving practices or legal requirements. Updates will be published here, maintaining transparency.

    Continued use of our website indicates acceptance of any revisions. For active engagements, the Terms in effect at the time of signing will apply unless both parties agree in writing to adopt updated terms.`,
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
