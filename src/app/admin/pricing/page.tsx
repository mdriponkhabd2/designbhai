
"use client";

import { useState, useEffect } from "react";
import { useAdminData, PricingPackage, HostingOption } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Check, Plus, Trash2, CreditCard, Server } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function PricingAdminPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [hosting, setHosting] = useState<HostingOption | null>(null);

  useEffect(() => {
    if (isLoaded) {
      setPackages([...data.packages]);
      setHosting({ ...data.hosting });
    }
  }, [isLoaded, data]);

  if (!isLoaded || !hosting) return null;

  const handlePackageChange = (id: string, field: keyof PricingPackage, value: any) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleFeatureChange = (pkgId: string, index: number, value: string) => {
    setPackages(prev => prev.map(p => {
      if (p.id === pkgId) {
        const newFeatures = [...p.features];
        newFeatures[index] = value;
        return { ...p, features: newFeatures };
      }
      return p;
    }));
  };

  const addFeature = (pkgId: string) => {
    setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, features: [...p.features, ""] } : p));
  };

  const removeFeature = (pkgId: string, index: number) => {
    setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, features: p.features.filter((_, i) => i !== index) } : p));
  };

  const handleHostingChange = (field: keyof HostingOption, value: any) => {
    if (hosting) {
      setHosting({ ...hosting, [field]: value });
    }
  };

  const handleHostingFeatureChange = (index: number, value: string) => {
    if (hosting) {
      const newFeatures = [...hosting.features];
      newFeatures[index] = value;
      setHosting({ ...hosting, features: newFeatures });
    }
  };

  const handleSave = () => {
    if (hosting) {
      saveData({ 
        ...data, 
        packages: packages.map(p => ({ ...p, features: p.features.filter(f => f.trim() !== "") })),
        hosting: { ...hosting, features: hosting.features.filter(f => f.trim() !== "") }
      });
      toast({ title: "Pricing updated", description: "Packages and hosting details have been saved." });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-headline font-bold">Pricing & Hosting Management</h1>
        <p className="text-muted-foreground mt-1">Configure your design packages and hosting plans.</p>
      </div>

      <div className="space-y-12">
        {/* Design Packages */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Design Packages</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className={`border-border/60 ${pkg.isPopular ? 'ring-1 ring-primary' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Input 
                      value={pkg.name} 
                      onChange={e => handlePackageChange(pkg.id, 'name', e.target.value)}
                      className="font-bold border-none p-0 focus-visible:ring-0 text-lg h-auto"
                    />
                  </CardTitle>
                  <CardDescription>
                    <Input 
                      value={pkg.description} 
                      onChange={e => handlePackageChange(pkg.id, 'description', e.target.value)}
                      className="border-none p-0 focus-visible:ring-0 text-sm h-auto"
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Price (৳)</Label>
                    <Input 
                      value={pkg.price} 
                      onChange={e => handlePackageChange(pkg.id, 'price', e.target.value)}
                      placeholder="e.g. 1,500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Order Link</Label>
                    <Input 
                      value={pkg.orderLink} 
                      onChange={e => handlePackageChange(pkg.id, 'orderLink', e.target.value)}
                      placeholder="URL (e.g. WhatsApp or Checkout)"
                    />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Features</Label>
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input 
                          value={feature} 
                          onChange={e => handleFeatureChange(pkg.id, idx, e.target.value)}
                          className="text-xs h-8"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFeature(pkg.id, idx)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full text-[10px] h-7 border-dashed" onClick={() => addFeature(pkg.id)}>
                      <Plus className="w-3 h-3 mr-1" /> Add Feature
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id={`popular-${pkg.id}`}
                      checked={pkg.isPopular} 
                      onChange={e => handlePackageChange(pkg.id, 'isPopular', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`popular-${pkg.id}`} className="text-xs cursor-pointer">Mark as Popular</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hosting Options */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-2">
            <Server className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Hosting Details</h2>
          </div>

          <Card className="border-border/60 max-w-2xl">
            <CardHeader>
              <CardTitle>Hosting Plan Settings</CardTitle>
              <CardDescription>Manage your premium hosting offer details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input 
                    value={hosting.name} 
                    onChange={e => handleHostingChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price Text</Label>
                  <Input 
                    value={hosting.price} 
                    onChange={e => handleHostingChange('price', e.target.value)}
                    placeholder="e.g. 2,000 /yr"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={hosting.description} 
                  onChange={e => handleHostingChange('description', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Order Link</Label>
                <Input 
                  value={hosting.orderLink} 
                  onChange={e => handleHostingChange('orderLink', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Plan Features</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hosting.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input 
                        value={feature} 
                        onChange={e => handleHostingFeatureChange(idx, e.target.value)}
                        className="text-xs h-9"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <Button size="lg" className="px-12 shadow-2xl gap-2 h-14 rounded-full" onClick={handleSave}>
          <Save className="w-5 h-5" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
