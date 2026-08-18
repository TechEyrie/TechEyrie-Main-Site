"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  COUNTRY_DIAL_CODES,
  DEFAULT_COUNTRY,
  composePhone,
} from "./countryDialCodes";
import "./PhoneCountryField.css";

const POPULAR_ISOS = ["QA", "AE", "SA", "GB", "US", "IN", "PK", "EG", "DE", "FR"];

function CountryFlag({ iso, eager = false }) {
  const [failed, setFailed] = useState(false);
  const code = String(iso || "").toLowerCase();

  if (!code || failed) {
    return <span className="quote-phone-flag-fallback">{iso}</span>;
  }

  return (
    <img
      className="quote-phone-flag-img"
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={20}
      height={15}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function CountryOption({ country, selected, onSelect }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={`quote-phone-option${selected ? " is-selected" : ""}`}
      onClick={() => onSelect(country)}
    >
      <span className="quote-phone-flag" aria-hidden>
        <CountryFlag iso={country.iso} />
      </span>
      <span className="quote-phone-option-name">{country.name}</span>
      <span className="quote-phone-option-dial">{country.dial}</span>
    </button>
  );
}

export default function PhoneCountryField({
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  error,
  name = "phone",
}) {
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0, maxHeight: 280 });
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [national, setNational] = useState("");

  useEffect(() => {
    if (!value) setNational("");
  }, [value]);

  const emit = (nextCountry, nextNational) => {
    onChange?.(composePhone(nextCountry.dial, nextNational));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_DIAL_CODES;
    const digits = q.replace("+", "");
    return COUNTRY_DIAL_CODES.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.iso.toLowerCase().includes(q) ||
        c.dial.replace("+", "").includes(digits)
      );
    });
  }, [query]);

  const popular = useMemo(
    () =>
      POPULAR_ISOS.map((iso) => COUNTRY_DIAL_CODES.find((c) => c.iso === iso)).filter(
        Boolean,
      ),
    [],
  );

  const placeMenu = () => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
    const maxHeight = Math.min(320, Math.max(160, openUp ? spaceAbove : spaceBelow));
    const width = Math.min(Math.max(rect.width, 280), window.innerWidth - 16);
    const left = Math.min(rect.left, window.innerWidth - width - 8);
    setMenuPos({
      top: openUp ? rect.top - maxHeight - 6 : rect.bottom + 6,
      left: Math.max(8, left),
      width,
      maxHeight,
    });
  };

  useEffect(() => {
    if (!open) return undefined;
    placeMenu();
    const onReposition = (event) => {
      if (event?.target?.closest?.(".quote-phone-menu")) return;
      placeMenu();
    };
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    const id = requestAnimationFrame(() => searchRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const menu = menuRef.current;
    const list = listRef.current;
    if (!menu || !list) return undefined;

    const onWheel = (event) => {
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      list.scrollTop += delta;
      event.preventDefault();
      event.stopPropagation();
    };

    const onTouchMove = (event) => {
      event.stopPropagation();
    };

    menu.addEventListener("wheel", onWheel, { passive: false });
    menu.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      menu.removeEventListener("wheel", onWheel);
      menu.removeEventListener("touchmove", onTouchMove);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (event) => {
      if (wrapRef.current?.contains(event.target)) return;
      if (event.target?.closest?.(".quote-phone-menu")) return;
      setOpen(false);
      setQuery("");
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        setQuery("");
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const selectCountry = (next) => {
    setCountry(next);
    emit(next, national);
    setOpen(false);
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const active = focused || open;

  return (
    <div
      ref={wrapRef}
      className={`quote-phone-field${active ? " is-focused" : ""}${error ? " is-error" : ""}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className="quote-phone-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code ${country.name} ${country.dial}`}
        onClick={() => setOpen((v) => !v)}
        onFocus={onFocus}
      >
        <span className="quote-phone-flag" aria-hidden>
          <CountryFlag iso={country.iso} eager />
        </span>
        <span className="quote-phone-dial">{country.dial}</span>
        <svg className={`quote-phone-chevron${open ? " is-open" : ""}`} width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <input type="hidden" name={name} value={composePhone(country.dial, national)} />
      <input
        ref={inputRef}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="3312 3456"
        value={national}
        onChange={(event) => {
          const next = event.target.value.replace(/[^\d\s()-]/g, "");
          setNational(next);
          emit(country, next);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        className="quote-phone-input"
      />

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="quote-phone-menu"
            data-lenis-prevent
            data-lenis-prevent-touch
            data-lenis-prevent-wheel
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              height: menuPos.maxHeight,
              maxHeight: menuPos.maxHeight,
            }}
            role="listbox"
            aria-label="Select country code"
          >
            <div className="quote-phone-search-wrap">
              <input
                ref={searchRef}
                type="text"
                className="quote-phone-search"
                placeholder="Search country or code"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div ref={listRef} className="quote-phone-list">
              {filtered.length === 0 ? (
                <div className="quote-phone-empty">No countries found</div>
              ) : (
                <>
                  {!query.trim() && (
                    <>
                      <div className="quote-phone-group-label">Popular</div>
                      {popular.map((c) => (
                        <CountryOption
                          key={`popular-${c.iso}`}
                          country={c}
                          selected={c.iso === country.iso}
                          onSelect={selectCountry}
                        />
                      ))}
                      <div className="quote-phone-group-label">All countries</div>
                    </>
                  )}
                  {filtered.map((c) => (
                    <CountryOption
                      key={`${c.iso}-${c.dial}-${c.name}`}
                      country={c}
                      selected={c.iso === country.iso}
                      onSelect={selectCountry}
                    />
                  ))}
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
