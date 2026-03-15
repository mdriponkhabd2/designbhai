
"use client";

import { useAdminData } from "@/lib/admin-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageIcon, Briefcase, Phone, Settings as SettingsIcon, MousePointer2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { data, isLoaded } = useAdminData();

  if (!isLoaded) return null;

  const stats = [
    { title: "Portfolio Items", value: data.portfolio.length, icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Active Services", value: data.services.length, icon: Briefcase, color: "text-green-500", bg: "bg-green-50" },
    { title: "Contact Points", value: data.contact.phones.length + 1, icon: Phone, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "App Visitors", value: "1,284", icon: MousePointer2, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1 text-lg">Quick summary of DesignBhai website content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
            <CardTitle>Content Health</CardTitle>
            <CardDescription>Status of your website sections completion.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>About Us Section</span>
                <span className="font-semibold">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Portfolio Gallery</span>
                <span className="font-semibold">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Services Definitions</span>
                <span className="font-semibold">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Global Settings</CardTitle>
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
                <p className="text-sm font-semibold">Favicon</p>
                <p className="text-xs text-muted-foreground">{data.settings.favicon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
