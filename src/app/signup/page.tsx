
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNavbar } from "@/components/site-navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: fullName });
      
      // Save user profile to Firestore for Admin to see
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName,
        email: email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

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
      <div className="flex items-center justify-center pt-32 px-6 pb-12">
        <Card className="w-full max-w-md rounded-[2.5rem] shadow-2xl border-none overflow-hidden">
          <div className="green-gradient p-8 text-white text-center">
            <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
            <CardDescription className="text-white/80">Create an account to track your orders easily.</CardDescription>
          </div>
          <form onSubmit={handleSignup} className="p-8">
            <CardContent className="space-y-4 px-0">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Ripon Kha" className="pl-10 rounded-xl" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="name@example.com" className="pl-10 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="Create a password" className="pl-10 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 px-0 pt-6">
              <Button type="submit" className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"} <ArrowRight className="ml-2 w-4 h-4" />
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
