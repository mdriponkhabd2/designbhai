
"use client";

import { useState, useEffect } from "react";
import { useAdminData, PricingPackage, HostingPackage } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, CreditCard, Server } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function PricingAdminPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [hostingPackages, setHostingPackages] = useState<HostingPackage[]>([]);

  useEffect(() => {
    if (isLoaded) {
      setPackages([...data.packages]);
      setHostingPackages([...data.hostingPackages]);
    }
  }, [isLoaded, data]);

  if (!isLoaded) return null;

  const handlePackageChange = (id: string, field: keyof PricingPackage, value: any) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleHostingChange = (id: string, field: keyof HostingPackage, value: any) => {
    setHostingPackages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
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

  const handleHostingFeatureChange = (pkgId: string, index: number, value: string) => {
    setHostingPackages(prev => prev.map(p => {
      if (p.id === pkgId) {
        const newFeatures = [...p.features];
        newFeatures[index] = value;
        return { ...p, features: newFeatures };
      }
      return p;
    }));
  };

  const addFeature = (pkgId: string, type: 'design' | 'hosting') => {
    if (type === 'design') {
      setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, features: [...p.features, ""] } : p));
    } else {
      setHostingPackages(prev => prev.map(p => p.id === pkgId ? { ...p, features: [...p.features, ""] } : p));
    }
  };

  const removeFeature = (pkgId: string, index: number, type: 'design' | 'hosting') => {
    if (type === 'design') {
      setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, features: p.features.filter((_, i) => i !== index) } : p));
    } else {
      setHostingPackages(prev => prev.map(p => p.id === pkgId ? { ...p, features: p.features.filter((_, i) => i !== index) } : p));
    }
  };

  const handleSave = () => {
    saveData({ 
      ...data, 
      packages: packages.map(p => ({ ...p, features: p.features.filter(f => f.trim() !== "") })),
      hostingPackages: hostingPackages.map(p => ({ ...p, features: p.features.filter(f => f.trim() !== "") }))
    });
    toast({ title: "Pricing updated", description: "Design packages and Hosting plans have been saved." });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Pricing & Hosting Management</h1>
          <p className="text-muted-foreground mt-1">Configure your design packages and domain hosting plans.</p>
        </div>
        <Button size="lg" className="gap-2 shadow-lg" onClick={handleSave}>
          <Save className="w-5 h-5" />
          Save All Changes
        </Button>
      </div>

      <div className="space-y-12">
        {/* Design Packages */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-primary">Design Packages</h2>
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
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Order Link (Action Link)</Label>
                    <Input 
                      value={pkg.orderLink} 
                      onChange={e => handlePackageChange(pkg.id, 'orderLink', e.target.value)}
                      placeholder="https://..."
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFeature(pkg.id, idx, 'design')}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full text-[10px] h-7 border-dashed" onClick={() => addFeature(pkg.id, 'design')}>
                      <Plus className="w-3 h-3 mr-1" /> Add Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hosting Packages */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-2">
            <Server className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-green-600">Hosting Packages (Domain + Hosting)</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {hostingPackages.map((pkg) => (
              <Card key={pkg.id} className={`border-border/60 ${pkg.isPopular ? 'ring-2 ring-primary shadow-md' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Input 
                      value={pkg.name} 
                      onChange={e => handleHostingChange(pkg.id, 'name', e.target.value)}
                      className="font-bold border-none p-0 focus-visible:ring-0 text-lg h-auto"
                    />
                  </CardTitle>
                  <CardDescription>
                    <Input 
                      value={pkg.description} 
                      onChange={e => handleHostingChange(pkg.id, 'description', e.target.value)}
                      className="border-none p-0 focus-visible:ring-0 text-sm h-auto"
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Price (৳ / month)</Label>
                    <Input 
                      value={pkg.price} 
                      onChange={e => handleHostingChange(pkg.id, 'price', e.target.value)}
                      placeholder="e.g. 199"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Order Link (Order Now Button)</Label>
                    <Input 
                      value={pkg.orderLink} 
                      onChange={e => handleHostingChange(pkg.id, 'orderLink', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Features</Label>
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input 
                          value={feature} 
                          onChange={e => handleHostingFeatureChange(pkg.id, idx, e.target.value)}
                          className="text-xs h-8"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFeature(pkg.id, idx, 'hosting')}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full text-[10px] h-7 border-dashed" onClick={() => addFeature(pkg.id, 'hosting')}>
                      <Plus className="w-3 h-3 mr-1" /> Add Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
