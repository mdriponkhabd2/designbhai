
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, query, where, orderBy } from "firebase/firestore";
import { 
  ShoppingBag, 
  Package, 
  MessageCircle, 
  User as UserIcon, 
  ShieldCheck,
  Mail,
  Calendar,
  ExternalLink,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/lib/admin-store";

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const { data: adminData } = useAdminData();
  const db = useFirestore();

  // Optimized query aligned with security rules
  const ordersQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [user, db]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case "processing": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Processing</Badge>;
      case "cancelled": return <Badge className="bg-red-100 text-red-700 border-red-200">Cancelled</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
    }
  };

  if (isUserLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground font-medium">Loading your profile...</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-muted/30 p-6">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-2">
        <UserIcon className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold text-center">Please login to track your orders.</h1>
      <div className="flex gap-4">
        <Button asChild className="rounded-xl px-10"><Link href="/login">Login</Link></Button>
        <Button asChild variant="outline" className="rounded-xl px-10"><Link href="/signup">Sign Up</Link></Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/5">
      <SiteNavbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-border/40">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 green-gradient rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <UserIcon className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{user.displayName || 'Customer'}</h1>
                <div className="flex flex-wrap gap-4 mt-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {user.email}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Account Verified
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild className="rounded-xl gap-2 shadow-lg shadow-primary/10">
                <Link href="/services">Order New Service</Link>
              </Button>
              <Button variant="outline" className="rounded-xl gap-2" asChild>
                <Link 
                  href={`https://wa.me/${adminData?.contact.phones[0]?.replace(/\D/g, '')}`}
                  target="_blank"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" /> Live Support
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="orders" className="space-y-8">
            <TabsList className="bg-white p-1 rounded-2xl border border-border/40 h-auto flex shadow-sm w-fit">
              <TabsTrigger value="orders" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white gap-2 font-bold">
                <ShoppingBag className="w-4 h-4" /> My Orders
              </TabsTrigger>
              <TabsTrigger value="profile" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white gap-2 font-bold">
                <UserIcon className="w-4 h-4" /> Profile Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              {isOrdersLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-40 w-full rounded-3xl" />
                  <Skeleton className="h-40 w-full rounded-3xl" />
                </div>
              ) : orders && orders.length > 0 ? (
                orders.map((order) => (
                  <Card key={order.id} className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white hover:shadow-md transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                              <Package className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="font-black text-xl text-foreground">{order.packageName}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                {getStatusBadge(order.status)}
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Updated: {order.createdAt ? format(order.createdAt.toDate(), "PP") : "..."}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-border/30">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Order ID</p>
                              <p className="text-sm font-mono font-bold">#{order.id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Total Paid</p>
                              <p className="text-lg font-bold text-primary">৳{order.packagePrice}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Transaction ID</p>
                              <p className="text-sm font-mono font-bold bg-muted/50 px-3 py-1 rounded-lg w-fit select-all">{order.trxId}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Button variant="outline" className="rounded-xl flex-1 md:flex-none gap-2" asChild>
                             <Link 
                                href={`https://wa.me/${adminData?.contact.phones[0]?.replace(/\D/g, '')}?text=Support request for Order #${order.id.slice(-6).toUpperCase()}`}
                                target="_blank"
                              >
                                <MessageCircle className="w-4 h-4" /> Message Us
                             </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-border/50">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/10 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">No orders found yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Start your first project with us and track progress here!</p>
                  <Button className="mt-8 rounded-xl px-12 h-12 font-bold shadow-lg" asChild><Link href="/services">Browse Services</Link></Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm p-10 bg-white">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" /> Profile Details
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1.5">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Display Name</p>
                        <p className="text-lg font-medium p-4 bg-muted/20 rounded-2xl border border-border/30">{user.displayName || 'Not Set'}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Email Address</p>
                        <p className="text-lg font-medium p-4 bg-muted/20 rounded-2xl border border-border/30">{user.email}</p>
                      </div>
                    </div>
                    <div className="pt-6 border-t">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-4">Account Security</p>
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-800">Your account is fully secured</span>
                        </div>
                        <Badge className="bg-green-600 text-white border-none">Active</Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-primary text-white text-center flex flex-col items-center justify-center space-y-6">
                  <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">DesignBhai Client</h4>
                    <p className="text-white/80 text-sm mt-2">Member since {user.metadata.creationTime ? format(new Date(user.metadata.creationTime), "MMMM yyyy") : 'N/A'}</p>
                  </div>
                  <Button variant="secondary" className="w-full rounded-xl font-bold" asChild>
                    <Link href="/portfolio">Explore Our Work</Link>
                  </Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
