"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING_LINES = ["THINGS YOU", "MIGHT ASK"];

const FAQ_GROUPS = [
  {
    category: "CONCEPT & STRATEGY",
    items: [
      {
        q: "IS ONE PAGE REALLY ENOUGH?",
        a: "IN MANY CASES â€” YES. A WELL-STRUCTURED ONE-PAGE WEBSITE IS ENOUGH TO LAUNCH, TEST AN IDEA, AND START GETTING LEADS. YOU CAN ALWAYS SCALE IT LATER.",
      },
      {
        q: "CAN WE SCALE THE WEBSITE LATER?",
        a: "YES. WE DESIGN ONE-PAGE WEBSITES WITH SCALABILITY IN MIND. NEW SECTIONS, PAGES, OR FEATURES CAN BE ADDED WHEN NEEDED.",
      },
      {
        q: "DO YOU WORK WITH EARLY-STAGE STARTUPS?",
        a: "ABSOLUTELY. WE SPECIALIZE IN HELPING EARLY-STAGE TEAMS MOVE FAST AND LOOK CREDIBLE FROM DAY ONE.",
      },
    ],
  },
  {
    category: "PLANS & SCOPE",
    items: [
      {
        q: "WHAT'S THE DIFFERENCE BETWEEN LITE, PRO, AND ADMIN?",
        a: "LITE IS FOR FAST LAUNCHES. PRO ADDS A SCALABLE DESIGN SYSTEM. ADMIN INCLUDES A CMS SO YOU CAN MANAGE CONTENT YOURSELF WITHOUT OUR SUPPORT.",
      },
      {
        q: "WHAT IF WE NEED SOMETHING CUSTOM?",
        a: "ACTUALLY, WE HAVE A SECRET CUSTOM PLAN. TELL US ABOUT YOUR IDEA AND WE'LL PROPOSE A SOLUTION.",
      },
      {
        q: "ARE THERE ANY HIDDEN FEES?",
        a: "NONE. WHAT YOU SEE IN THE PROPOSAL IS WHAT YOU PAY. NO SURPRISES.",
      },
    ],
  },
  {
    category: "PROCESS & TIMELINE",
    items: [
      {
        q: "DO YOU PROVIDE BOTH DESIGN AND DEVELOPMENT?",
        a: "YES. WE HANDLE BOTH DESIGN AND DEVELOPMENT, OR WE CAN WORK WITH YOUR DEVELOPERS IF PREFERRED.",
      },
      {
        q: "HOW LONG DOES THE PROJECT TAKE?",
        a: "LITE TAKES 2-3 WEEKS. PRO TAKES 4-5 WEEKS. ADMIN TAKES 6-8 WEEKS. TIMELINES START AFTER KICKOFF.",
      },
      {
        q: "WHAT DO YOU NEED FROM US TO START?",
        a: "A BRIEF CALL, YOUR BRAND ASSETS, AND A SIGNED PROPOSAL. WE TAKE IT FROM THERE.",
      },
    ],
  },
  {
    category: "PAYMENTS & OWNERSHIP",
    items: [
      {
        q: "HOW DOES PAYMENT WORK?",
        a: "WE WORK ON A 2-STEP PAYMENT APPROACH. THAT MEANS 50% UPFRONT AND 50% BEFORE LAUNCH.",
      },
      {
        q: "WHO OWNS THE WEBSITE AFTER LAUNCH?",
        a: "YOU DO. 100%. ALL CODE, ASSETS, AND DESIGN FILES ARE TRANSFERRED TO YOU UPON FINAL PAYMENT.",
      },
      {
        q: "DO YOU OFFER REFUNDS?",
        a: "WE DON'T OFFER REFUNDS AFTER WORK HAS BEGUN, BUT WE COMMIT TO REVISIONS UNTIL YOU'RE SATISFIED.",
      },
    ],
  },
  {
    category: "SUPPORT & COLLABORATION",
    items: [
      {
        q: "DO YOU OFFER POST-LAUNCH SUPPORT?",
        a: "YES. WE OFFER ONGOING SUPPORT AND MAINTENANCE THROUGH OUR RETAINER PLAN. YOU CAN ALSO REACH OUT FOR ONE-OFF FIXES AT ANY TIME.",
      },
      {
        q: "CAN WE COLLABORATE REMOTELY?",
        a: "100%. OUR ENTIRE PROCESS IS BUILT FOR REMOTE COLLABORATION. WE USE ASYNC COMMUNICATION AND CLEAR MILESTONES TO KEEP THINGS SMOOTH.",
      },
    ],
  },
];

// Ã¢â€â‚¬Ã¢â€â‚¬ Single FAQ item Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function FAQItem({ item, isLast }) {
  const [open, setOpen] = useState(false);
  const answerRef = useRef(null);
  const arrowRef = useRef(null);

  const toggle = () => {
    const el = answerRef.current;
    if (!el) return;

    if (!open) {
      gsap.set(el, { height: "auto", visibility: "visible" });
      const h = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: 0, autoAlpha: 0 },
        { height: h, autoAlpha: 1, duration: 0.45, ease: "power3.out" }
      );
      gsap.to(arrowRef.current, {
        rotation: 45,
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(el, {
        height: 0,
        autoAlpha: 0,
        duration: 0.38,
        ease: "power3.in",
      });
      gsap.to(arrowRef.current, {
        rotation: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    }
    setOpen(!open);
  };

  return (
    <div>
      <div className="h-px w-full bg-[#74F5A1]/18" />

      <button
        onClick={toggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        {/* Question Ã¢â‚¬â€ increased ~50% from text-[12px] Ã¢â€ â€™ text-[17px] */}
        <span className="font-merriweather text-[15px] sm:text-[16px] md:text-[17px] font-normal leading-[1.45] tracking-[0.02em] text-[#1a1a1a] uppercase">
          {item.q}
        </span>
        <span
          ref={arrowRef}
          className="mt-1 flex-shrink-0 text-[#1a1a1a]/50"
          style={{ transformOrigin: "center", display: "inline-block" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2V14M2 8H14"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {/* Answer */}
      <div
        ref={answerRef}
        style={{ height: 0, overflow: "hidden", visibility: "hidden" }}
      >
        {/* Answer Ã¢â‚¬â€ increased ~50% from text-[11px] Ã¢â€ â€™ text-[15px] */}
        <p className="font-merriweather pb-5 text-[13px] sm:text-[14px] md:text-[15px] font-light leading-[1.85] tracking-[0.03em] text-[#1a1a1a]/55 uppercase">
          {item.a}
        </p>
      </div>

      {isLast && <div className="h-px w-full bg-[#74F5A1]/18" />}
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ FAQ group Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function FAQGroup({ group, groupRef }) {
  return (
    <div ref={groupRef}>
      {/* Category Ã¢â‚¬â€ regular font weight, increased size */}
      <h3 className="font-italiana mb-8 text-[28px] sm:text-[32px] md:text-[36px] font-normal leading-tight tracking-[-0.01em] text-[#1a1a1a] uppercase">
        {group.category}
      </h3>

      <div>
        {group.items.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            isLast={i === group.items.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Main section Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export default function Home10FAQ() {
  const sectionRef = useRef(null);
  const headingWrapRef = useRef(null);
  const headingLineRefs = useRef([]);
  const groupRefs = useRef([]);

  useGSAP(
    () => {
      // Ã¢â€â‚¬Ã¢â€â‚¬ Heading Ã¢â‚¬â€ trigger on headingWrapRef (stable DOM node) Ã¢â€â‚¬Ã¢â€â‚¬
      const lines = headingLineRefs.current.filter(Boolean);
      if (lines.length && headingWrapRef.current) {
        gsap.set(lines, {
          yPercent: 110,
          scaleY: 0.62,
          autoAlpha: 0,
          filter: "blur(6px)",
          transformOrigin: "center bottom",
        });
        gsap.to(lines, {
          yPercent: 0,
          scaleY: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.15,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: headingWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Ã¢â€â‚¬Ã¢â€â‚¬ Groups stagger Ã¢â€â‚¬Ã¢â€â‚¬
      const groups = groupRefs.current.filter(Boolean);
      if (groups.length) {
        gsap.set(groups, { autoAlpha: 0, y: 32 });
        gsap.to(groups, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: groups[0],
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#f0ede6] px-6 py-24 sm:px-10 sm:py-28 md:px-14 lg:px-16"
    >
      <div className="mx-auto max-w-[1280px]">

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Heading Ã¢â‚¬â€ left aligned Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div ref={headingWrapRef} className="mb-20 sm:mb-24">
          <h2 className="font-italiana text-left text-[52px] sm:text-[72px] md:text-[88px] lg:text-[104px] xl:text-[116px] font-semibold leading-[0.9] tracking-[-0.03em] text-[#1a1a1a] uppercase">
            {HEADING_LINES.map((line, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  overflow: "hidden",
                  paddingBottom: "0.06em",
                }}
              >
                <span
                  ref={(el) => (headingLineRefs.current[i] = el)}
                  style={{
                    display: "block",
                    transformOrigin: "center bottom",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ 2-column FAQ grid Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 sm:grid-cols-2 lg:gap-x-24">
          {FAQ_GROUPS.map((group, i) => (
            <FAQGroup
              key={group.category}
              group={group}
              groupRef={(el) => (groupRefs.current[i] = el)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}


