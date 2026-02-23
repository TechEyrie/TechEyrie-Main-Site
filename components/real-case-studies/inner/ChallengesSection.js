"use client";

export default function ChallengesSolutions({ theme = "light" }) {
  const isDark = theme === "dark";

  // Sample data - replace with actual props
  const content = {
    label: "PROJECT",
    title: "Challenges & solutions",
    items: [
      {
        challenge: "Enhancing usability within a legacy backend.",
        challengeDescription:
          "The platform had been running for years, requiring the client's team to focus on maintaining and supporting the existing infrastructure. This left little flexibility for substantial backend changes, posing a challenge to improving user flows and usability within these constraints.",
        solution:
          "Our team conducted an analysis of the backend to uncover opportunities for improvement. By refining user flows and working within the current architecture, we introduced impactful changes without major backend overhauls. This ensured a more intuitive user experience while preserving platform stability.",
      },
      {
        challenge: "Creating an intuitive user experience for complex processes.",
        challengeDescription:
          "Risk assessments and compliance workflows are inherently complex, with multiple stakeholders and intricate data requirements. Users found the existing interface overwhelming and difficult to navigate.",
        solution:
          "We redesigned the interface with a user-centered approach, breaking down complex processes into manageable steps. Progressive disclosure techniques and contextual help features were implemented to guide users through workflows without overwhelming them.",
      },
      {
        challenge: "Inconsistent design across multiple modules.",
        challengeDescription:
          "The platform had grown organically over time, resulting in inconsistent design patterns, UI elements, and user interactions across different modules. This created confusion and reduced overall usability.",
        solution:
          "We developed a comprehensive design system with reusable components, ensuring visual and functional consistency across all modules. This included documenting interaction patterns and creating a shared component library in Storybook.",
      },
      {
        challenge: "Improving performance for large datasets.",
        challengeDescription:
          "The platform handled massive amounts of compliance and assessment data, leading to slow load times and sluggish interactions that frustrated users and reduced productivity.",
        solution:
          "We implemented data virtualization techniques and optimized rendering strategies to handle large datasets efficiently. Pagination, lazy loading, and intelligent caching mechanisms significantly improved performance.",
      },
      {
        challenge: "Accessibility compliance requirements.",
        challengeDescription:
          "As a platform serving educational and government institutions, meeting WCAG 2.1 AA accessibility standards was critical but had been overlooked in previous iterations.",
        solution:
          "We conducted a comprehensive accessibility audit and implemented fixes including proper ARIA labels, keyboard navigation, color contrast improvements, and screen reader optimization throughout the platform.",
      },
      {
        challenge: "Mobile responsiveness limitations.",
        challengeDescription:
          "The platform was primarily designed for desktop use, with limited mobile functionality. However, stakeholders increasingly needed to access assessments and compliance data on mobile devices.",
        solution:
          "We redesigned key workflows with a mobile-first approach, creating responsive layouts that adapted seamlessly to different screen sizes. Critical features were optimized for touch interactions and mobile viewing.",
      },
      {
        challenge: "Data visualization complexity.",
        challengeDescription:
          "Complex risk and compliance data needed to be presented in ways that were both comprehensive and easy to understand. Existing charts and reports were difficult to interpret.",
        solution:
          "We designed intuitive data visualizations using modern charting libraries, implementing interactive dashboards that allowed users to drill down into details while maintaining a clear overview of key metrics.",
      },
      {
        challenge: "Onboarding new users efficiently.",
        challengeDescription:
          "New users struggled to understand the platform's capabilities and workflows, requiring extensive training and support. This created a barrier to adoption and increased support costs.",
        solution:
          "We developed an interactive onboarding system with contextual tooltips, guided tours, and in-app tutorials that helped new users quickly understand the platform's features and best practices without external training.",
      },
    ],
  };

  return (
    <section className={`w-full ${isDark ? "bg-[#1a1a1a]" : "bg-white"}`}>
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 md:py-24 lg:py-28">
        {/* Label */}
        <p
          className={`font-merriweather text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.16em] mb-6 sm:mb-8 ${
            isDark ? "text-gray-500" : "text-gray-600"
          }`}
        >
          {content.label}
        </p>

        {/* Title */}
        <h2
          className={`font-italiana font-light text-[32px] sm:text-[42px] md:text-[58px] lg:text-[65px] xl:text-[75px] 2xl:text-[85px] mb-16 sm:mb-20 md:mb-24 leading-tight tracking-[-0.03em] ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {content.title}
        </h2>

        {/* Grid of Challenge/Solution Pairs */}
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {content.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6"
            >
              {/* Challenge Card */}
              <div
                className={`p-8 sm:p-10 md:p-12 lg:p-14 rounded-2xl border min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex flex-col ${
                  isDark
                    ? "bg-[#1a1a1a] border-gray-800"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`font-italiana font-light text-[24px] sm:text-[28px] md:text-[32px] mb-6 sm:mb-8 tracking-[-0.03em] ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Challenge
                </h3>
                <h4
                  className={`font-italiana font-light text-[24px] md:text-[28px] mb-auto pb-8 sm:pb-10 tracking-[-0.03em] ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {item.challenge}
                </h4>
                <p
                  className={`font-merriweather text-[14px] leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {item.challengeDescription}
                </p>
              </div>

              {/* Solution Card */}
              <div
                className={`p-8 sm:p-10 md:p-12 lg:p-14 rounded-2xl min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex flex-col ${
                  isDark ? "bg-[#2a2a2a]" : "bg-gray-50"
                }`}
              >
                <h3
                  className={`font-italiana font-light text-[24px] md:text-[28px] mb-auto pb-8 sm:pb-10 tracking-[-0.03em] ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Solution
                </h3>
                <p
                  className={`font-merriweather text-[14px] leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {item.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
