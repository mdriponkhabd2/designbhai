
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Calendar, Mail, ShieldCheck, Search, Users as UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function UsersAdminPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  
  const usersQuery = useMemoFirebase(() => {
    return query(collection(db, "users"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: users, isLoading } = useCollection(usersQuery);

  const filteredUsers = users?.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8 font-bold animate-pulse">Loading Registered Users...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black uppercase">Registered Clients</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage and view all registered users of DesignBhai.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border">
           <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Clients</p>
              <p className="text-2xl font-black text-primary">{users?.length || 0}</p>
           </div>
           <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <UsersIcon className="w-6 h-6" />
           </div>
        </div>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search by name or email..." 
          className="pl-12 h-14 rounded-2xl shadow-sm border-border/60 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers?.map((user) => (
          <Card key={user.id} className="border-border/60 hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden group">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <UserIcon className="w-8 h-8" />
                </div>
                <div className="overflow-hidden">
                  <CardTitle className="text-lg font-bold truncate">{user.fullName}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3" /> {user.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-bold">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined: {user.createdAt ? format(user.createdAt.toDate(), "PP") : "N/A"}
                </span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 uppercase tracking-tighter">
                  Verified Client
                </Badge>
              </div>
              <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">User UID</span>
                <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded select-all">{user.uid}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers?.length === 0 && (
          <div className="col-span-full text-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50">
            <UserIcon className="w-16 h-16 text-muted-foreground/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No users found</h3>
            <p className="text-muted-foreground">No registered clients match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
