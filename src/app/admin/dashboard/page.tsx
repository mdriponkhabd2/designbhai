
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageIcon, Briefcase, Settings as SettingsIcon, CheckCircle, ShoppingBag, MessageSquare } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { data, saveData, isLoaded } = useAdminData();

  if (!isLoaded) return null;

  const handleStatsChange = (field: string, value: string) => {
    saveData({
      ...data,
      settings: {
        ...data.settings,
        stats: {
          ...data.settings.stats,
          [field]: value
        }
      }
    });
    toast({ title: "Stats updated", description: "Publicly visible numbers have been refreshed." });
  };

  const statsCards = [
    { title: "Portfolio Items", value: data.portfolio.length, icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Active Services", value: data.services.length, icon: Briefcase, color: "text-green-500", bg: "bg-green-50" },
    { title: "Pricing Plans", value: data.packages.length + data.hostingPackages.length, icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-50" },
    { title: "Total Products", value: data.products.length, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-headline font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1 text-lg">Quick summary of DesignBhai website content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-border/60 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Live Success Counters
            </CardTitle>
            <CardDescription>These numbers are visible to customers on the home page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider">Completed Projects</Label>
                <Input 
                  defaultValue={data.settings.stats.completed} 
                  onBlur={(e) => handleStatsChange('completed', e.target.value)}
                  placeholder="e.g. 500+"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider">Happy Clients</Label>
                <Input 
                  defaultValue={data.settings.stats.happyClients} 
                  onBlur={(e) => handleStatsChange('happyClients', e.target.value)}
                  placeholder="e.g. 200+"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider">Active Orders</Label>
                <Input 
                  defaultValue={data.settings.stats.pending} 
                  onBlur={(e) => handleStatsChange('pending', e.target.value)}
                  placeholder="e.g. 15"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Global Site Identity</CardTitle>
            <CardDescription>Basic site configuration summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="p-2 bg-background rounded border shadow-sm">
                <SettingsIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Site Title</p>
                <p className="text-xs text-muted-foreground">{data.settings.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="p-2 bg-background rounded border shadow-sm">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Hero Status</p>
                <p className="text-xs text-muted-foreground">{data.settings.heroImageUrl ? "Custom Image Active" : "Default Active"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
