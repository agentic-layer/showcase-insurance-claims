
import React from 'react';

const Footer = () => {
  return (
    <footer id="kontakt" className="py-12 px-6 bg-background border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/0255c12a-3d19-4910-9df5-d730b57d704f.png" 
              alt="QAware Logo" 
              className="h-8 w-8"
            />

            <span className="ml-2 font-semibold text-lg">Claims Agent</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 Claims Agent. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
