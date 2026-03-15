
"use client";

import { useAdminData, PricingPackage, HostingPackage } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Server, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Clock, 
  MessageCircle, 
  ArrowUpRight 
} from "lucide-react";
import { useState } from "react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { CheckoutModal } from "@/components/checkout-modal";

export default function ServicesPage() {
  const { data, isLoaded } = useAdminData();
  const [selectedPkg, setSelectedPkg] = useState<PricingPackage | HostingPackage | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isLoaded) return null;

  const handleOrder = (pkg: any) => {
    setSelectedPkg(pkg);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      
      <main className="pt-32 pb-24">
        {/* Design Packages Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <Badge variant="outline" className="px-4 py-1 text-primary">Pricing Plans</Badge>
              <h1 className="text-5xl font-headline font-bold">Choose Your Package</h1>
              <p className="text-muted-foreground">Affordable design solutions for every budget.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.packages.map((pkg) => (
                <Card key={pkg.id} className={`relative p-8 rounded-[2rem] border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group ${pkg.isPopular ? 'border-primary ring-2 ring-primary/20 scale-105 z-10' : ''}`}>
                  {pkg.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-6 py-2 rounded-bl-3xl uppercase tracking-tighter">
                      ⭐ Most Popular
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{pkg.name}</h3>
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
                  <Button onClick={() => handleOrder(pkg)} className={`w-full rounded-2xl h-12 font-bold ${pkg.isPopular ? 'shadow-lg shadow-primary/20' : 'variant-outline'}`}>
                    Order Now
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Domain + Hosting Section */}
        <section className="py-24 bg-[#0a2e1a] text-white relative overflow-hidden rounded-[4rem] mx-6">
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
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-14 font-bold shadow-2xl shadow-primary/20" onClick={() => handleOrder(data.hostingPackages[1])}>
                  Order Now <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-6 w-full relative z-10">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    <h4 className="font-bold">Fast SSD</h4>
                    <p className="text-xs text-slate-300">High performance storage</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <h4 className="font-bold">SSL Security</h4>
                    <p className="text-xs text-slate-300">Encrypted protection</p>
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
                <Card key={pkg.id} className={`relative p-8 rounded-[2rem] bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-500 flex flex-col group ${pkg.isPopular ? 'ring-2 ring-primary shadow-2xl shadow-primary/30 bg-white/10' : ''}`}>
                  {pkg.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-6 py-2 rounded-bl-3xl uppercase tracking-tighter">
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
                  <Button onClick={() => handleOrder(pkg)} className={`w-full rounded-2xl h-12 font-bold ${pkg.isPopular ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}>
                    Order Now
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        pkg={selectedPkg} 
      />
    </div>
  );
}
