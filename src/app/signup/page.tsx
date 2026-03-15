
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNavbar } from "@/components/site-navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: "Account Created!", description: "Welcome to DesignBhai." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <SiteNavbar />
      <div className="flex items-center justify-center pt-32 px-6">
        <Card className="w-full max-w-md rounded-3xl shadow-xl border-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription>Create an account to track your orders easily.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="name@example.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="Create a password" className="pl-10" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full rounded-xl h-12" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
