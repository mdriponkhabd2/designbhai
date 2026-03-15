
"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, ShieldCheck, Palette, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [title, setTitle] = useState("");
  const [favicon, setFavicon] = useState("");

  useEffect(() => {
    if (isLoaded) {
      setTitle(data.settings.title);
      setFavicon(data.settings.favicon);
    }
  }, [isLoaded, data]);

  if (!isLoaded) return null;

  const handleSave = () => {
    saveData({ ...data, settings: { title, favicon } });
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
                <Palette className="w-5 h-5 text-primary" />
                Branding & Aesthetics
              </CardTitle>
              <CardDescription>Customization options for website themes (Admin only view).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 opacity-60">
              <div className="p-4 rounded-lg bg-muted border border-dashed border-border flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Primary Color Theme</h4>
                  <p className="text-xs text-muted-foreground">Muted Studio Green (Active)</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary shadow-inner border border-white/20"></div>
              </div>
              <div className="p-4 rounded-lg bg-muted border border-dashed border-border flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Typography Pack</h4>
                  <p className="text-xs text-muted-foreground">Inter Sans-Serif (Standard)</p>
                </div>
                <span className="text-xs font-mono bg-white px-2 py-1 rounded border">Inter</span>
              </div>
              <p className="text-[10px] text-center italic text-muted-foreground">Visual themes are currently locked to branding standards.</p>
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
