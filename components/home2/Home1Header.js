"use client";

export default function Home1Header() {
  return (
    <header className="flex items-center justify-between pt-4 sm:pt-5">
      <div className="inline-flex items-center rounded-full p-[2px]">
        <span className="rounded-full border-2 border-white/100 px-3 py-1 text-[23px] leading-none tracking-tight">
          YKWMI
        </span>
        <span className="rounded-full border-2 border-white/100 px-3 py-1 text-[23px] leading-none tracking-tight">
          STUDIO
        </span>
      </div>

      <button
        type="button"
        className="rounded-full border-2 border-white/100 px-4 py-1 text-[23px] leading-none tracking-tight"
      >
        MENU
      </button>
    </header>
  );
}
