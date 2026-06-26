// // components/ResultsSection.jsx
// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const TESTIMONIALS = [
//   {
//     id: 1,
//     quote:
//       "Since we started with Dapper we finally have prospects reaching out to us, instead of relying on outbound.",
//     author: "George Borst",
//     role: "Business Development Lead",
//     company: "FOCUS-ON",
//     logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
//     avatar: "https://i.pravatar.cc/150?img=12",
//   },
//   {
//     id: 2,
//     quote:
//       "Dapper constantly improves results in a proactive and very structured way; this makes the company stand out.",
//     author: "Sammie Perkins",
//     role: "Director Marketing EMEA",
//     company: "Ultimaker",
//     logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
//     avatar: "https://i.pravatar.cc/150?img=5",
//   },
//   {
//     id: 3,
//     quote:
//       "Working with Dapper has transformed our approach to demand generation. The results speak for themselves.",
//     author: "Jane Smith",
//     role: "VP Marketing",
//     company: "TechCorp",
//     logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
//     avatar: "https://i.pravatar.cc/150?img=20",
//   },
//   {
//     id: 4,
//     quote:
//       "The strategic approach and execution from Dapper have exceeded our expectations in every way possible.",
//     author: "Michael Chen",
//     role: "Head of Growth",
//     company: "CloudScale",
//     logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
//     avatar: "https://i.pravatar.cc/150?img=33",
//   },
//   {
//     id: 5,
//     quote:
//       "Our pipeline has never been stronger. Dapper understands B2B marketing at a level few agencies do.",
//     author: "Sarah Williams",
//     role: "CMO",
//     company: "DataFlow",
//     logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
//     avatar: "https://i.pravatar.cc/150?img=45",
//   },
// ];

// export default function ResultsSection({ theme = "light" }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [cardsPerView, setCardsPerView] = useState(1);
//   const sliderRef = useRef(null);
//   const animationRef = useRef(null);
//   const containerRef = useRef(null);

//   // Triangle animation effects
//   const [triangles, setTriangles] = useState([]);
//   const triangleIdRef = useRef(0);

//   const dragState = useRef({
//     isDown: false,
//     startX: 0,
//     currentTranslate: 0,
//     targetTranslate: 0,
//     velocity: 0,
//     lastX: 0,
//     lastTime: 0,
//     isButtonScrolling: false,
//     useCSS: false,
//   });

//   // Background styles based on theme
//   const bgStyle =
//     theme === "dark"
//       ? {
//           backgroundColor: "#2b2b2b",
//           backgroundImage: `
//           url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
//           radial-gradient(ellipse at top left, rgba(60, 60, 60, 0.3), transparent 50%),
//           radial-gradient(ellipse at bottom right, rgba(50, 50, 50, 0.2), transparent 50%)
//         `,
//           backgroundBlendMode: "overlay, normal, normal",
//         }
//       : { backgroundColor: "#EFEFEF" };

//   const noiseOverlayStyle = {
//     backgroundImage: `
//       repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
//       repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
//       repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
//     `,
//   };

//   const createTriangle = useCallback((x, y) => {
//     const id = triangleIdRef.current++;
//     const size = Math.random() * 5 + 8;
//     const rotation = Math.random() * 360;
//     const greenShades = ["#E8DCC8", "#8FB89A", "#8FB89A", "#8FB89A"];
//     const color = greenShades[Math.floor(Math.random() * greenShades.length)];

//     const newTriangle = {
//       id,
//       x,
//       y,
//       size,
//       rotation,
//       color,
//     };

//     setTriangles((prev) => [...prev, newTriangle]);

//     setTimeout(() => {
//       setTriangles((prev) => prev.filter((t) => t.id !== id));
//     }, 1050);
//   }, []);

//   useEffect(() => {
//     const section = containerRef.current?.closest("section");
//     if (!section) return;

//     let lastTime = 0;
//     const throttleDelay = 100;

//     const handleMouseMove = (e) => {
//       const currentTime = Date.now();
//       if (currentTime - lastTime < throttleDelay) return;
//       lastTime = currentTime;

//       const rect = section.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       createTriangle(x, y);
//     };

//     section.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       section.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, [createTriangle]);

//   // Responsive: 1 card on small screens, 2 on lg+
//   useEffect(() => {
//     const updateCardsPerView = () => {
//       if (window.innerWidth >= 1024) {
//         setCardsPerView(2);
//       } else {
//         setCardsPerView(1);
//       }
//     };

//     updateCardsPerView();

//     const handleResize = () => {
//       updateCardsPerView();
//       // Reset position on resize
//       const newTranslate = -(100 / cardsPerView) * currentIndex;
//       dragState.current.currentTranslate = newTranslate;
//       dragState.current.targetTranslate = newTranslate;
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [cardsPerView, currentIndex]);

//   const maxIndex = Math.max(0, TESTIMONIALS.length - cardsPerView);
//   const canPrev = currentIndex > 0;
//   const canNext = currentIndex < maxIndex;

//   const handlePrev = () => {
//     if (!canPrev) return;
//     const state = dragState.current;
//     state.isButtonScrolling = true;
//     state.useCSS = true;

//     setCurrentIndex((prev) => {
//       const newIndex = Math.max(0, prev - 1);
//       const newTranslate = -(100 / cardsPerView) * newIndex;
//       state.targetTranslate = newTranslate;
//       state.currentTranslate = newTranslate;
//       state.velocity = 0;
//       return newIndex;
//     });

//     setTimeout(() => {
//       state.isButtonScrolling = false;
//       state.useCSS = false;
//     }, 700);
//   };

//   const handleNext = () => {
//     if (!canNext) return;
//     const state = dragState.current;
//     state.isButtonScrolling = true;
//     state.useCSS = true;

//     setCurrentIndex((prev) => {
//       const newIndex = Math.min(maxIndex, prev + 1);
//       const newTranslate = -(100 / cardsPerView) * newIndex;
//       state.targetTranslate = newTranslate;
//       state.currentTranslate = newTranslate;
//       state.velocity = 0;
//       return newIndex;
//     });

//     setTimeout(() => {
//       state.isButtonScrolling = false;
//       state.useCSS = false;
//     }, 700);
//   };

//   // Smooth animation loop (only for drag)
//   useEffect(() => {
//     const slider = sliderRef.current;
//     if (!slider) return;

//     const state = dragState.current;

//     const smoothAnimation = () => {
//       // Only use RAF when dragging or has momentum, not for button clicks
//       if (!state.useCSS && !state.isButtonScrolling) {
//         if (!state.isDown) {
//           // Apply momentum
//           if (Math.abs(state.velocity) > 0.05) {
//             state.targetTranslate += state.velocity;
//             state.velocity *= 0.92;
//           }
//         }

//         // Smooth interpolation for drag
//         if (state.isDown || Math.abs(state.velocity) > 0.05) {
//           const ease = 0.12;
//           state.currentTranslate +=
//             (state.targetTranslate - state.currentTranslate) * ease;

//           // Apply transform
//           slider.style.transition = "none";
//           slider.style.transform = `translateX(${state.currentTranslate}%)`;
//         }

//         // Clamp to valid range
//         const minTranslate = -(100 / cardsPerView) * maxIndex;
//         const maxTranslate = 0;

//         if (state.currentTranslate < minTranslate) {
//           state.currentTranslate = minTranslate;
//           state.targetTranslate = minTranslate;
//           state.velocity = 0;
//         } else if (state.currentTranslate > maxTranslate) {
//           state.currentTranslate = maxTranslate;
//           state.targetTranslate = maxTranslate;
//           state.velocity = 0;
//         }
//       }

//       animationRef.current = requestAnimationFrame(smoothAnimation);
//     };

//     // Initialize positions
//     const initialTranslate = -(100 / cardsPerView) * currentIndex;
//     state.currentTranslate = initialTranslate;
//     state.targetTranslate = initialTranslate;

//     animationRef.current = requestAnimationFrame(smoothAnimation);

//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [cardsPerView, currentIndex, maxIndex]);

//   // Update CSS transform when using buttons
//   useEffect(() => {
//     const slider = sliderRef.current;
//     const state = dragState.current;
//     if (!slider) return;

//     if (state.useCSS) {
//       const translateValue = -(100 / cardsPerView) * currentIndex;
//       slider.style.transition = "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)";
//       slider.style.transform = `translateX(${translateValue}%)`;
//     }
//   }, [currentIndex, cardsPerView]);

//   // Drag handlers
//   useEffect(() => {
//     const slider = sliderRef.current;
//     if (!slider) return;

//     const state = dragState.current;
//     const container = containerRef.current;

//     const onMouseDown = (e) => {
//       if (e.target.closest("a") || e.target.closest("button")) {
//         return;
//       }

//       state.isDown = true;
//       state.isButtonScrolling = false;
//       state.useCSS = false;
//       state.startX = e.pageX;
//       state.lastX = e.pageX;
//       state.lastTime = Date.now();
//       state.velocity = 0;

//       if (container) {
//         container.style.cursor = "grabbing";
//       }
//       slider.style.willChange = "transform";
//     };

//     const onMouseMove = (e) => {
//       if (!state.isDown) return;
//       e.preventDefault();

//       const currentTime = Date.now();
//       const containerWidth = container
//         ? container.getBoundingClientRect().width
//         : window.innerWidth;
//       const deltaX = e.pageX - state.startX;
//       const timeDelta = currentTime - state.lastTime;

//       const percentMove = (deltaX / containerWidth) * 100;
//       const baseTranslate = -(100 / cardsPerView) * currentIndex;
//       state.targetTranslate = baseTranslate + percentMove;

//       if (timeDelta > 0) {
//         const moveX = e.pageX - state.lastX;
//         const percentMoveX = (moveX / containerWidth) * 100;
//         state.velocity = (percentMoveX / timeDelta) * 16;
//       }

//       state.lastX = e.pageX;
//       state.lastTime = currentTime;
//     };

//     const onMouseUp = () => {
//       if (!state.isDown) return;
//       state.isDown = false;

//       if (container) {
//         container.style.cursor = "grab";
//       }
//       slider.style.willChange = "auto";

//       setTimeout(() => {
//         const cardPercentage = 100 / cardsPerView;
//         const currentOffset = Math.abs(state.currentTranslate);
//         const nearestIndex = Math.round(currentOffset / cardPercentage);
//         const clampedIndex = Math.max(0, Math.min(maxIndex, nearestIndex));

//         if (clampedIndex !== currentIndex) {
//           state.useCSS = true;
//           setCurrentIndex(clampedIndex);
//           slider.style.transition =
//             "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)";

//           setTimeout(() => {
//             state.useCSS = false;
//           }, 400);
//         }

//         state.targetTranslate = -(100 / cardsPerView) * clampedIndex;
//         state.currentTranslate = state.targetTranslate;
//         state.velocity = 0;
//       }, 100);
//     };

//     const onMouseLeave = () => {
//       if (state.isDown) {
//         onMouseUp();
//       }
//     };

//     // Touch events for mobile
//     const onTouchStart = (e) => {
//       if (e.target.closest("a") || e.target.closest("button")) {
//         return;
//       }

//       state.isDown = true;
//       state.isButtonScrolling = false;
//       state.useCSS = false;
//       state.startX = e.touches[0].pageX;
//       state.lastX = e.touches[0].pageX;
//       state.lastTime = Date.now();
//       state.velocity = 0;

//       slider.style.willChange = "transform";
//     };

//     const onTouchMove = (e) => {
//       if (!state.isDown) return;

//       const currentTime = Date.now();
//       const containerWidth = container
//         ? container.getBoundingClientRect().width
//         : window.innerWidth;
//       const deltaX = e.touches[0].pageX - state.startX;
//       const timeDelta = currentTime - state.lastTime;

//       const percentMove = (deltaX / containerWidth) * 100;
//       const baseTranslate = -(100 / cardsPerView) * currentIndex;
//       state.targetTranslate = baseTranslate + percentMove;

//       if (timeDelta > 0) {
//         const moveX = e.touches[0].pageX - state.lastX;
//         const percentMoveX = (moveX / containerWidth) * 100;
//         state.velocity = (percentMoveX / timeDelta) * 16;
//       }

//       state.lastX = e.touches[0].pageX;
//       state.lastTime = currentTime;
//     };

//     const onTouchEnd = () => {
//       if (!state.isDown) return;
//       state.isDown = false;

//       slider.style.willChange = "auto";

//       setTimeout(() => {
//         const cardPercentage = 100 / cardsPerView;
//         const currentOffset = Math.abs(state.currentTranslate);
//         const nearestIndex = Math.round(currentOffset / cardPercentage);
//         const clampedIndex = Math.max(0, Math.min(maxIndex, nearestIndex));

//         if (clampedIndex !== currentIndex) {
//           state.useCSS = true;
//           setCurrentIndex(clampedIndex);
//           slider.style.transition =
//             "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)";

//           setTimeout(() => {
//             state.useCSS = false;
//           }, 400);
//         }

//         state.targetTranslate = -(100 / cardsPerView) * clampedIndex;
//         state.currentTranslate = state.targetTranslate;
//         state.velocity = 0;
//       }, 100);
//     };

//     if (container) {
//       container.addEventListener("mousedown", onMouseDown);
//       container.addEventListener("mousemove", onMouseMove);
//       container.addEventListener("mouseup", onMouseUp);
//       container.addEventListener("mouseleave", onMouseLeave);
//       container.addEventListener("touchstart", onTouchStart, { passive: true });
//       container.addEventListener("touchmove", onTouchMove, { passive: true });
//       container.addEventListener("touchend", onTouchEnd);
//     }

//     return () => {
//       if (container) {
//         container.removeEventListener("mousedown", onMouseDown);
//         container.removeEventListener("mousemove", onMouseMove);
//         container.removeEventListener("mouseup", onMouseUp);
//         container.removeEventListener("mouseleave", onMouseLeave);
//         container.removeEventListener("touchstart", onTouchStart);
//         container.removeEventListener("touchmove", onTouchMove);
//         container.removeEventListener("touchend", onTouchEnd);
//       }
//     };
//   }, [cardsPerView, currentIndex, maxIndex]);

//   return (
//     <>
//       <style jsx>{`
//         @keyframes triangle-fade {
//           0% {
//             opacity: 0.7;
//             transform: translate(-50%, -50%) scale(1);
//           }
//           100% {
//             opacity: 0;
//             transform: translate(-50%, -50%) scale(1.5);
//           }
//         }

//         .animate-triangle-fade {
//           animation: triangle-fade 1.05s ease-out forwards;
//         }
//       `}</style>

//       <section
//         ref={containerRef}
//         className="relative overflow-hidden py-20 sm:py-24"
//         style={bgStyle}
//       >
//         {/* Noise texture overlay */}
//         {theme === "dark" && (
//           <div
//             className="absolute inset-0 pointer-events-none z-[1]"
//             style={noiseOverlayStyle}
//           />
//         )}

//         {/* CURSOR TRAIL TRIANGLES */}
//         {triangles.map((triangle) => (
//           <div
//             key={triangle.id}
//             className="pointer-events-none absolute z-[5] animate-triangle-fade"
//             style={{
//               left: `${triangle.x}px`,
//               top: `${triangle.y}px`,
//               width: "0",
//               height: "0",
//               borderLeft: `${triangle.size / 2}px solid transparent`,
//               borderRight: `${triangle.size / 2}px solid transparent`,
//               borderBottom: `${triangle.size}px solid ${triangle.color}`,
//               transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)`,
//               opacity: 0.7,
//             }}
//           />
//         ))}

//         <div className="relative z-10 mx-auto max-w-[1800px] px-4 md:px-8">
//           {/* Label above everything */}
//           <div className="mb-5 flex items-center gap-3 sm:mb-6">
//             <span className="inline-flex h-5 w-5 rounded-sm bg-[#E8DCC8]" />
//             <span
//               className={`font-[Helvetica Now Text,Arial,sans-serif] text-[12px] sm:text-[13px] md:text-[14px] font-semibold tracking-[0.16em] uppercase ${
//                 theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
//               }`}
//             >
//               Results
//             </span>
//           </div>

//           {/* Heading left, copy/CTA right */}
//           <div className="mb-10 grid gap-8 sm:gap-10 lg:grid-cols-[1.2fr_1fr]">
//             <div>
//               <h2
//                 className={`font-[Helvetica Now Text,Arial,sans-serif] leading-[1.02] tracking-tight ${
//                   theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
//                 }`}
//               >
//                 <span className="block text-[32px] sm:text-[40px] md:text-[56px] lg:text-[70px] xl:text-[82px] font-semibold">
//                   Driven by a
//                 </span>
//                 <span className="block text-[32px] sm:text-[40px] md:text-[56px] lg:text-[70px] xl:text-[82px] font-semibold">
//                   <span className="font-ivy-presto font-normal">
//                     performance
//                   </span>{" "}
//                   mindset
//                 </span>
//               </h2>
//             </div>

//             <div className="flex flex-col gap-5 sm:gap-6 lg:max-w-[600px]">
//               <p
//                 className={`font-[Helvetica Now Text,Arial,sans-serif] text-[15px] sm:text-[17px] md:text-[21px] font-semibold leading-relaxed ${
//                   theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
//                 }`}
//               >
//                 You don&apos;t just hire experts - you hire people with a drive
//                 to deliver results. The Dapper team thrives on impact. When you
//                 work with us, you&apos;ll work with a team as ambitious about
//                 growth as you are.
//               </p>

//               <Link
//                 href="/cases"
//                 className={`group inline-flex items-center gap-2 self-start rounded-[10px] border ${
//                   theme === "dark"
//                     ? "border-white/10 bg-[#3a3a3a]"
//                     : "border-black/10 bg-white"
//                 } px-4 py-2.5 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.10] hover:-translate-y-[1px]`}
//               >
//                 <span
//                   className={`font-[Helvetica Now Text,Arial,sans-serif] text-[13px] sm:text-[16px] font-semibold tracking-tight ${
//                     theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
//                   }`}
//                 >
//                   Explore our cases
//                 </span>

//                 <span
//                   className={`relative inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-[4px] ${
//                     theme === "dark"
//                       ? "bg-[#E8DCC8] group-hover:bg-white"
//                       : "bg-[#E8DCC8] group-hover:bg-black"
//                   } transition-colors duration-500`}
//                 >
//                   <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:opacity-0">
//                     <svg
//                       width="12"
//                       height="12"
//                       viewBox="0 0 14 14"
//                       aria-hidden="true"
//                     >
//                       <path
//                         d="M1 13L13 1M13 1H5M13 1V9"
//                         fill="none"
//                         stroke={theme === "dark" ? "#111111" : "#212121"}
//                         strokeWidth="1.8"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </span>

//                   <span className="absolute inset-0 flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
//                     <svg
//                       width="12"
//                       height="12"
//                       viewBox="0 0 14 14"
//                       aria-hidden="true"
//                     >
//                       <path
//                         d="M1 13L13 1M13 1H5M13 1V9"
//                         fill="none"
//                         stroke={theme === "dark" ? "#111111" : "#E8DCC8"}
//                         strokeWidth="1.8"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </span>
//                 </span>
//               </Link>
//             </div>
//           </div>

//           {/* Slider + nav */}
//           <div className="relative mt-4 sm:mt-6">
//             <div className="mb-4 flex justify-center gap-2 sm:justify-end">
//               <button
//                 onClick={handlePrev}
//                 aria-label="Previous testimonial"
//                 disabled={!canPrev}
//                 className={[
//                   "flex h-9 w-9 items-center justify-center rounded-[6px] text-white transition z-10 relative",
//                   canPrev
//                     ? theme === "dark"
//                       ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-pointer"
//                       : "bg-[#111111] hover:bg-black cursor-pointer"
//                     : theme === "dark"
//                     ? "bg-[#3a3a3a]/50 cursor-not-allowed"
//                     : "bg-[#D3D3D3] cursor-not-allowed",
//                 ].join(" ")}
//               >
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 16 16"
//                   fill="none"
//                   aria-hidden="true"
//                 >
//                   <path
//                     d="M10 4L6 8L10 12"
//                     stroke="currentColor"
//                     strokeWidth="1.8"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//               <button
//                 onClick={handleNext}
//                 aria-label="Next testimonial"
//                 disabled={!canNext}
//                 className={[
//                   "flex h-9 w-9 items-center justify-center rounded-[6px] text-white transition z-10 relative",
//                   canNext
//                     ? theme === "dark"
//                       ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-pointer"
//                       : "bg-[#111111] hover:bg-black cursor-pointer"
//                     : theme === "dark"
//                     ? "bg-[#3a3a3a]/50 cursor-not-allowed"
//                     : "bg-[#D3D3D3] cursor-not-allowed",
//                 ].join(" ")}
//               >
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 16 16"
//                   fill="none"
//                   aria-hidden="true"
//                 >
//                   <path
//                     d="M6 4L10 8L6 12"
//                     stroke="currentColor"
//                     strokeWidth="1.8"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div
//               ref={containerRef}
//               className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
//             >
//               <div ref={sliderRef} className="flex -mx-2 sm:-mx-3">
//                 {TESTIMONIALS.map((testimonial) => (
//                   <div
//                     key={testimonial.id}
//                     className="basis-full px-2 flex-shrink-0 sm:px-3 lg:basis-1/2"
//                   >
//                     <article
//                       className={`relative flex h-full min-h-[280px] flex-col justify-between rounded-2xl border ${
//                         theme === "dark"
//                           ? "border-white/[0.06] bg-[#2a2a2a]"
//                           : "border-black/[0.06] bg-white"
//                       } px-4 py-7 shadow-[0_10px_30px_rgba(0,0,0,0.10)] sm:min-h-[360px] sm:px-6 sm:py-9 md:min-h-[420px] lg:px-10 lg:py-14 pointer-events-none`}
//                     >
//                       <blockquote
//                         className={`border-l-4 ${
//                           theme === "dark"
//                             ? "border-[#f3f3f3]"
//                             : "border-[#111111]"
//                         } pl-4 sm:pl-6 font-[Helvetica Now Text,Arial,sans-serif] text-[17px] sm:text-[20px] md:text-[24px] lg:text-[30px] leading-snug ${
//                           theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
//                         }`}
//                       >
//                         "{testimonial.quote}"
//                       </blockquote>

//                       <div className="mt-7 flex items-center justify-between gap-4 sm:mt-9">
//                         <div className="flex min-w-0 items-center gap-3 sm:gap-4">
//                           <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-14 sm:w-14">
//                             <Image
//                               src={testimonial.avatar}
//                               alt={testimonial.author}
//                               fill
//                               className="object-cover"
//                               sizes="56px"
//                             />
//                           </div>
//                           <div className="min-w-0">
//                             <p
//                               className={`font-[Helvetica Now Text,Arial,sans-serif] text-[14px] sm:text-[15px] font-bold truncate ${
//                                 theme === "dark"
//                                   ? "text-[#f3f3f3]"
//                                   : "text-[#111111]"
//                               }`}
//                             >
//                               {testimonial.author}
//                             </p>
//                             <p
//                               className={`font-[Helvetica Now Text,Arial,sans-serif] text-[12px] sm:text-[13px] font-medium truncate ${
//                                 theme === "dark"
//                                   ? "text-[#a0a0a0]"
//                                   : "text-[#444444]"
//                               }`}
//                             >
//                               {testimonial.role} – {testimonial.company}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="relative h-7 w-20 flex-shrink-0 sm:h-8 sm:w-24">
//                           <Image
//                             src={testimonial.logo}
//                             alt={`${testimonial.company} logo`}
//                             fill
//                             className="object-contain object-right"
//                             sizes="96px"
//                           />
//                         </div>
//                       </div>
//                     </article>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }







































































// components/ResultsSection.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap"; // Import gsap

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Since we started with Dapper we finally have prospects reaching out to us, instead of relying on outbound.",
    author: "George Borst",
    role: "Business Development Lead",
    company: "FOCUS-ON",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    quote:
      "Dapper constantly improves results in a proactive and very structured way; this makes the company stand out.",
    author: "Sammie Perkins",
    role: "Director Marketing EMEA",
    company: "Ultimaker",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    quote:
      "Working with Dapper has transformed our approach to demand generation. The results speak for themselves.",
    author: "Jane Smith",
    role: "VP Marketing",
    company: "TechCorp",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: 4,
    quote:
      "The strategic approach and execution from Dapper have exceeded our expectations in every way possible.",
    author: "Michael Chen",
    role: "Head of Growth",
    company: "CloudScale",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: 5,
    quote:
      "Our pipeline has never been stronger. Dapper understands B2B marketing at a level few agencies do.",
    author: "Sarah Williams",
    role: "CMO",
    company: "DataFlow",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
];

export default function ResultsSection({ theme = "light" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  
  // Animation refs for electric text
  const animationIntervalRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Triangle animation effects
  const [triangles, setTriangles] = useState([]);
  const triangleIdRef = useRef(0);

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

  // Color Palettes
  const lightColors = {
    primary: "#013825",      // Deep Forest Green
    secondary: "#9E8F72",    // Golden Brown (updated)
    tertiary: "#CEC8B0",     // Light Beige/Tan (updated)
    background: "#F9F7F0",   // Very light neutral for section background
  };

  // Background styles based on theme
  const bgStyle =
    theme === "dark"
      ? {
          backgroundColor: "#2b2b2b",
          backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at top left, rgba(60, 60, 60, 0.3), transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(50, 50, 50, 0.2), transparent 50%)
        `,
          backgroundBlendMode: "overlay, normal, normal",
        }
      : { backgroundColor: lightColors.background };

  const noiseOverlayStyle = {
    backgroundImage: `
      repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px),
      repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 4px)
    `,
  };

  // --- ELECTRIC ANIMATION LOGIC ---

 const triggerElectricalAnimation = useCallback(() => {
    const titleLines = document.querySelectorAll(".hero-title-line");

    // Define colors based on theme
    const originalColor = theme === "dark" ? "#f3f3f3" : "#111111";
    const electricColor = theme === "dark" ? "#E8DCC8" : "#8FB89A";
    const brightElectricColor = theme === "dark" ? "#FFFFFF" : "#FFFFFF";

    // Create a single timeline for all lines
    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
      },
    });

    // Animate each line with an electrical sweep effect
    titleLines.forEach((line, lineIndex) => {
      // Get the text content
      const text = line.textContent;

      // Split text into spans for character-by-character animation
      if (!line.querySelector(".char")) {
        const chars = text
          .split("")
          .map(
            (char, i) =>
              `<span class="char" style="color: ${originalColor}; display: inline-block; position: relative;" data-index="${i}">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        line.innerHTML = chars;
      }

      // Animate each character with electrical effect
      const chars = line.querySelectorAll(".char");
      chars.forEach((char, charIndex) => {
        // Randomize timing slightly for electrical feel
        const baseDelay = lineIndex * 0.5 + charIndex * 0.06;
        const randomDelay = Math.random() * 0.1;
        const totalDelay = baseDelay + randomDelay;

        // Electrical flicker effect
        tl.to(
          char,
          {
            duration: 0.12,
            color: brightElectricColor,
            scale: 1.05,
            delay: totalDelay,
            ease: "power2.out",
          },
          0
        )
          .to(
            char,
            {
              duration: 0.18,
              color: electricColor,
              scale: 1.02,
              delay: totalDelay + 0.12,
              ease: "sine.inOut",
            },
            0
          )
          .to(
            char,
            {
              duration: 0.3,
              color: originalColor,
              scale: 1,
              delay: totalDelay + 0.3,
              ease: "power2.in",
            },
            0
          );
      });
    });
  }, [theme]);

  const startElectricalAnimation = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    // Trigger first animation
    setTimeout(() => {
      triggerElectricalAnimation();
    }, 800);

    // Repeat every 10 seconds
    animationIntervalRef.current = setInterval(() => {
      triggerElectricalAnimation();
    }, 10000);
  }, [triggerElectricalAnimation]);

  // Start animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        startElectricalAnimation();
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [startElectricalAnimation]);

  // Add CSS for electrical effects
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes subtle-glitch {
        0%, 100% { transform: translateX(0); }
        94% { transform: translateX(0); }
        95% { transform: translateX(1px); }
        96% { transform: translateX(-1px); }
        97% { transform: translateX(0); }
      }
      .char {
        transition: color 0.15s ease, transform 0.15s ease;
        will-change: color, transform;
        animation: subtle-glitch 10s infinite;
      }
      .char:nth-child(3n) { animation-delay: 0.5s; }
      .char:nth-child(3n+1) { animation-delay: 1s; }
      .char:nth-child(3n+2) { animation-delay: 1.5s; }
      .word { white-space: nowrap; display: inline-block; }
      
      /* Smooth background transitions */
      .bg-transition {
        transition: background-color 0.5s ease, border-color 0.5s ease;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // --- END ELECTRIC ANIMATION LOGIC ---

  const createTriangle = useCallback((x, y) => {
    const id = triangleIdRef.current++;
    const size = Math.random() * 12 + 20;
    const rotation = Math.random() * 360;
    const greenShades = ["#E8DCC8", "#8FB89A", "#8FB89A", "#8FB89A"];
    const color = greenShades[Math.floor(Math.random() * greenShades.length)];

    const newTriangle = {
      id,
      x,
      y,
      size,
      rotation,
      color,
    };

    setTriangles((prev) => [...prev, newTriangle]);

    setTimeout(() => {
      setTriangles((prev) => prev.filter((t) => t.id !== id));
    }, 1050);
  }, []);

  useEffect(() => {
    const section = containerRef.current?.closest("section");
    if (!section) return;

    let lastTime = 0;
    const throttleDelay = 100;

    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime < throttleDelay) return;
      lastTime = currentTime;

      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      createTriangle(x, y);
    };

    section.addEventListener("mousemove", handleMouseMove);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
    };
  }, [createTriangle]);

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

    const handleResize = () => {
      updateCardsPerView();
      // Reset position on resize
      const newTranslate = -(100 / cardsPerView) * currentIndex;
      dragState.current.currentTranslate = newTranslate;
      dragState.current.targetTranslate = newTranslate;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cardsPerView, currentIndex]);

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
          state.currentTranslate +=
            (state.targetTranslate - state.currentTranslate) * ease;

          // Apply transform
          slider.style.transition = "none";
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
      slider.style.transition = "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)";
      slider.style.transform = `translateX(${translateValue}%)`;
    }
  }, [currentIndex, cardsPerView]);

  // Drag handlers
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const state = dragState.current;
    const container = containerRef.current;

    const onMouseDown = (e) => {
      if (e.target.closest("a") || e.target.closest("button")) {
        return;
      }

      state.isDown = true;
      state.isButtonScrolling = false;
      state.useCSS = false;
      state.startX = e.pageX;
      state.lastX = e.pageX;
      state.lastTime = Date.now();
      state.velocity = 0;

      if (container) {
        container.style.cursor = "grabbing";
      }
      slider.style.willChange = "transform";
    };

    const onMouseMove = (e) => {
      if (!state.isDown) return;
      e.preventDefault();

      const currentTime = Date.now();
      const containerWidth = container
        ? container.getBoundingClientRect().width
        : window.innerWidth;
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

      if (container) {
        container.style.cursor = "grab";
      }
      slider.style.willChange = "auto";

      setTimeout(() => {
        const cardPercentage = 100 / cardsPerView;
        const currentOffset = Math.abs(state.currentTranslate);
        const nearestIndex = Math.round(currentOffset / cardPercentage);
        const clampedIndex = Math.max(0, Math.min(maxIndex, nearestIndex));

        if (clampedIndex !== currentIndex) {
          state.useCSS = true;
          setCurrentIndex(clampedIndex);
          slider.style.transition =
            "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)";

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
      if (e.target.closest("a") || e.target.closest("button")) {
        return;
      }

      state.isDown = true;
      state.isButtonScrolling = false;
      state.useCSS = false;
      state.startX = e.touches[0].pageX;
      state.lastX = e.touches[0].pageX;
      state.lastTime = Date.now();
      state.velocity = 0;

      slider.style.willChange = "transform";
    };

    const onTouchMove = (e) => {
      if (!state.isDown) return;

      const currentTime = Date.now();
      const containerWidth = container
        ? container.getBoundingClientRect().width
        : window.innerWidth;
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

      slider.style.willChange = "auto";

      setTimeout(() => {
        const cardPercentage = 100 / cardsPerView;
        const currentOffset = Math.abs(state.currentTranslate);
        const nearestIndex = Math.round(currentOffset / cardPercentage);
        const clampedIndex = Math.max(0, Math.min(maxIndex, nearestIndex));

        if (clampedIndex !== currentIndex) {
          state.useCSS = true;
          setCurrentIndex(clampedIndex);
          slider.style.transition =
            "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)";

          setTimeout(() => {
            state.useCSS = false;
          }, 400);
        }

        state.targetTranslate = -(100 / cardsPerView) * clampedIndex;
        state.currentTranslate = state.targetTranslate;
        state.velocity = 0;
      }, 100);
    };

    if (container) {
      container.addEventListener("mousedown", onMouseDown);
      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseup", onMouseUp);
      container.addEventListener("mouseleave", onMouseLeave);
      container.addEventListener("touchstart", onTouchStart, { passive: true });
      container.addEventListener("touchmove", onTouchMove, { passive: true });
      container.addEventListener("touchend", onTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousedown", onMouseDown);
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseup", onMouseUp);
        container.removeEventListener("mouseleave", onMouseLeave);
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        container.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, [cardsPerView, currentIndex, maxIndex]);

  return (
    <>
      <style jsx>{`
        @keyframes triangle-fade {
          0% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }

        .animate-triangle-fade {
          animation: triangle-fade 1.05s ease-out forwards;
        }
      `}</style>

      <section
        ref={containerRef}
        className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 bg-transition"
        style={bgStyle}
      >
        {/* Noise texture overlay */}
        {theme === "dark" && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={noiseOverlayStyle}
          />
        )}

        {/* CURSOR TRAIL TRIANGLES */}
        {triangles.map((triangle) => (
          <div
            key={triangle.id}
            className="pointer-events-none absolute z-[5] animate-triangle-fade"
            style={{
              left: `${triangle.x}px`,
              top: `${triangle.y}px`,
              width: "0",
              height: "0",
              borderLeft: `${triangle.size / 2}px solid transparent`,
              borderRight: `${triangle.size / 2}px solid transparent`,
              borderBottom: `${triangle.size}px solid ${triangle.color}`,
              transform: `translate(-50%, -50%) rotate(${triangle.rotation}deg)`,
              opacity: 0.7,
            }}
          />
        ))}

        <div className="relative z-10 mx-auto max-w-[1800px] px-4 sm:px-6 md:px-8">
          {/* Label above everything */}
          <div className="mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-sm bg-[#E8DCC8]" />
            <span
              className={`font-[Helvetica Now Text,Arial,sans-serif] text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-semibold tracking-[0.16em] uppercase ${
                theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
              }`}
            >
              Results
            </span>
          </div>

          {/* Heading left, copy/CTA right */}
          <div className="mb-8 sm:mb-10 grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2
                className={`font-fellix leading-[1.02] tracking-tight ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                }`}
              >
                {/* Note: electric-text-target class added for animation targeting */}
                <span className="hero-title-line block text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px] ">
                  Driven by a
                </span>
                <span className="block text-[24px] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[70px] 2xl:text-[82px] ">
                  {/* Note: hero-title-line added to individual words to preserve font styles */}
                  <span className="hero-title-line font-ivy-presto font-normal">
                    performance
                  </span>{" "}
                  <span className="hero-title-line">
                    mindset
                  </span>
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:max-w-[600px]">
              <p
                className={`font-[Helvetica Now Text,Arial,sans-serif] text-[13px] sm:text-[15px] md:text-[17px] lg:text-[19px] xl:text-[21px] font-semibold leading-relaxed ${
                  theme === "dark" ? "text-[#f3f3f3]" : "text-[#212121]"
                }`}
              >
                You don&apos;t just hire experts - you hire people with a drive
                to deliver results. The Dapper team thrives on impact. When you
                work with us, you&apos;ll work with a team as ambitious about
                growth as you are.
              </p>

              <Link
                href="/cases"
                className={`group inline-flex items-center gap-2 self-start rounded-[8px] sm:rounded-[10px] border ${
                  theme === "dark"
                    ? "border-white/10 bg-[#3a3a3a]"
                    : "border-black/10 bg-white"
                } px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.10] hover:-translate-y-[1px]`}
              >
                <span
                  className={`font-[Helvetica Now Text,Arial,sans-serif] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-semibold tracking-tight ${
                    theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                  }`}
                >
                  Explore our cases
                </span>

                <span
                  className={`relative inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center overflow-hidden rounded-[4px] ${
                    theme === "dark"
                      ? "bg-[#E8DCC8] group-hover:bg-white"
                      : "bg-[#E8DCC8] group-hover:bg-black"
                  } transition-colors duration-500`}
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:opacity-0">
                    <svg
                      width="10"
                      height="10"
                      className="sm:w-3 sm:h-3"
                      viewBox="0 0 14 14"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 13L13 1M13 1H5M13 1V9"
                        fill="none"
                        stroke={theme === "dark" ? "#111111" : "#212121"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span className="absolute inset-0 flex items-center justify-center translate-x-[-10px] translate-y-[10px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <svg
                      width="10"
                      height="10"
                      className="sm:w-3 sm:h-3"
                      viewBox="0 0 14 14"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 13L13 1M13 1H5M13 1V9"
                        fill="none"
                        stroke={theme === "dark" ? "#111111" : "#E8DCC8"}
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
            <div className="mb-4 sm:mb-6 flex justify-center gap-2 sm:justify-end">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                disabled={!canPrev}
                className={[
                  "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[6px] text-white transition z-10 relative",
                  canPrev
                    ? theme === "dark"
                      ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-pointer"
                      : "bg-[#111111] hover:bg-black cursor-pointer"
                    : theme === "dark"
                    ? "bg-[#3a3a3a]/50 cursor-not-allowed"
                    : "bg-[#D3D3D3] cursor-not-allowed",
                ].join(" ")}
              >
                <svg
                  width="12"
                  height="12"
                  className="sm:w-[14px] sm:h-[14px]"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
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
                  "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[6px] text-white transition z-10 relative",
                  canNext
                    ? theme === "dark"
                      ? "bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-pointer"
                      : "bg-[#111111] hover:bg-black cursor-pointer"
                    : theme === "dark"
                    ? "bg-[#3a3a3a]/50 cursor-not-allowed"
                    : "bg-[#D3D3D3] cursor-not-allowed",
                ].join(" ")}
              >
                <svg
                  width="12"
                  height="12"
                  className="sm:w-[14px] sm:h-[14px]"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
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

            <div
              ref={containerRef}
              className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
            >
              <div ref={sliderRef} className="flex -mx-2 sm:-mx-3">
                {TESTIMONIALS.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="basis-full px-2 flex-shrink-0 sm:px-3 lg:basis-1/2"
                  >
                    <article
                      className={`relative flex h-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px] flex-col justify-between rounded-xl sm:rounded-2xl border ${
                        theme === "dark"
                          ? "border-white/[0.06] bg-[#2a2a2a]"
                          : "border-black/[0.06] bg-white"
                      } px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8 lg:py-9 xl:px-10 xl:py-14 shadow-[0_10px_30px_rgba(0,0,0,0.10)] pointer-events-none`}
                    >
                      <blockquote
                        className={`border-l-3 sm:border-l-4 ${
                          theme === "dark"
                            ? "border-[#f3f3f3]"
                            : "border-[#111111]"
                        } pl-3 sm:pl-4 md:pl-6 font-merriweather text-[14px] sm:text-[17px] md:text-[20px] lg:text-[24px] xl:text-[30px] leading-snug ${
                          theme === "dark" ? "text-[#f3f3f3]" : "text-[#111111]"
                        }`}
                      >
                        "{testimonial.quote}"
                      </blockquote>

                      <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-9 flex items-center justify-between gap-3 sm:gap-4">
                        <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
                          <div className="relative h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.author}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`font-merriweather text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-semibold truncate ${
                                theme === "dark"
                                  ? "text-[#f3f3f3]"
                                  : "text-[#111111]"
                              }`}
                            >
                              {testimonial.author}
                            </p>
                            <p
                              className={`font-merriweather text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] font-medium truncate ${
                                theme === "dark"
                                  ? "text-[#a0a0a0]"
                                  : "text-[#444444]"
                              }`}
                            >
                              {testimonial.role} – {testimonial.company}
                            </p>
                          </div>
                        </div>

                        <div className="relative h-6 w-16 sm:h-7 sm:w-20 md:h-8 md:w-24 flex-shrink-0">
                          <Image
                            src={testimonial.logo}
                            alt={`${testimonial.company} logo`}
                            fill
                            className="object-contain object-right"
                            sizes="96px"
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
    </>
  );
}