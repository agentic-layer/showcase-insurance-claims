
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClaimsProvider } from '@/components/ClaimsProvider';
import HeroSection from '@/components/HeroSection';
import ChatInterface from '@/components/ChatInterface';

import CustomerDataTable from '@/components/CustomerDataTable';
import Footer from '@/components/Footer';

const DashboardPage = () => {
  const [showCustomerData, setShowCustomerData] = useState(false);

  return (
    <ClaimsProvider>
      <div className="min-h-screen bg-background">
        {/* Add logout button to header */}
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/lovable-uploads/0255c12a-3d19-4910-9df5-d730b57d704f.png"
                alt="QAware Logo"
                className="h-8 w-8"
              />
              <span className="ml-2 font-semibold text-lg">Claims Agent</span>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <a href="#showcase" className="text-foreground hover:text-accent transition-colors">
                  Showcase
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main>
          <HeroSection />
          
          {/* Chat Interface */}
          <section id="showcase" className="py-8 px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-foreground">
                  Claims Agent Showcase
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                  Sprechen Sie direkt mit unserem KI-gestützten Voice Agent zur Datenerfassung.
                </p>
              </div>
              
              <ChatInterface />
            </div>
          </section>
          
          {/* Toggle Button for Customer Data */}
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowCustomerData(!showCustomerData)}
                className="px-6 py-2"
              >
                {showCustomerData ? 'Kundendaten ausblenden' : 'Kundendaten anzeigen'}
              </Button>
            </div>
          </div>

          {/* Customer Data Table */}
          {showCustomerData && (
            <div className="container mx-auto px-6 pb-12">
              <CustomerDataTable />
            </div>
          )}
          
        </main>
        <Footer />
      </div>
    </ClaimsProvider>
  );
};

export default DashboardPage;
