import Link from 'next/link';
import Image from 'next/image';

export default function CaseExpertise() {
  return (
    <section className="relative overflow-hidden bg-white py-28 md:py-36 lg:py-44">
      <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-6 lg:px-10">
        {/* Grid - 2 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Card - Dark Case Study */}
          <article className="group relative flex flex-col justify-between rounded-3xl bg-[#1A1A1A] p-10 md:p-12 lg:p-14 min-h-[750px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            {/* Badge */}
            <div className="mb-10 flex items-center gap-3">
              <span className="inline-flex h-5 w-5 rounded-sm bg-[#74F5A1]" />
              <span className="font-merriweather text-[13px] md:text-[15px] font-semibold tracking-[0.16em] uppercase text-white">
                Case
              </span>
            </div>

            {/* Title */}
            <div className="flex-1">
              <h3 className="font-italiana text-[24px] md:text-[32px] lg:text-[38px] xl:text-[44px] font-light leading-[1.1] tracking-tight text-white">
                Demand Gen strategy leading to 200% increase in inbound calls
              </h3>
            </div>

            {/* Bottom - Logo and CTA */}
            <div className="mt-12 flex items-end justify-between gap-6">
              {/* Company Logo */}
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <span className="font-italiana text-[24px] md:text-[32px] font-light text-white">
                    ccp
                  </span>
                </div>
              </div>

              {/* Explore Case Button */}
              <Link
                href="/case-study"
                className="group/btn inline-flex items-center gap-3 rounded-lg bg-[#74F5A1] px-6 py-3.5 transition-all duration-300 hover:bg-[#5FE08D] hover:gap-4 hover:shadow-[0_8px_30px_rgba(116,245,161,0.4)]"
              >
                <span className="font-merriweather text-[14px] font-semibold text-[#111111]">
                  Explore case
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#111111] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
            </div>
          </article>

          {/* Right Card - Gradient Background with Content */}
          <article className="group relative flex flex-col justify-between rounded-3xl overflow-hidden min-h-[600px] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E9D5FF] via-[#DDD6FE] to-[#C7D2FE]">
              {/* Decorative Waves */}
              <div className="absolute inset-0">
                {/* Top Wave */}
                <div className="absolute top-0 left-0 right-0 h-32">
                  <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute top-0 w-full h-full"
                  >
                    <path
                      d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,0 L0,0 Z"
                      fill="#FBBF24"
                      opacity="0.6"
                    />
                  </svg>
                </div>

                {/* Middle Wave */}
                <div className="absolute top-8 left-0 right-0 h-40">
                  <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute top-0 w-full h-full"
                  >
                    <path
                      d="M0,80 C300,40 500,100 800,60 C1000,30 1100,90 1200,70 L1200,0 L0,0 Z"
                      fill="#93C5FD"
                      opacity="0.5"
                    />
                  </svg>
                </div>

                {/* Bottom Wave */}
                <div className="absolute top-16 left-0 right-0 h-48">
                  <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute top-0 w-full h-full"
                  >
                    <path
                      d="M0,50 C250,80 450,20 700,60 C900,90 1050,40 1200,70 L1200,0 L0,0 Z"
                      fill="#6366F1"
                      opacity="0.7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-12 lg:p-14">
              {/* Text Content */}
              <div className="flex-1 flex items-center">
                <p className="font-italiana text-[24px] md:text-[32px] lg:text-[38px] xl:text-[44px] font-light leading-[1.15] tracking-tight text-[#4338CA]">
                  Trusted by 200+ platforms and marketplaces across Europe for Payment Solutions.
                </p>
              </div>

              {/* Learn More Button */}
              <div className="mt-12">
                <Link
                  href="/solutions"
                  className="group/btn inline-flex items-center gap-3 rounded-lg bg-[#4338CA] px-8 py-4 transition-all duration-300 hover:bg-[#3730A3] hover:gap-4 hover:shadow-[0_12px_40px_rgba(67,56,202,0.4)]"
                >
                  <span className="font-merriweather text-[14px] font-semibold text-white">
                    Learn more
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
