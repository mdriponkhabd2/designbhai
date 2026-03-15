
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  MessageCircle, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Palette,
  Layout,
  Layers,
  Monitor,
  ImageIcon,
  Check,
  Server,
  Zap,
  Globe,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Star,
  Users,
  Briefcase,
  CheckCircle2,
  Timer
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function LandingPage() {
  const { data, isLoaded } = useAdminData();
  const db = useFirestore();
  const [formLoading, setFormLoading] = useState(false);

  if (!isLoaded) return null;

  const serviceIcons = [Palette, Layout, Layers, Monitor];
  const designPackages = data.packages.filter(p => p.category === 'design' || !p.category);
  const websitePackages = data.packages.filter(p => p.category === 'website');

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get('fullName'),
      emailAddress: formData.get('email'),
      message: formData.get('message'),
      receivedAt: serverTimestamp(),
      isRead: false
    };

    try {
      await addDoc(collection(db, 'contactMessages'), payload);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you soon.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later.",
      });
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] bg-[bottom_left] -z-10" />
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
                  unoptimized={data.settings.heroImageUrl.startsWith('https://')}
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

      {/* Stats Counter Section */}
      <section className="py-12 bg-primary/5 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold">{data.settings.stats.completed}</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Projects Completed</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold">{data.settings.stats.happyClients}</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Happy Clients</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold">{data.settings.stats.pending}</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Active Orders</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold">100%</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Services Section */}
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

      {/* Testimonials Carousel Section */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge variant="secondary" className="px-4 py-1 text-primary mb-4">Testimonials</Badge>
          <h2 className="text-4xl font-headline font-bold mb-16">What Our Customers Say</h2>
          
          <Carousel 
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {data.testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <Card className="border-none bg-transparent shadow-none">
                    <CardContent className="space-y-6">
                      <div className="flex justify-center gap-1 text-yellow-500">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <p className="text-2xl font-medium italic text-muted-foreground leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Website Development Packages Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline font-bold">Choose Your Package</h2>
            <p className="text-muted-foreground">Affordable website development solutions for every budget.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {websitePackages.map((pkg) => (
              <Card key={pkg.id} className={`relative p-8 rounded-3xl border-border/50 shadow-sm overflow-hidden flex flex-col ${pkg.isPopular ? 'border-primary ring-2 ring-primary/20 scale-105 z-10 bg-white' : ''}`}>
                {pkg.isPopular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-tighter">
                    ⭐ Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-primary">৳{pkg.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/ project</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full rounded-xl h-12 font-bold ${pkg.isPopular ? 'shadow-lg shadow-primary/20' : 'variant-outline'}`} asChild>
                  <Link href="/services">Order Now</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Web Hosting Section */}
      <section className="py-24 bg-[#0a2e1a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
              <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1 font-bold">Fast & Reliable Domain Hosting</Badge>
              <h2 className="text-5xl md:text-6xl font-headline font-bold leading-tight">
                Get Your Website <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Online Today</span>
              </h2>
              <p className="text-slate-300 text-lg max-w-md">
                Fast, Secure and Affordable Domain Hosting for Everyone. Launch your website with the speed and security it deserves.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-14 font-bold shadow-2xl shadow-primary/20" asChild>
                <Link href="/services">Order Now <ArrowUpRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
            <div className="relative">
              <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 p-8 flex items-center justify-center shadow-2xl backdrop-blur-md">
                <Server className="w-32 h-32 text-primary/10 absolute -top-8 -right-8" />
                <div className="grid grid-cols-2 gap-6 w-full relative z-10">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    <h4 className="font-bold">Fast SSD</h4>
                    <p className="text-xs text-slate-300">High performance storage</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <h4 className="font-bold">SSL Security</h4>
                    <p className="text-xs text-slate-300">Encrypted protection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="hosting-plans" className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-headline font-bold">Hosting Packages</h2>
            <p className="text-slate-300">Premium quality hosting for every scale of business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.hostingPackages.map((pkg) => (
              <Card key={pkg.id} className={`relative p-8 rounded-3xl bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-500 flex flex-col group ${pkg.isPopular ? 'ring-2 ring-primary shadow-2xl shadow-primary/30 bg-white/10' : ''}`}>
                {pkg.isPopular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-tighter">
                    ⭐ Popular Choice
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{pkg.name}</h3>
                  <p className="text-sm text-slate-300">{pkg.description}</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-primary">৳{pkg.price}</span>
                  <span className="text-slate-300 text-sm ml-1">/ month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full rounded-xl h-12 font-bold ${pkg.isPopular ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`} asChild>
                  <Link href="/services">Order Now</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-1 text-primary">Our Experts</Badge>
            <h2 className="text-4xl font-headline font-bold">Meet Our Creative Team</h2>
            <p className="text-muted-foreground">The talented individuals behind DesignBhai's success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.about.team?.map((member) => (
              <Card key={member.id} className="group overflow-hidden rounded-[2rem] border-border/50 hover:shadow-xl transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    {member.imageUrl ? (
                      <Image 
                        src={member.imageUrl} 
                        alt={member.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={member.imageUrl.startsWith('https://')}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">{member.designation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-4">
                <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20">Contact Us</Badge>
                <h2 className="text-4xl font-headline font-bold">Let's Work Together</h2>
                <p className="text-muted-foreground">Have a vision? We have the tools. Send us a message and let's create something amazing.</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-border/50 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Location</h4>
                    <p className="text-sm text-muted-foreground">{data.contact.address}</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-border/50 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p className="text-sm text-muted-foreground">{data.contact.phones[0]}</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-border/50 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-sm text-muted-foreground">{data.contact.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 rounded-3xl border-border/50 shadow-xl">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input name="fullName" placeholder="Enter your name" className="rounded-xl h-12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <Input name="email" type="email" placeholder="email@example.com" className="rounded-xl h-12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Message</label>
                  <Textarea name="message" placeholder="How can we help?" className="rounded-xl" rows={6} required />
                </div>
                <Button type="submit" disabled={formLoading} className="w-full h-12 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                  {formLoading ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
                </Button>
              </form>
            </Card>
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
