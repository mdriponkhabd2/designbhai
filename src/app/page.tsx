
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { data, isLoaded } = useAdminData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isLoaded) return null;

  const categories = ["All", "Logo Design", "Social Media", "Branding", "UI/UX"];
  
  const filteredPortfolio = activeCategory === "All" 
    ? data.portfolio 
    : data.portfolio.filter(item => item.category === activeCategory);

  const serviceIcons = [Palette, Layout, Layers, Monitor];

  return (
    <div className="min-h-screen bg-background">
      {/* WhatsApp Button */}
      <Link 
        href={`https://wa.me/${data.contact.phones[0]?.replace(/\D/g, '')}`}
        target="_blank"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-bounce hover:animate-none"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>

      {/* Sticky Navbar */}
      <nav className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold font-headline tracking-tighter">
            Design<span className="text-primary">Bhai</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#home" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link href="#portfolio" className="text-sm font-medium hover:text-primary transition-colors">Portfolio</Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
            <Button size="sm" asChild>
              <Link href="#contact">Hire Us</Link>
            </Button>
          </div>
        </div>
      </nav>

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
                <Link href="#portfolio">
                  View Portfolio <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 rounded-full border-primary/20 hover:bg-primary/5" asChild>
                <Link href="#contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] animate-in fade-in zoom-in-95 duration-1000">
            <div className="absolute inset-0 green-gradient rounded-[2rem] rotate-3 opacity-20 blur-2xl" />
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
              <Image 
                src="https://picsum.photos/seed/design-hero/800/1000" 
                alt="Creative Design" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-headline font-bold">Our Showcase</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Explore our latest creative endeavors and design projects.</p>
            
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
              <Card key={item.id} className="group border-none overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
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
      </section>

      {/* Services Section */}
      <section id="services" className="py-24">
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

      {/* About Section */}
      <section id="about" className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square lg:aspect-auto lg:h-[500px]">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
              {data.about.imageUrl ? (
                <Image 
                  src={data.about.imageUrl} 
                  alt="About DesignBhai" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <Badge variant="secondary" className="px-4 py-1 text-primary">Our Story</Badge>
            <h2 className="text-4xl font-headline font-bold leading-tight">Bringing Creativity to Life with Passion</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {data.about.text}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <h4 className="text-3xl font-bold text-primary">500+</h4>
                <p className="text-sm text-muted-foreground font-medium">Projects Completed</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-bold text-primary">200+</h4>
                <p className="text-sm text-muted-foreground font-medium">Happy Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-headline font-bold">Get In Touch</h2>
                <p className="text-muted-foreground">Ready to start your next project? Let's talk about how we can help.</p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Our Location</h4>
                    <p className="text-sm text-muted-foreground">{data.contact.address}</p>
                  </div>
                </div>
                {data.contact.phones.map((phone, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">Call Us</h4>
                      <p className="text-sm text-muted-foreground">{phone}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Us</h4>
                    <p className="text-sm text-muted-foreground">hello@designbhai.com</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <Link key={i} href="#" className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            <Card className="p-8 rounded-3xl border-border/50 shadow-2xl">
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input placeholder="Enter your name" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <Input type="email" placeholder="email@example.com" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Message</label>
                  <Textarea placeholder="How can we help?" className="rounded-xl" rows={5} />
                </div>
                <Button className="w-full h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                  Send Message <Send className="w-4 h-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline tracking-tighter">
              Design<span className="text-primary">Bhai</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium graphics design studio specializing in logo design, branding, and digital assets.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#home" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link href="#about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Services</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {data.services.slice(0, 4).map(s => (
                <li key={s.id}><span className="hover:text-primary cursor-default">{s.title}</span></li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Newsletter</h4>
            <p className="text-slate-400 text-sm">Stay updated with our latest works.</p>
            <div className="flex gap-2">
              <Input className="bg-white/5 border-white/10 text-white rounded-lg h-11" placeholder="Email" />
              <Button size="icon" className="shrink-0 rounded-lg">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} DesignBhai Creative Studio. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-slate-500">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
