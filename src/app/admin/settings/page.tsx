"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, ShieldCheck, Palette, Save, ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function SettingsPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [title, setTitle] = useState("");
  const [favicon, setFavicon] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");

  useEffect(() => {
    if (isLoaded) {
      setTitle(data.settings.title);
      setFavicon(data.settings.favicon);
      setHeroImageUrl(data.settings.heroImageUrl || "");
    }
  }, [isLoaded, data]);

  if (!isLoaded) return null;

  const handleSave = () => {
    saveData({ ...data, settings: { title, favicon, heroImageUrl } });
    toast({ title: "Settings updated", description: "Global website settings have been refreshed." });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Global Settings</h1>
        <p className="text-muted-foreground mt-1">Configure fundamental properties of DesignBhai website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Identity Configuration
              </CardTitle>
              <CardDescription>Main website title and branding elements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-title">Website Title</Label>
                <Input 
                  id="site-title" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  placeholder="DesignBhai | Creative Design Agency"
                />
                <p className="text-[10px] text-muted-foreground">This appears in search results and browser tabs.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-favicon">Favicon URL</Label>
                <Input 
                  id="site-favicon" 
                  value={favicon} 
                  onChange={e => setFavicon(e.target.value)}
                  placeholder="/favicon.ico"
                />
                <p className="text-[10px] text-muted-foreground">URL to the small icon shown in browser address bars.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Hero Image Management
              </CardTitle>
              <CardDescription>Change the main featured image on the homepage hero section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hero-img">Hero Image URL</Label>
                <Input 
                  id="hero-img" 
                  value={heroImageUrl} 
                  onChange={e => setHeroImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border bg-muted group">
                  {heroImageUrl ? (
                    <Image 
                      src={heroImageUrl} 
                      alt="Hero Preview" 
                      fill 
                      className="object-cover"
                      unoptimized={heroImageUrl.startsWith('https://scontent')}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <ImageIcon className="w-8 h-8 opacity-20 mb-2" />
                      <span className="text-xs">No image URL provided</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                System Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-primary/10 pb-2">
                <span className="text-muted-foreground">CMS Version</span>
                <span className="font-mono font-bold">v1.2.0-stable</span>
              </div>
              <div className="flex justify-between border-b border-primary/10 pb-2">
                <span className="text-muted-foreground">Environment</span>
                <span className="text-green-600 font-semibold">Production</span>
              </div>
              <div className="flex justify-between border-b border-primary/10 pb-2">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="text-xs">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="pt-4">
                <Button className="w-full gap-2 shadow-lg" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
