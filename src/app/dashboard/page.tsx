
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collection, query, where, orderBy } from "firebase/firestore";
import { ShoppingBag, Clock, Package, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/lib/admin-store";

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const { data: adminData } = useAdminData();
  const db = useFirestore();

  // Optimized query with specific security rule alignment
  const ordersQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    // Security rules strictly require filtering by userId for non-admin list operations
    return query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }, [user, db]);

  const { data: orders, isLoading } = useCollection(ordersQuery);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case "processing": return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Processing</Badge>;
      case "cancelled": return <Badge className="bg-red-100 text-red-700 border-red-200">Cancelled</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
    }
  };

  if (isUserLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="animate-pulse font-medium text-muted-foreground">Syncing your dashboard...</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-muted/30">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Session Required</h1>
        <p className="text-muted-foreground">Please login to access your order history.</p>
      </div>
      <Button asChild className="rounded-xl px-8"><Link href="/login">Go to Login</Link></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/20">
      <SiteNavbar />
      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-headline font-bold">My Orders</h1>
              <p className="text-muted-foreground mt-2">Manage and track your active service subscriptions.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/50">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Account</p>
              <p className="font-bold text-primary truncate max-w-[200px]">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              [1, 2].map(i => <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />)
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-8 flex-1 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Package className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-xl">{order.packageName}</span>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Ordered On</p>
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> 
                            {order.createdAt ? format(order.createdAt.toDate(), "PPpp") : "Processing..."}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Amount Paid</p>
                          <p className="text-lg font-bold text-primary">৳{order.packagePrice}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Transaction ID</p>
                          <p className="text-sm font-mono font-bold select-all bg-muted/50 px-2 py-0.5 rounded">{order.trxId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary/5 p-8 md:w-64 flex flex-col items-center justify-center border-l border-border/10">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-4 tracking-widest text-center">Need Help?</p>
                      <Button variant="outline" size="sm" className="w-full gap-2 rounded-xl h-11 border-primary/20 hover:bg-primary/5" asChild>
                        <Link 
                          href={`https://wa.me/${adminData.contact.phones[0]?.replace(/\D/g, '')}?text=Hello, I have an inquiry about my order for ${order.packageName}. TrxID: ${order.trxId}`}
                          target="_blank"
                        >
                          <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp Support
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-border/60">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/10 mx-auto mb-6" />
                <h3 className="text-2xl font-bold">No orders found</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">You haven't placed any orders yet. Start your project today!</p>
                <Button className="mt-8 rounded-xl px-10 h-12 shadow-lg shadow-primary/20" asChild>
                  <Link href="/services">Browse Services</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
