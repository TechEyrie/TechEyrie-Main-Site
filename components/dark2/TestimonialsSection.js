import React from 'react';
import { ArrowRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    company: "TECHFLOW",
    name: "Sarah Johnson",
    role: "CTO at TechFlow",
    content: "The adoption rate has been remarkable, with more than 80% of TechFlow's engineering team incorporating it into their workflow and a level of engagement that is unparalleled compared with other dev tools.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 2,
    company: "STARTUPX",
    name: "Michael Chen",
    role: "Founder",
    content: "We've seen a dramatic shift in how we handle our search infrastructure. The precision and speed are exactly what we needed to scale our operations effectively.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 3,
    company: "CREATIVECORP",
    name: "Emily Davis",
    role: "Product Manager",
    content: "It's rare to find a tool that balances power with simplicity so well. My team was able to integrate it within days and the results were immediate.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 4,
    company: "BRANDIFY",
    name: "David Wilson",
    role: "Director of Marketing",
    content: "The insights we gather now are far more actionable. It's not just about search, it's about understanding our data in a way we couldn't before.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: 5,
    company: "INNOVATEDAILY",
    name: "Jessica Brown",
    role: "CEO",
    content: "A game changer for our legal tech stack. The accuracy is impressive, and the support team has been fantastic to work with throughout the process.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

export default function TestimonialsSection({ theme }) {
  // Theme Color Logic
  const isDark = theme === 'dark';
  
  // Color Palettes
  const lightColors = {
    primary: "#013825",      // Deep Forest Green
    secondary: "#9E8F72",    // Golden Brown (updated)
    tertiary: "#CEC8B0",     // Light Beige/Tan (updated)
    background: "#F9F7F0",   // Very light neutral for section background
  };

  const bgColor = isDark ? '' : '';
  const bgColorStyle = isDark
    ? {
        background: 'linear-gradient(to bottom, #1a5c6b 0%, #1b4732 50%, #162d24 100%)',
      }
    : { backgroundColor: lightColors.background };
  const textColor = isDark ? 'text-[#f3f3f3]' : 'text-slate-900';
  const headingColor = isDark ? 'text-[#f3f3f3]' : 'text-slate-900';
  const cardBg = isDark ? 'bg-[#162D24]' : '';
  const cardBgStyle = isDark ? { backgroundColor: '#162D24' } : { backgroundColor: lightColors.tertiary };
  const cardText = 'text-[#e0d1b6]';
  const cardShadow = isDark ? 'shadow-xl' : 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]'; // Softer shadow on light



  return (
    <div
      className={`min-h-[150vh] ${textColor} selection:bg-indigo-500/30 transition-colors duration-500 ${bgColor}`}
      style={bgColorStyle}
    >
        
        <div className="relative">
            {/* Sticky Heading Section (FAQ: font-italiana, 32→40→48→56→64→72→80, #f3f3f3) */}
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center -z-0 overflow-hidden px-4">
                <h1 className={`font-italiana font-light text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] 3xl:text-[80px] text-center leading-tight tracking-[0.01em] ${headingColor} transition-colors duration-500`}>
                    What people say<br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>about TechEyerie
                </h1>
            </div>

            {/* Scrollable Cards Section (FAQ: merriweather / playfair, 12→15px, #d0d0d0 / #a0a0a0) */}
            <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5 md:gap-6 pb-16 sm:pb-20 md:pb-24 lg:pb-32 pt-10 sm:pt-[18vh] md:pt-[20vh] px-4 sm:px-6 w-full">
                {testimonials.map((t) => (
                    <div 
                        key={t.id} 
                        className={`w-full max-w-full sm:max-w-lg md:max-w-xl ${cardBg} ${cardText} p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-xl sm:rounded-2xl ${cardShadow} transition-all duration-300 hover:scale-[1.01] font-merriweather`}
                        style={cardBgStyle}
                    >
                        {/* Company Name */}
                        <div className="mb-4 sm:mb-6 md:mb-8">
                            <h4 className="font-merriweather font-semibold text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] tracking-widest uppercase text-gray-600">{t.company}</h4>
                        </div>

                        {/* Quote */}
                        <blockquote className="font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[15px] leading-relaxed mb-8 sm:mb-10 md:mb-12">
                            "{t.content}"
                        </blockquote>

                        {/* Profile Footer */}
                        <div className="flex items-center justify-between border-t border-gray-300/50 pt-5 sm:pt-6 md:pt-8">
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                <img 
                                    src={t.image} 
                                    alt={t.name} 
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover grayscale"
                                />
                                <div>
                                    <h5 className="font-merriweather font-semibold text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px]">{t.name}</h5>
                                    <p className="font-merriweather text-[12px] sm:text-[13px] md:text-[14px] text-gray-600">{t.role}</p>
                                </div>
                            </div>
                            
                            {/* Arrow Icon Circle */}
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-black hover:text-white transition-colors duration-300 flex-shrink-0">
                                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
             
            
        </div>
    </div>
  );
}
