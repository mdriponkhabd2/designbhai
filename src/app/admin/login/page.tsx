
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, KeyRound, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated secure check
    setTimeout(() => {
      if (password === "admin123") { // The requested single password
        sessionStorage.setItem("admin_auth", "true");
        toast({
          title: "Access Granted",
          description: "Welcome back, Admin.",
        });
        router.push("/admin/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Incorrect administrative password.",
        });
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background via-accent/20 to-primary/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-foreground">DesignBhai</h1>
          <p className="text-muted-foreground mt-2">Administrative Access Portal</p>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle className="text-xl">Authentication Required</CardTitle>
            <CardDescription>Enter your master password to access the panel.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="Enter admin password" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Access Dashboard"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} DesignBhai Creative Studio. Secure Environment.
        </p>
      </div>
    </div>
  );
}
