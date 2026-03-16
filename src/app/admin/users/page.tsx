
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Calendar, Mail, Search, Users as UsersIcon, ShieldCheck, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black uppercase tracking-tight">Registered Clients</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage and view detailed profiles of your customers.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-sm border border-border/50">
           <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Active Clients</p>
              <p className="text-3xl font-black text-primary">{users?.length || 0}</p>
           </div>
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <UsersIcon className="w-7 h-7" />
           </div>
        </div>
      </div>

      <div className="relative group max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search clients by name or email address..." 
          className="pl-12 h-14 rounded-2xl shadow-sm border-border/60 focus:ring-primary text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-[2.5rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers?.map((user) => (
            <Card key={user.id} className="border-border/60 hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden group bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <UserIcon className="w-9 h-9" />
                  </div>
                  <div className="overflow-hidden">
                    <CardTitle className="text-xl font-bold truncate tracking-tight">{user.fullName}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 truncate font-medium">
                      <Mail className="w-3.5 h-3.5" /> {user.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-bold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    Joined: {user.createdAt ? format(user.createdAt.toDate(), "PP") : "N/A"}
                  </span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 uppercase tracking-tighter rounded-full">
                    Verified Client
                  </Badge>
                </div>
                
                <div className="pt-4 border-t border-border/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Client Identity</span>
                    <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full select-all">
                      {user.uid.slice(0, 12)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary/80">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Registered via Email/Password</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredUsers?.length === 0 && (
            <div className="col-span-full text-center py-32 bg-muted/20 rounded-[3.5rem] border-2 border-dashed border-border/50">
              <UserIcon className="w-20 h-20 text-muted-foreground/10 mx-auto mb-6" />
              <h3 className="text-2xl font-bold tracking-tight">No matching clients found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">We couldn't find any registered users matching your search term. Please try again with different criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
