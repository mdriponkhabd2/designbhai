
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export default function PortfolioPage() {
  const { data, isLoaded } = useAdminData();
  const [activeCategory, setActiveCategory] = useState("All");

  if (!isLoaded) return null;

  const categories = ["All", "Logo Design", "Social Media", "Branding", "UI/UX"];
  
  const filteredPortfolio = activeCategory === "All" 
    ? data.portfolio 
    : data.portfolio.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-1 text-primary">Showcase</Badge>
            <h1 className="text-5xl font-headline font-bold">Our Portfolio</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Explore our latest creative projects and design work.</p>
            
            <div className="flex flex-wrap justify-center gap-2 pt-6">
              {categories.map((cat) => (
                <Button 
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-full px-6"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.map((item, idx) => (
              <Card key={item.id} className="group border-none overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized={item.imageUrl.startsWith('https://scontent')}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">{item.category}</span>
                    <h3 className="text-white text-xl font-bold">{item.title}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />

      <Link 
        href={`https://wa.me/${data.contact.phones[0]?.replace(/\D/g, '')}`}
        target="_blank"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  );
}
