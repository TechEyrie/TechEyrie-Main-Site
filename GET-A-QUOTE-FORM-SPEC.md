# Get a Quote Form — Portable Build Spec

Use this file in another Cursor project to recreate the **same quote drawer**: design, layout, open/close animation, validation, and trigger behavior.

**Source reference (this repo):**
- Form + drawer: `components/icomat1/Header.jsx` → `QuoteDrawer` (lines ~205–605)
- Layout CSS: `src/app/globals.css` (`.quote-drawer-*` classes)
- Hero trigger button animation: `components/icomat1/HeroSection.js` → `HeroQuoteButton`
- Header CTA trigger: `components/icomat1/Header.jsx` → `AnimatedCTAButton`

---

## 1. What to build

A **slide-in quote drawer** (not a centered modal):

| Viewport | Behavior |
|----------|----------|
| **Desktop (>768px)** | Panel slides in from the **right** (`x: 110% → 0%`). Fixed with 20px inset on top/right/bottom. Width `min(540px, calc(100% - 40px))`. Rounded corners `12px`. |
| **Mobile (≤768px)** | Full-screen sheet slides up from the **bottom** (`y: 100% → 0%`). No border radius. |

Behind the panel: **dark blurred overlay** (`rgba(0,0,0,0.6)` + `backdrop-filter: blur(8px)`).

Portal the drawer to `document.body` so it sits above everything (`z-index` 10050 overlay / 10051 panel).

---

## 2. Dependencies

```json
{
  "gsap": "^3.14.x",
  "react": "^19.x",
  "react-dom": "^19.x"
}
```

Optional but used in source:
- `next/link` for privacy policy link (swap for `<a>` in non-Next projects)
- `createPortal` from `react-dom`

No form library — plain React state.

---

## 3. Design tokens (match exactly)

```js
const QUOTE_THEME = {
  // Panel
  panelBg: "linear-gradient(160deg, #162D24 0%, #162D24 50%, #1B4732 100%)",
  panelBorder: "rgba(200,240,74,0.12)",
  panelShadow: `
    0 32px 80px rgba(0,0,0,0.55),
    0 0 0 1px rgba(255,255,255,0.04),
    inset 0 1px 0 rgba(255,255,255,0.06)
  `,

  // Brand accent (lime)
  accent: "#c8f04a",
  accentHover: "#d8ff5a",
  accentSoft: "rgba(200,240,74,0.12)",
  accentBorder: "rgba(200,240,74,0.3)",
  accentGlow: "rgba(200,240,74,0.09)",

  // Text
  title: "#f8f8f4",
  bodyMuted: "rgba(255,255,255,0.38)",
  label: "rgba(255,255,255,0.4)",
  footer: "rgba(255,255,255,0.2)",
  submitText: "#0a2a12",
  closeHoverText: "#c8f04a",

  // Fields
  fieldBg: "rgba(255,255,255,0.04)",
  fieldBgFocus: "rgba(200,240,74,0.05)",
  fieldBorder: "rgba(255,255,255,0.1)",
  fieldBorderFocus: "rgba(200,240,74,0.35)",
  fieldText: "#f8f8f4",
  placeholder: "rgba(255,255,255,0.2)",
  caret: "#c8f04a",
  error: "rgba(255,100,80,0.9)",
  errorBorder: "rgba(255,90,70,0.55)",

  // Overlay
  overlay: "rgba(0,0,0,0.6)",
};
```

### Typography
- **Title:** `'Yantramanav', Inter, Arial, sans-serif` — weight 300, `clamp(1.9rem, 3vw, 2.6rem)`, letter-spacing `-0.03em`
- **Labels:** Inter, `0.62rem`, weight 500, `letter-spacing: 0.12em`, uppercase
- **Inputs:** Inter, `0.875rem`, weight 300
- **Submit button:** Inter, `0.7rem`, weight 700, uppercase, `letter-spacing: 0.14em`
- **Footer legal:** Inter, `0.57rem`, uppercase, `letter-spacing: 0.06em`

Load **Inter** (Google Fonts) and optionally **Yantramanav** for the title.

---

## 4. Form fields

| Field | Name | Required | Type | Placeholder |
|-------|------|----------|------|-------------|
| Full name | `fullName` | Yes | text | `Jane Smith` |
| Email | `email` | Yes | email | `jane@company.com` |
| Phone | `phone` | No | tel | `+44 7700 900000` |
| Company | `company` | Yes | text | `Acme Ltd.` |
| Project details | `project` | Yes | textarea | `Describe your goals, timeline, budget...` |

### Validation rules
```js
function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Required";
  if (!form.email.trim()) errors.email = "Required";
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email address";
  if (!form.company.trim()) errors.company = "Required";
  if (!form.project.trim()) errors.project = "Required";
  return errors;
}
```

On submit success → show success screen (checkmark in lime circle + “Message sent!” + Close button).  
On drawer close → after **500ms** reset form, errors, and `submitted` state.

---

## 5. Open / close animation (GSAP — critical)

Use a `useEffect` on `open` prop. Kill previous timeline on each run.

### Open (desktop)
```js
gsap.set(overlay, { display: "block" });
gsap.set(drawer, { display: "flex", clearProps: "transform" });
gsap.set(drawer, { x: "110%", y: 0 });

timeline
  .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
  .fromTo(drawer, { x: "110%" }, { x: "0%", duration: 0.58, ease: "power4.out" }, 0);
```

### Close (desktop)
```js
timeline
  .to(drawer, { x: "110%", duration: 0.45, ease: "power4.inOut" }, 0)
  .to(overlay, { opacity: 0, duration: 0.38, ease: "power2.in" }, 0.05)
  .set([overlay, drawer], { display: "none", clearProps: "transform" });
```

### Open (mobile ≤768px)
```js
gsap.set(drawer, { x: 0, y: "100%" });
timeline
  .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
  .fromTo(drawer, { y: "100%" }, { y: "0%", duration: 0.5, ease: "power4.out" }, 0);
```

### Close (mobile)
```js
timeline
  .to(drawer, { y: "100%", duration: 0.42, ease: "power4.inOut" }, 0)
  .to(overlay, { opacity: 0, duration: 0.38, ease: "power2.in" }, 0.05)
  .set([overlay, drawer], { display: "none", clearProps: "transform" });
```

### UX while open
- `Escape` key closes drawer
- Click overlay closes drawer
- `document.body.style.overflow = "hidden"` while open
- Close button (✕) top-right: 32×32px, border `rgba(255,255,255,0.12)`, hover → lime tint

---

## 6. Required CSS (copy into global stylesheet)

```css
/* Get a quote drawer (portaled to body) */
.quote-drawer-overlay {
  z-index: 10050;
}

.quote-drawer-panel {
  z-index: 10051;
  box-sizing: border-box;
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: auto;
  width: min(540px, calc(100% - 40px));
  max-width: calc(100% - 40px);
  height: auto;
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px);
  border-radius: 12px;
}

.quote-drawer-header { padding: 28px 32px 0; }
.quote-drawer-intro  { padding: 22px 32px 0; }
.quote-drawer-body   { padding: 22px 32px 28px; }
.quote-drawer-footer { padding: 16px 32px; }

.quote-form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quote-scroll-inner { scrollbar-width: none; }
.quote-scroll-inner::-webkit-scrollbar { display: none; }

input::placeholder,
textarea::placeholder { color: rgba(255,255,255,0.2); }

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #162D24 inset !important;
  -webkit-text-fill-color: #f8f8f4 !important;
  caret-color: #c8f04a;
}

@media (max-width: 768px) {
  .quote-drawer-panel {
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    max-height: 100vh !important;
    max-height: 100dvh !important;
    border-radius: 0 !important;
    border-left: none !important;
    border-right: none !important;
  }

  .quote-drawer-header { padding: 20px 20px 0; }
  .quote-drawer-intro  { padding: 16px 20px 0; }
  .quote-drawer-body   { padding: 16px 20px 24px; }

  .quote-drawer-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 14px 20px;
  }

  .quote-drawer-title {
    font-size: clamp(1.5rem, 6vw, 1.9rem) !important;
  }

  .quote-form-row-2 {
    grid-template-columns: 1fr !important;
  }

  .quote-drawer-panel .quote-scroll-inner {
    -webkit-overflow-scrolling: touch;
  }

  .quote-drawer-panel input,
  .quote-drawer-panel textarea {
    font-size: 16px; /* prevents iOS zoom on focus */
  }
}
```

---

## 7. Panel structure (DOM)

```
Portal → document.body
├── .quote-drawer-overlay (fixed inset-0, click to close)
└── .quote-drawer-panel (fixed, flex column, gradient bg)
    └── .quote-scroll-inner (flex column, overflow-y scroll)
        ├── .quote-drawer-header
        │   ├── Logo (left)
        │   └── Close button ✕ (right)
        ├── .quote-drawer-intro
        │   ├── h2 "Get a quote"
        │   ├── Subtitle paragraph
        │   └── Lime gradient divider line
        ├── .quote-drawer-body
        │   ├── [Form] OR [Success state]
        └── .quote-drawer-footer
            ├── COMPANY REG NO. 11771620
            └── VAT REG. NO. 326574685
```

**Decorative glow:** absolute circle bottom-right, `320×320px`, `radial-gradient(circle, rgba(200,240,74,0.09) 0%, transparent 70%)`, `pointer-events: none`.

**Intro divider:**
```css
height: 1px;
background: linear-gradient(to right, rgba(200,240,74,0.2), rgba(200,240,74,0.04) 60%, transparent);
```

---

## 8. Field styles (inline or CSS-in-JS)

```js
function fieldStyle(name, focused, errors, isTextarea = false) {
  return {
    width: "100%",
    background: focused === name ? "rgba(200,240,74,0.05)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${
      errors[name]     ? "rgba(255,90,70,0.55)" :
      focused === name ? "rgba(200,240,74,0.35)" :
                         "rgba(255,255,255,0.1)"
    }`,
    borderRadius: "10px",
    padding: isTextarea ? "15px 17px" : "13px 17px",
    color: "#f8f8f4",
    fontSize: "0.875rem",
    fontFamily: "Inter, Arial, sans-serif",
    fontWeight: 300,
    outline: "none",
    resize: isTextarea ? "none" : undefined,
    minHeight: isTextarea ? "120px" : undefined,
    transition: "border-color 0.25s, background 0.25s",
    caretColor: "#c8f04a",
    boxSizing: "border-box",
  };
}
```

Required asterisk color: `#c8f04a`.

---

## 9. Submit button

- Full width, padding `16px 24px`, bg `#c8f04a`, radius `10px`
- Text: **SEND MESSAGE** + right arrow SVG
- Shadow: `0 4px 20px rgba(200,240,74,0.2)`
- Hover: bg `#d8ff5a`, `translateY(-2px)`, stronger shadow
- Active: `translateY(1px)`

Below button — privacy note:
> By submitting you agree to our [Privacy Policy]. We'll never share your data.  
Link color: `rgba(200,240,74,0.45)`

---

## 10. Success state

Centered column with:
1. **72×72** circle, lime border/background glow
2. Checkmark SVG stroke `#c8f04a`
3. **"Message sent!"** — `#f8f8f4`, `1.1rem`
4. **"We'll be in touch within 24 hours."** — muted
5. **Close** pill button — lime bg, uppercase, hover lift

---

## 11. How to open the drawer (integration)

### Pattern A — controlled state on page (recommended)
```jsx
// In page component
const [quoteOpen, setQuoteOpen] = useState(false);

<Header quoteOpen={quoteOpen} setQuoteOpen={setQuoteOpen} />
<HeroSection onQuoteClick={() => setQuoteOpen(true)} />
```

Header accepts optional controlled props:
```js
const isControlled = typeof quoteOpen === "boolean" && typeof setQuoteOpen === "function";
// If not controlled, Header manages internal state itself
```

### Pattern B — global custom event (for sections far from Header)
```js
window.dispatchEvent(new Event("open-quote-drawer"));
```

Header listens:
```js
useEffect(() => {
  const open = () => setQuoteOpen(true);
  window.addEventListener("open-quote-drawer", open);
  return () => window.removeEventListener("open-quote-drawer", open);
}, []);
```

### Trigger locations in source site
1. **Header** — `GET A QUOTE` CTA button (animated text swap on hover)
2. **Mobile menu** — `GET A QUOTE` button (closes menu, opens drawer)
3. **Mega menu** — circular dark button with arrow
4. **Hero** — `HeroQuoteButton` glass pill
5. **CTA sections** — dispatch event or `onQuoteOpen` callback

---

## 12. Hero “Get a Quote” button animation (optional but part of the feel)

Glass pill button with **GSAP vertical text roll** on hover:

```jsx
// Default styles
padding: "15px 60px"
borderRadius: "12px"
background: "rgba(255,255,255,0.12)"
border: "1px solid rgba(255,255,255,0.34)"
backdropFilter: "blur(10px)"
```

On hover:
- Background → `rgba(255,255,255,0.96)`, border solid white
- Two stacked text spans: top slides up (`y: -H`), clone slides in from below (`y: 0`)
- Timeline: `duration: 0.52`, `ease: "power3.inOut"`
- Clone text color: `#101010` (dark on white hover)

---

## 13. Header CTA “GET A QUOTE” animation

White pill in nav bar. On hover:
- Background inverts (`#ffffff` → `#0a0a09`)
- Same vertical text roll animation as hero button
- Clone text becomes white on dark hover bg

---

## 14. Suggested file split for new project

```
components/
  quote/
    QuoteDrawer.jsx       ← form + GSAP open/close + portal
    HeroQuoteButton.jsx   ← optional hero trigger
    quoteDrawer.css       ← or paste into globals.css
  Header.jsx              ← mounts <QuoteDrawer open={...} onClose={...} />
```

**Minimum viable:** one `QuoteDrawer.jsx` + CSS + wire `open`/`onClose` from your header.

---

## 15. Cursor prompt (paste into other site)

```
Recreate the Saqrih "Get a Quote" drawer exactly from GET-A-QUOTE-FORM-SPEC.md.

Requirements:
- React client component with GSAP slide animation (right on desktop, bottom sheet on mobile)
- Portal to document.body, z-index 10050+
- Dark green gradient panel (#162D24 → #1B4732), lime accent #c8f04a
- Form fields: fullName, email, phone, company, project (with validation)
- Success state after submit
- Escape + overlay click to close
- Body scroll lock while open
- Copy all CSS from section 6 of the spec
- Match typography, spacing, field focus states, and submit button hover
- Support opening via: (1) header state quoteOpen/setQuoteOpen, (2) window event "open-quote-drawer"
- Do NOT use a generic modal — must be the right-side / bottom-sheet drawer with the exact GSAP easings and durations from the spec
```

---

## 16. Backend note

Current source only sets `submitted = true` on the client — **no API call**.  
Wire `handleSubmit` to your endpoint (Formspree, Resend, custom API, etc.) before showing success.

Example hook point:
```js
const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validate(form);
  if (Object.keys(errs).length) { setErrors(errs); return; }
  // await fetch("/api/quote", { method: "POST", body: JSON.stringify(form) });
  setSubmitted(true);
};
```

---

## 17. Checklist before shipping

- [ ] Desktop: slides from right, 20px inset, rounded panel
- [ ] Mobile: full-screen bottom sheet
- [ ] Overlay blur + fade
- [ ] Lime focus rings on inputs
- [ ] Email + required field validation
- [ ] Success screen + form reset on close
- [ ] Escape closes
- [ ] Body scroll locked when open
- [ ] iOS inputs at 16px on mobile
- [ ] Privacy policy link in footer of form
- [ ] Logo + legal footer text in drawer
