import { Shield, Lock, Eye, FileText, Mail, Calendar } from "lucide-react";

export const PRIVACY_SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    Icon: FileText,
    content: `At Dapper ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.`,
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    Icon: Eye,
    content: `We collect information that you provide directly to us, including:
- Personal identification information (name, email address, phone number)
- Business information (company name, job title)
- Communication data (messages, inquiries, feedback)
- Usage data (how you interact with our website)
- Technical data (IP address, browser type, device information)
- Cookies and tracking technologies data`,
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    Icon: Lock,
    content: `We use the information we collect to:
- Provide, maintain, and improve our services
- Process your requests and transactions
- Send you marketing communications (with your consent)
- Respond to your inquiries and provide customer support
- Analyze website usage and trends
- Detect, prevent, and address technical issues
- Comply with legal obligations
- Protect our rights and prevent fraud`,
  },
  {
    id: "data-sharing",
    title: "Data Sharing and Disclosure",
    Icon: Shield,
    content: `We do not sell your personal information. We may share your information only in the following circumstances:
- With service providers who assist us in operating our website and conducting our business
- When required by law or to respond to legal process
- To protect our rights, privacy, safety, or property
- In connection with a business transfer (merger, acquisition, etc.)
- With your explicit consent`,
  },
  {
    id: "data-security",
    title: "Data Security",
    Icon: Lock,
    content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.`,
  },
  {
    id: "your-rights",
    title: "Your Rights",
    Icon: Shield,
    content: `Depending on your location, you may have the following rights regarding your personal information:
- Right to access: Request copies of your personal data
- Right to rectification: Request correction of inaccurate data
- Right to erasure: Request deletion of your data
- Right to restrict processing: Request limitation of data processing
- Right to data portability: Request transfer of your data
- Right to object: Object to processing of your data
- Right to withdraw consent: Withdraw previously given consent

To exercise these rights, please contact us at hello@dapper.agency`,
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    Icon: Eye,
    content: `We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.`,
  },
  {
    id: "third-party",
    title: "Third-Party Links",
    Icon: FileText,
    content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
  },
  {
    id: "children",
    title: "Children's Privacy",
    Icon: Shield,
    content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.`,
  },
  {
    id: "international",
    title: "International Data Transfers",
    Icon: Lock,
    content: `Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our services, you consent to the transfer of your information to our facilities and those third parties with whom we share it as described in this policy.`,
  },
  {
    id: "changes",
    title: "Changes to This Privacy Policy",
    Icon: Calendar,
    content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes are effective when posted on this page.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    Icon: Mail,
    content: `If you have any questions about this Privacy Policy, please contact us:

Email: hello@dapper.agency
Phone: +31 10 307 6707
Address: Weena 70, 13th floor, 3012 CM Rotterdam, Netherlands`,
  },
];
