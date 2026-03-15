
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  MessageCircle, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Palette,
  Layout,
  Layers,
  Monitor,
  ImageIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export default function LandingPage() {
  const { data, isLoaded } = useAdminData();
  const [activeCategory, setActiveCategory] = useState("All");

  if (!isLoaded) return null;

  const categories = ["All", "Logo Design", "Social Media", "Branding", "UI/UX"];
  
  const filteredPortfolio = activeCategory === "All" 
    ? data.portfolio 
    : data.portfolio.filter(item => item.category === activeCategory);

  const serviceIcons = [Palette, Layout, Layers, Monitor];

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 green-gradient opacity-10 -z-10" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px]">
              Graphics Design Agency
            </Badge>
            <h1 className="text-6xl md:text-7xl font-headline font-bold leading-[1.1] tracking-tight">
              Design<span className="text-primary">Bhai</span> <br />
              <span className="text-muted-foreground">Creative Solutions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              We transform your ideas into stunning visual realities. From logos to complete branding, we build identities that resonate.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="px-8 gap-2 rounded-full shadow-lg shadow-primary/20" asChild>
                <Link href="/portfolio">
                  View Portfolio <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 rounded-full border-primary/20 hover:bg-primary/5" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] animate-in fade-in zoom-in-95 duration-1000">
            <div className="absolute inset-0 green-gradient rounded-[2rem] rotate-3 opacity-20 blur-2xl" />
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
              {data.settings.heroImageUrl ? (
                <Image 
                  src={data.settings.heroImageUrl} 
                  alt="Creative Design" 
                  fill 
                  className="object-cover"
                  priority
                  unoptimized={data.settings.heroImageUrl.startsWith('https://scontent')}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-headline font-bold">Our Showcase</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Explore our latest creative endeavors and design projects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.portfolio.slice(0, 6).map((item, idx) => (
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

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="rounded-full px-12" asChild>
              <Link href="/portfolio">View All Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline font-bold">Expert Services</h2>
            <p className="text-muted-foreground">Comprehensive design solutions tailored to your business needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.services.map((service, idx) => {
              const Icon = serviceIcons[idx % serviceIcons.length];
              return (
                <Card key={service.id} className="p-8 rounded-3xl border-border/50 hover:border-primary/30 transition-colors shadow-sm text-center space-y-6">
                  <div className="w-16 h-16 green-gradient rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-primary/20">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />

      <Link 
        href={`https://wa.me/${data.contact.phones[0]?.replace(/\D/g, '')}`}
        target="_blank"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-bounce hover:animate-none"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  );
}
