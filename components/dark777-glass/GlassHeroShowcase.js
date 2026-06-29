"use client";

import React from "react";
import HeroSectionMediaSlot from "./HeroSectionMediaSlot";
import LuxuryGlassPrisms from "./LuxuryGlassPrisms";
import LuxuryGlassSplinters from "./LuxuryGlassSplinters";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='620' height='620'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='620' height='620' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`;

function VariantLabel({ title, subtitle }) {
  return (
    <div className="glass-hero-variant-label">
      <h2>{title}</h2>
      <span>{subtitle}</span>
    </div>
  );
}

function GlassHeroDirectionA({ theme = "dark" }) {
  return (
    <section className="glass-hero-block glass-hero-a" data-glass-variant="A">
      <VariantLabel
        title="Direction A — Champagne Crystal"
        subtitle="Frosted panel · glass prisms · dual-tone orbs"
      />
      <div className="relative min-h-[92vh] sm:min-h-[94vh] lg:min-h-[100vh]">
        <div className="glass-hero-a-orb-warm" aria-hidden />
        <div className="glass-hero-a-orb-cool" aria-hidden />
        <div
          className="glass-hero-noise"
          style={{ backgroundImage: NOISE_SVG }}
          aria-hidden
        />
        <LuxuryGlassPrisms />
        <div className="glass-hero-vignette" aria-hidden />
        <div className="relative z-10">
          <HeroSectionMediaSlot
            theme={theme}
            sharedBackground
            heroOnly
            glassVariant="A"
          />
        </div>
      </div>
    </section>
  );
}

function GlassHeroDirectionC({ theme = "dark" }) {
  return (
    <section className="glass-hero-block glass-hero-c" data-glass-variant="C">
      <VariantLabel
        title="Direction C — Liquid Light"
        subtitle="Gradient mesh · crystal splinters · specular sweep"
      />
      <div className="relative min-h-[92vh] sm:min-h-[94vh] lg:min-h-[100vh]">
        <div className="glass-hero-c-mesh" aria-hidden />
        <div className="glass-hero-c-orb" aria-hidden />
        <div
          className="glass-hero-noise"
          style={{ backgroundImage: NOISE_SVG }}
          aria-hidden
        />
        <LuxuryGlassSplinters />
        <div className="glass-hero-c-specular" aria-hidden />
        <div className="glass-hero-vignette" aria-hidden />
        <div className="relative z-10">
          <HeroSectionMediaSlot
            theme={theme}
            sharedBackground
            heroOnly
            glassVariant="C"
          />
        </div>
      </div>
    </section>
  );
}

export default function GlassHeroShowcase({ theme = "dark" }) {
  return (
    <div className="dark777-glass-showcase">
      <GlassHeroDirectionC theme={theme} />
      <GlassHeroDirectionA theme={theme} />
    </div>
  );
}
