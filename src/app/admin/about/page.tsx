
"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, RefreshCcw, ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function AboutPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [formData, setFormData] = useState({ text: "", imageUrl: "" });

  useEffect(() => {
    if (isLoaded) {
      setFormData({ text: data.about.text, imageUrl: data.about.imageUrl });
    }
  }, [isLoaded, data.about]);

  if (!isLoaded) return null;

  const handleSave = () => {
    saveData({ ...data, about: formData });
    toast({ title: "Section updated", description: "About Us content has been saved successfully." });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">About Us Management</h1>
        <p className="text-muted-foreground mt-1">Edit the story and imagery that represents your studio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>The text and images displayed in the about section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="about-img">Featured Image URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="about-img" 
                    value={formData.imageUrl} 
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-text">About Us Text</Label>
                <Textarea 
                  id="about-text" 
                  value={formData.text} 
                  onChange={e => setFormData({...formData, text: e.target.value})}
                  rows={10}
                  className="leading-relaxed"
                  placeholder="Write your company story..."
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/60 overflow-hidden sticky top-8">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-sm uppercase tracking-wider font-bold text-muted-foreground">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 space-y-6">
                <div className="relative aspect-video rounded-lg overflow-hidden border shadow-inner bg-muted">
                  {formData.imageUrl ? (
                    <Image 
                      src={formData.imageUrl} 
                      alt="About Preview" 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                      <ImageIcon className="w-8 h-8 opacity-20" />
                      <span className="text-xs">No image URL provided</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-headline font-bold text-primary">Our Story</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-4 py-1">
                      {formData.text || "No description provided yet..."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
