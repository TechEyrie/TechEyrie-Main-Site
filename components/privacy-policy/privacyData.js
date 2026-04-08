import { Shield, Lock, Eye, FileText, Mail, Calendar } from "lucide-react";

export const PRIVACY_SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    Icon: FileText,
    content: `At Tech Eyrie ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose information when you engage with our website and use our services. Please review this policy carefully. If you do not agree with these terms, please do not access the site.`,
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    Icon: Eye,
    content: `We collect information that you provide directly to us, including:
- Personal information (name, email address, phone number)
- Business information (company name, job title)
- Communication data (messages, inquiries, feedback)
- Usage data (how you interact with our website)
- Technical data (IP address, browser type, device information)
- Cookies and tracking data`,
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    Icon: Lock,
    content: `We use the information we collect to:
- Provide, maintain, and improve our services
- Process your requests
- Send you marketing communications
- Respond to your inquiries
- Analyze website usage and trends
- Detect, prevent, and address issues
- Comply with legal requirements
- Protect rights and prevent deception`,
  },
  {
    id: "data-sharing",
    title: "Data Sharing and Disclosure",
    Icon: Shield,
    content: `We do not exploit or sell your personal information. We may share information only in the following situations:
- With service providers assisting us with website operations and business activities
- When required by law
- To protect privacy, rights, and property
- In connection with business partnerships or transfers
- With your consent`,
  },
  {
    id: "data-security",
    title: "Data Security",
    Icon: Lock,
    content: `We implement technical and organizational measures to protect your personal information against unauthorized access, disclosure, alteration, or destruction. However, no data transmission over the internet is 100% secure. While we apply best-practice safeguards, we cannot guarantee absolute security.`,
  },
  {
    id: "your-rights",
    title: "Your Rights",
    Icon: Shield,
    content: `You may have the following rights regarding your personal information:
- Right to access copies of your personal data
- Right to correct inaccurate data
- Right to request deletion of data
- Right to limit data processing
- Right to transfer data
- Right to withdraw previously given consent

To exercise these rights, please contact us.`,
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    Icon: Eye,
    content: `We use cookies and other technologies to track websites and store information. Cookies are small files that store a limited amount of information, sometimes including an anonymous unique identifier. They help us understand how you interact with our site and personalize your experience without compromising privacy. However, some features of our website may not function as intended if cookies are disabled.`,
  },
  {
    id: "third-party",
    title: "Third-Party Links",
    Icon: FileText,
    content: `Our website may include links to third-party websites. While we curate these connections carefully, Tech Eyrie is not responsible for the privacy practices, content, or security of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
  },
  {
    id: "children",
    title: "Children's Privacy",
    Icon: Shield,
    content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal data from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately.`,
  },
  {
    id: "international",
    title: "International Data Transfers",
    Icon: Lock,
    content: `At Tech Eyrie, some of the information you provide may be transferred to, stored, and processed on computers located outside your state, province, country, or other government institution. Data protection laws may vary in these locations.

By using our services, you consent to the transfer of your information to our facilities and to trusted third parties with whom we share it, as outlined in this policy.`,
  },
  {
    id: "changes",
    title: "Changes to This Privacy Policy",
    Icon: Calendar,
    content: `We may update our policies. You will be notified of any changes by publishing the updated policy on this page. You are advised to review this policy periodically. Changes take effect once posted on the page.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    Icon: Mail,
    content: `Want to know more about this policy?

Reach out directly - your questions are treated with the same attention as your information.`,
  },
];
