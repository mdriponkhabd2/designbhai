
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth } from "@/firebase";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, query, where, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  ShoppingBag, 
  Package, 
  MessageCircle, 
  User as UserIcon, 
  ShieldCheck,
  Mail,
  Calendar,
  Clock,
  LogOut,
  Wallet,
  Settings,
  ExternalLink,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/lib/admin-store";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const { data: adminData } = useAdminData();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  // Optimized query for orders
  const ordersQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [user, db]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out successfully", description: "Come back soon!" });
      router.push("/");
    } catch (error) {
      toast({ variant: "destructive", title: "Logout failed" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 rounded-full">Completed</Badge>;
      case "processing": return <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 rounded-full font-bold animate-pulse">Processing</Badge>;
      case "cancelled": return <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1 rounded-full">Cancelled</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 px-3 py-1 rounded-full">Pending Verification</Badge>;
    }
  };

  if (isUserLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground font-bold text-xl tracking-tight">Accessing Secure Profile...</p>
      </div>
    </div>
  );

  if (!user) {
    if (typeof window !== 'undefined') router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <SiteNavbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Top Header Card */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10 bg-white p-10 rounded-[3rem] shadow-xl shadow-primary/5 border border-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-24 h-24 green-gradient rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/30 transform group-hover:rotate-6 transition-transform duration-500">
                <UserIcon className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900">{user.displayName || 'DesignBhai Client'}</h1>
                <div className="flex flex-wrap gap-5 mt-3">
                  <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> {user.email}
                  </p>
                  <p className="text-sm font-bold text-green-600 flex items-center gap-2 bg-green-50 px-4 py-1 rounded-full border border-green-100">
                    <ShieldCheck className="w-4 h-4" /> Active Account
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 relative z-10">
              <Button variant="ghost" onClick={handleLogout} className="rounded-2xl h-14 px-8 gap-3 text-destructive font-black hover:bg-destructive/10 transition-all border border-destructive/10">
                <LogOut className="w-5 h-5" /> Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="orders" className="space-y-10">
            <TabsList className="bg-white p-2 rounded-[2rem] border border-border/40 h-auto flex shadow-xl shadow-primary/5 w-fit flex-wrap gap-2">
              <TabsTrigger value="orders" className="rounded-[1.5rem] px-10 py-4 data-[state=active]:bg-primary data-[state=active]:text-white gap-3 font-black text-base transition-all duration-300">
                <ShoppingBag className="w-5 h-5" /> MY ORDERS
              </TabsTrigger>
              <TabsTrigger value="add-money" className="rounded-[1.5rem] px-10 py-4 data-[state=active]:bg-primary data-[state=active]:text-white gap-3 font-black text-base transition-all duration-300">
                <Wallet className="w-5 h-5" /> ADD MONEY
              </TabsTrigger>
              <TabsTrigger value="profile" className="rounded-[1.5rem] px-10 py-4 data-[state=active]:bg-primary data-[state=active]:text-white gap-3 font-black text-base transition-all duration-300">
                <UserIcon className="w-5 h-5" /> MY PROFILE
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
              {isOrdersLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-48 w-full rounded-[3rem]" />
                  <Skeleton className="h-48 w-full rounded-[3rem]" />
                </div>
              ) : orders && orders.length > 0 ? (
                orders.map((order) => (
                  <Card key={order.id} className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 group border border-primary/5">
                    <CardContent className="p-10">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                        <div className="flex-1 space-y-6">
                          <div className="flex flex-wrap items-center gap-5">
                            <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                              <Package className="w-8 h-8" />
                            </div>
                            <div>
                              <span className="font-black text-2xl text-slate-900 tracking-tight uppercase">{order.packageName}</span>
                              <div className="flex items-center gap-3 mt-1.5">
                                {getStatusBadge(order.status)}
                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5" /> Ordered: {order.createdAt ? format(order.createdAt.toDate(), "PP") : "Just now"}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-slate-100">
                            <div>
                              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2">Order Tracking</p>
                              <p className="text-sm font-black text-slate-800">#{order.id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2">Amount Paid</p>
                              <p className="text-xl font-black text-primary">৳{order.packagePrice}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2">Transaction Details</p>
                              <p className="text-sm font-mono font-black bg-muted/50 px-4 py-2 rounded-xl w-fit text-slate-700">{order.trxId}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                          <Button asChild className="rounded-2xl h-14 px-10 font-black gap-3 shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
                             <Link 
                                href={`https://wa.me/${adminData?.contact.phones[0]?.replace(/\D/g, '')}?text=Hello DesignBhai, I need support for my order: ${order.packageName} (ID: #${order.id.slice(-8).toUpperCase()})`}
                                target="_blank"
                              >
                                <MessageCircle className="w-5 h-5" /> LIVE SUPPORT
                             </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-primary/20 shadow-inner">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-12 h-12 text-primary/30" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-slate-900">No Orders Found</h3>
                  <p className="text-muted-foreground mt-3 max-w-sm mx-auto font-medium text-lg">Start your creative journey with DesignBhai today and see your dreams come to life!</p>
                  <Button className="mt-10 rounded-2xl px-16 h-16 font-black text-lg shadow-2xl shadow-primary/20 hover:scale-110 transition-all" asChild>
                    <Link href="/services">BROWSE OUR SERVICES</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-money" className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <Card className="rounded-[4rem] border-none shadow-2xl p-12 bg-white max-w-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <h3 className="text-3xl font-black mb-10 flex items-center gap-4 text-slate-900">
                  <Wallet className="w-10 h-10 text-primary" /> ADD MONEY TO WALLET
                </h3>
                <div className="space-y-10">
                  <div className="green-gradient p-10 rounded-[2.5rem] text-white shadow-2xl shadow-primary/30 relative">
                    <div className="absolute top-4 right-8 opacity-20"><Zap className="w-20 h-20" /></div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-80">Instant Payment Instructions</p>
                    <p className="text-xl mb-6 font-bold leading-relaxed">Please "Send Money" via <span className="underline decoration-wavy decoration-white/50">bKash</span> or <span className="underline decoration-wavy decoration-white/50">Nagad</span> to the official number below:</p>
                    <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl flex items-center justify-between border border-white/20">
                      <span className="text-4xl font-black font-mono tracking-tighter">01837679963</span>
                      <Badge className="bg-white text-primary font-black px-4 py-1.5 rounded-full text-xs">PERSONAL</Badge>
                    </div>
                  </div>

                  <div className="space-y-8 bg-muted/30 p-8 rounded-3xl border border-border/50">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><ShieldCheck className="w-6 h-6" /></div>
                      <p className="text-muted-foreground font-bold text-base leading-relaxed italic">After successful payment, please message our support team on WhatsApp with your <span className="text-slate-900 font-black">Transaction ID (TrxID)</span> and <span className="text-slate-900 font-black">Account Email</span>. Your balance will be updated within 5-30 minutes.</p>
                    </div>
                    <Button asChild size="lg" className="w-full rounded-[1.5rem] h-16 font-black text-lg gap-4 shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                      <Link href={`https://wa.me/8801837679963?text=Hello DesignBhai Support, I want to add money to my wallet for account: ${user.email}`}>
                        <MessageCircle className="w-7 h-7" /> CHAT WITH SUPPORT
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="lg:col-span-2 rounded-[4rem] border-none shadow-2xl p-12 bg-white">
                  <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-slate-900">
                    <Settings className="w-8 h-8 text-primary" /> PROFILE SETTINGS
                  </h3>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">DISPLAY NAME</p>
                        <p className="text-xl font-bold p-6 bg-muted/30 rounded-3xl border border-border/40 text-slate-800">{user.displayName || 'DesignBhai Client'}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">REGISTERED EMAIL</p>
                        <p className="text-xl font-bold p-6 bg-muted/30 rounded-3xl border border-border/40 text-slate-800">{user.email}</p>
                      </div>
                    </div>
                    <div className="pt-10 border-t border-slate-100">
                      <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] mb-6">ACCOUNT STATUS</p>
                      <div className="flex items-center justify-between p-8 bg-green-50 border border-green-100 rounded-[2rem] shadow-sm">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                          <div>
                            <span className="font-black text-green-800 text-lg">Verified Account</span>
                            <p className="text-sm text-green-700 font-medium">Your identity is secure and verified.</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-white border-none px-6 py-2 rounded-full font-black text-xs">ACTIVE</Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-[4rem] border-none shadow-2xl p-10 bg-slate-900 text-white text-center flex flex-col items-center justify-center space-y-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-700" />
                  <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700 relative z-10">
                    <ShieldCheck className="w-12 h-12 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black uppercase tracking-tight">PREMIUM CLIENT</h4>
                    <p className="text-white/60 text-sm mt-3 font-medium">Creative Partner Since<br />{user.metadata.creationTime ? format(new Date(user.metadata.creationTime), "MMMM yyyy") : 'Joining...'}</p>
                  </div>
                  <Button variant="secondary" className="w-full rounded-[1.5rem] h-14 font-black shadow-2xl shadow-black/50 relative z-10 hover:bg-white hover:text-slate-900 transition-all" asChild>
                    <Link href="/portfolio">EXPLORE PORTFOLIO</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
