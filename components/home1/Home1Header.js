"use client";

export default function Home1Header() {
  return (
    <header className="flex items-center justify-between pt-4 sm:pt-5 font-merriweather">
      <div className="inline-flex items-center rounded-full p-[2px]">
        <span className="rounded-full border-2 border-[#74F5A1]/50 px-3 py-1 text-[23px] leading-none tracking-tight text-[#f3f3f3]">
          YKWMI
        </span>
        <span className="rounded-full border-2 border-[#74F5A1]/50 px-3 py-1 text-[23px] leading-none tracking-tight text-[#f3f3f3]">
          STUDIO
        </span>
      </div>

      <button
        type="button"
        className="rounded-full border-2 border-[#74F5A1]/50 px-4 py-1 text-[23px] leading-none tracking-tight text-[#f3f3f3]"
      >
        MENU
      </button>
    </header>
  );
}

