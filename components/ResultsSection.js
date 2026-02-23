// components/ResultsSection.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'Since we started with Dapper we finally have prospects reaching out to us, instead of relying on outbound.',
    author: 'George Borst',
    role: 'Business Development Lead',
    company: 'FOCUS-ON',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 2,
    quote:
      'Dapper constantly improves results in a proactive and very structured way; this makes the company stand out.',
    author: 'Sammie Perkins',
    role: 'Director Marketing EMEA',
    company: 'Ultimaker',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 3,
    quote:
      'Working with Dapper has transformed our approach to demand generation. The results speak for themselves.',
    author: 'Jane Smith',
    role: 'VP Marketing',
    company: 'TechCorp',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 4,
    quote:
      'The strategic approach and execution from Dapper have exceeded our expectations in every way possible.',
    author: 'Michael Chen',
    role: 'Head of Growth',
    company: 'CloudScale',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: 5,
    quote:
      'Our pipeline has never been stronger. Dapper understands B2B marketing at a level few agencies do.',
    author: 'Sarah Williams',
    role: 'CMO',
    company: 'DataFlow',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop',
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
];

export default function ResultsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const dragState = useRef({
    isDown: false,
    startX: 0,
    currentTranslate: 0,
    targetTranslate: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
    isButtonScrolling: false,
    useCSS: false,
  });

  // Responsive: 1 card on small screens, 2 on lg+
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, TESTIMONIALS.length - cardsPerView);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  const handlePrev = () => {
    if (!canPrev) return;
    const state = dragState.current;
    state.isButtonScrolling = true;
    state.useCSS = true;
    
    setCurrentIndex((prev) => {
      const newIndex = Math.max(0, prev - 1);
      const newTranslate = -(100 / cardsPerView) * newIndex;
      state.targetTranslate = newTranslate;
      state.currentTranslate = newTranslate;
      state.velocity = 0;
      return newIndex;
    });

    setTimeout(() => {
      state.isButtonScrolling = false;
      state.useCSS = false;
    }, 700);
  };

  const handleNext = () => {
    if (!canNext) return;
    const state = dragState.current;
    state.isButtonScrolling = true;
    state.useCSS = true;
    
    setCurrentIndex((prev) => {
      const newIndex = Math.min(maxIndex, prev + 1);
      const newTranslate = -(100 / cardsPerView) * newIndex;
      state.targetTranslate = newTranslate;
      state.currentTranslate = newTranslate;
      state.velocity = 0;
      return newIndex;
    });

    setTimeout(() => {
      state.isButtonScrolling = false;
      state.useCSS = false;
    }, 700);
  };

  // Smooth animation loop (only for drag)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const state = dragState.current;

    const smoothAnimation = () => {
      // Only use RAF when dragging or has momentum, not for button clicks
      if (!state.useCSS && !state.isButtonScrolling) {
        if (!state.isDown) {
          // Apply momentum
          if (Math.abs(state.velocity) > 0.05) {
            state.targetTranslate += state.velocity;
            state.velocity *= 0.92;
          }
        }

        // Smooth interpolation for drag
        if (state.isDown || Math.abs(state.velocity) > 0.05) {
          const ease = 0.12;
          state.currentTranslate += (state.targetTranslate - state.currentTranslate) * ease;
          
          // Apply transform
          slider.style.transition = 'none';
          slider.style.transform = `translateX(${state.currentTranslate}%)`;
        }

        // Clamp to valid range
        const minTranslate = -(100 / cardsPerView) * maxIndex;
        const maxTranslate = 0;

        if (state.currentTranslate < minTranslate) {
          state.currentTranslate = minTranslate;
          state.targetTranslate = minTranslate;
          state.velocity = 0;
        } else if (state.currentTranslate > maxTranslate) {
          state.currentTranslate = maxTranslate;
          state.targetTranslate = maxTranslate;
          state.velocity = 0;
        }
      }

      animationRef.current = requestAnimationFrame(smoothAnimation);
    };

    // Initialize positions
    const initialTranslate = -(100 / cardsPerView) * currentIndex;
    state.currentTranslate = initialTranslate;
    state.targetTranslate = initialTranslate;

    animationRef.current = requestAnimationFrame(smoothAnimation);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cardsPerView, currentIndex, maxIndex]);

  // Update CSS transform when using buttons
  useEffect(() => {
    const slider = sliderRef.current;
    const state = dragState.current;
    if (!slider) return;

    if (state.useCSS) {
      const translateValue = -(100 / cardsPerView) * currentIndex;
      slider.style.transition = 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)';
      slider.style.transform = `translateX(${translateValue}%)`;
    }
  }, [currentIndex, cardsPerView]);

  // Drag handlers
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const state = dragState.current;
    const container = slider.parentElement;

    const onMouseDown = (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }

      state.isDown = true;
      state.isButtonScrolling = false;
      state.useCSS = false;
      state.startX = e.pageX;
      state.lastX = e.pageX;
      state.lastTime = Date.now();
      state.velocity = 0;

      container.style.cursor = 'grabbing';
      slider.style.willChange = 'transform';
    };

    const onMouseMove = (e) => {
      if (!state.isDown) return;
      e.preventDefault();

      const currentTime = Date.now();
      const containerWidth = container.getBoundingClientRect().width;
      const deltaX = e.pageX - state.startX;
      const timeDelta = currentTime - state.lastTime;

      const percentMove = (deltaX / containerWidth) * 100;
      const baseTranslate = -(100 / cardsPerView) * currentIndex;
      state.targetTranslate = baseTranslate + percentMove;

      if (timeDelta > 0) {
        const moveX = e.pageX - state.lastX;
        const percentMoveX = (moveX / containerWidth) * 100;
        state.velocity = (percentMoveX / timeDelta) * 16;
      }

      state.lastX = e.pageX;
      state.lastTime = currentTime;
    };

    const onMouseUp = () => {
      if (!state.isDown) return;
      state.isDown = false;

      container.style.cursor = 'grab';
      slider.style.willChange = 'auto';

      setTimeout(() => {
        const cardPercentage = 100 / cardsPerView;
        const currentOffset = Math.abs(state.currentTranslate);
        const nearestIndex = Math.round(currentOffset / cardPercentage);
        const clampedIndex = Math.max(0, Math.min(maxIndex, nearestIndex));
        
        if (clampedIndex !== currentIndex) {
          state.useCSS = true;
          setCurrentIndex(clampedIndex);
          slider.style.transition = 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)';
          
          setTimeout(() => {
            state.useCSS = false;
          }, 400);
        }
        
        state.targetTranslate = -(100 / cardsPerView) * clampedIndex;
        state.currentTranslate = state.targetTranslate;
        state.velocity = 0;
      }, 100);
    };

    const onMouseLeave = () => {
      if (state.isDown) {
        onMouseUp();
      }
    };

    // Touch events for mobile
    const onTouchStart = (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }

      state.isDown = true;
      state.isButtonScrolling = false;
      state.useCSS = false;
      state.startX = e.touches[0].pageX;
      state.lastX = e.touches[0].pageX;
      state.lastTime = Date.now();
      state.velocity = 0;

      slider.style.willChange = 'transform';
    };

    const onTouchMove = (e) => {
      if (!state.isDown) return;

      const currentTime = Date.now();
      const containerWidth = container.getBoundingClientRect().width;
      const deltaX = e.touches[0].pageX - state.startX;
      const timeDelta = currentTime - state.lastTime;

      const percentMove = (deltaX / containerWidth) * 100;
      const baseTranslate = -(100 / cardsPerView) * currentIndex;
      state.targetTranslate = baseTranslate + percentMove;

      if (timeDelta > 0) {
        const moveX = e.touches[0].pageX - state.lastX;
        const percentMoveX = (moveX / containerWidth) * 100;
        state.velocity = (percentMoveX / timeDelta) * 16;
      }

      state.lastX = e.touches[0].pageX;
      state.lastTime = currentTime;
    };

    const onTouchEnd = () => {
      if (!state.isDown) return;
      state.isDown = false;

      slider.style.willChange = 'auto';

      setTimeout(() => {
        const cardPercentage = 100 / cardsPerView;
        const currentOffset = Math.abs(state.currentTranslate);
        const nearestIndex = Math.round(currentOffset / cardPercentage);
        const clampedIndex = Math.max(0, Math.min(maxIndex, nearestIndex));
        
        if (clampedIndex !== currentIndex) {
          state.useCSS = true;
          setCurrentIndex(clampedIndex);
          slider.style.transition = 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)';
          
          setTimeout(() => {
            state.useCSS = false;
          }, 400);
        }
        
        state.targetTranslate = -(100 / cardsPerView) * clampedIndex;
        state.currentTranslate = state.targetTranslate;
        state.velocity = 0;
      }, 100);
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [cardsPerView, currentIndex, maxIndex]);

  return (
    <section className="bg-[#EFEFEF] py-20 sm:py-24">
      <div className="mx-auto max-w-[1800px] px-4 md:px-8">
        {/* Label above everything */}
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <span className="inline-flex h-5 w-5 rounded-sm bg-[#74F5A1]" />
          <span className="font-[Helvetica Now Text,Arial,sans-serif] text-[12px] sm:text-[13px] md:text-[14px] font-semibold tracking-[0.16em] uppercase text-[#111111]">
            Results
          </span>
        </div>

        {/* Heading left, copy/CTA right */}
        <div className="mb-10 grid gap-8 sm:gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="font-[Helvetica Now Text,Arial,sans-serif] leading-[1.02] tracking-tight text-[#111111]">
              <span className="block text-[32px] sm:text-[40px] md:text-[56px] lg:text-[70px] xl:text-[82px] font-semibold">
                Driven by a
              </span>
              <span className="block text-[32px] sm:text-[40px] md:text-[56px] lg:text-[70px] xl:text-[82px] font-semibold">
                <span className="font-ivy-presto font-normal">performance</span>{' '}
                mindset
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-5 sm:gap-6 lg:max-w-[600px]">
            <p className="font-[Helvetica Now Text,Arial,sans-serif] text-[15px] sm:text-[17px] md:text-[21px] font-semibold leading-relaxed text-[#212121]">
              You don&apos;t just hire experts - you hire people with a drive to
              deliver results. The Dapper team thrives on impact. When you work
              with us, you&apos;ll work with a team as ambitious about growth as
              you are.
            </p>

            <Link
              href="/cases"
              className="group inline-flex items-center gap-2 self-start rounded-[10px] border border-black/10 bg-white px-4 py-2.5 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.10] hover:-translate-y-[1px]"
            >
              <span className="font-[Helvetica Now Text,Arial,sans-serif] text-[13px] sm:text-[16px] font-semibold tracking-tight text-[#111111]">
                Explore our cases
              </span>

              <span className="relative inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-[4px] bg-[#74F5A1] transition-colors duration-500 group-hover:bg-black">
                <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:opacity-0">
                  <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M1 13L13 1M13 1H5M13 1V9"
                      fill="none"
                      stroke="#212121"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="absolute inset-0 flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M1 13L13 1M13 1H5M13 1V9"
                      fill="none"
                      stroke="#74F5A1"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </Link>

          </div>
        </div>

        {/* Slider + nav */}
        <div className="relative mt-4 sm:mt-6">
          <div className="mb-4 flex justify-center gap-2 sm:justify-end">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              disabled={!canPrev}
              className={[
                'flex h-9 w-9 items-center justify-center rounded-[6px] text-white transition z-10 relative',
                canPrev
                  ? 'bg-[#111111] hover:bg-black cursor-pointer'
                  : 'bg-[#D3D3D3] cursor-not-allowed',
              ].join(' ')}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M10 4L6 8L10 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              disabled={!canNext}
              className={[
                'flex h-9 w-9 items-center justify-center rounded-[6px] text-white transition z-10 relative',
                canNext
                  ? 'bg-[#111111] hover:bg-black cursor-pointer'
                  : 'bg-[#D3D3D3] cursor-not-allowed',
              ].join(' ')}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="overflow-hidden cursor-grab active:cursor-grabbing select-none">
            <div ref={sliderRef} className="flex -mx-2 sm:-mx-3">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="basis-full px-2 flex-shrink-0 sm:px-3 lg:basis-1/2"
                >
                  <article className="relative flex h-full min-h-[280px] flex-col justify-between rounded-2xl border border-black/[0.06] bg-white px-4 py-7 shadow-[0_10px_30px_rgba(0,0,0,0.10)] sm:min-h-[360px] sm:px-6 sm:py-9 md:min-h-[420px] lg:px-10 lg:py-14 pointer-events-none">
                    <blockquote className="border-l-4 border-[#111111] pl-4 sm:pl-6 font-merriweather text-[17px] sm:text-[20px] md:text-[24px] lg:text-[30px] leading-snug text-[#111111]">
                      "{testimonial.quote}"
                    </blockquote>

                    <div className="mt-7 flex items-center justify-between gap-4 sm:mt-9">
                      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-14 sm:w-14">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-merriweather text-[14px] sm:text-[15px] font-semibold text-[#111111] truncate">
                            {testimonial.author}
                          </p>
                          <p className="font-merriweather text-[12px] sm:text-[13px] font-medium text-[#444444] truncate">
                            {testimonial.role} – {testimonial.company}
                          </p>
                        </div>
                      </div>

                      <div className="relative h-7 w-20 flex-shrink-0 sm:h-8 sm:w-24">
                        <Image
                          src={testimonial.logo}
                          alt={`${testimonial.company} logo`}
                          fill
                          className="object-contain object-right"
                        />
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
