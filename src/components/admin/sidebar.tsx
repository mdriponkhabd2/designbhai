
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ImageIcon, 
  Briefcase, 
  Users, 
  Phone, 
  Settings, 
  LogOut,
  ChevronRight,
  MessageSquareText,
  CreditCard,
  ShoppingBag,
  Star,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { name: "Users List", icon: Users, href: "/admin/users" },
  { name: "Messages", icon: MessageSquareText, href: "/admin/messages" },
  { name: "Products", icon: Package, href: "/admin/products" },
  { name: "Portfolio", icon: ImageIcon, href: "/admin/portfolio" },
  { name: "Services", icon: Briefcase, href: "/admin/services" },
  { name: "Pricing & Hosting", icon: CreditCard, href: "/admin/pricing" },
  { name: "Reviews", icon: Star, href: "/admin/reviews" },
  { name: "About Us", icon: Users, href: "/admin/about" },
  { name: "Contact", icon: Phone, href: "/admin/contact" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl z-10">
      <div className="flex h-20 items-center px-6 border-b border-sidebar-border bg-sidebar-accent/30">
        <h1 className="text-xl font-headline font-black tracking-tighter text-sidebar-primary uppercase">
          Design<span className="text-white">Bhai</span> <span className="text-xs font-bold text-muted-foreground ml-1">Panel</span>
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-sidebar-foreground/30 group-hover:text-white")} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/10">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-400/10 font-bold rounded-xl"
        >
          <LogOut className="h-5 w-5" />
          Logout System
        </Button>
      </div>
    </div>
  );
}
