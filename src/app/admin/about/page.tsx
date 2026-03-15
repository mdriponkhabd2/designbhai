
"use client";

import { useState, useEffect } from "react";
import { useAdminData, TeamMember } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ImageIcon, Users, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function AboutPage() {
  const { data, saveData, isLoaded } = useAdminData();
  const [formData, setFormData] = useState({ text: "", imageUrl: "" });
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (isLoaded) {
      setFormData({ text: data.about.text, imageUrl: data.about.imageUrl });
      setTeam(data.about.team || []);
    }
  }, [isLoaded, data.about]);

  if (!isLoaded) return null;

  const handleTeamMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setTeam(prev => prev.map(member => member.id === id ? { ...member, [field]: value } : member));
  };

  const handleSave = () => {
    saveData({ 
      ...data, 
      about: { 
        ...formData, 
        team: team 
      } 
    });
    toast({ title: "Section updated", description: "About Us content and Team details have been saved." });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">About Us & Team Management</h1>
          <p className="text-muted-foreground mt-1">Edit your story and manage your creative team members.</p>
        </div>
        <Button onClick={handleSave} className="gap-2 shadow-lg">
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Story Section */}
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Company Story
              </CardTitle>
              <CardDescription>The text and featured image for your about section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="about-img">Featured Image URL</Label>
                <Input 
                  id="about-img" 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-text">About Us Text</Label>
                <Textarea 
                  id="about-text" 
                  value={formData.text} 
                  onChange={e => setFormData({...formData, text: e.target.value})}
                  rows={8}
                  className="leading-relaxed"
                  placeholder="Write your company story..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Creative Team
              </CardTitle>
              <CardDescription>Manage the members of your design studio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {team.map((member, idx) => (
                <div key={member.id} className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Team Member {idx + 1}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Full Name</Label>
                      <Input 
                        value={member.name} 
                        onChange={e => handleTeamMemberChange(member.id, 'name', e.target.value)}
                        placeholder="e.g. Ripon Kha"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Designation</Label>
                      <Input 
                        value={member.designation} 
                        onChange={e => handleTeamMemberChange(member.id, 'designation', e.target.value)}
                        placeholder="e.g. Graphics Designer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Photo URL</Label>
                    <Input 
                      value={member.imageUrl} 
                      onChange={e => handleTeamMemberChange(member.id, 'imageUrl', e.target.value)}
                      placeholder="https://picsum.photos/..."
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
