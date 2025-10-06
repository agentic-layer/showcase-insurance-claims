
import React from 'react';

const HeroSection = () => {
  return (
    <section className="py-12 px-6">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
          Claims Agent
        </h1>

        <h2 className="text-2xl md:text-3xl font-medium mb-8 text-accent">
          KI‑gestützter Voice Agent zur Datenerfassung
        </h2>

        <div className="max-w-3xl mx-auto text-lg leading-relaxed text-muted-foreground space-y-6">
          <p>
            Unser Voice Agent erfasst alle relevanten Schadendaten im Gespräch mit dem Kunden – vollautomatisch, zuverlässig und jederzeit erreichbar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
