
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ImageIcon, 
  Briefcase, 
  User, 
  Phone, 
  Settings, 
  LogOut,
  ChevronRight,
  MessageSquareText,
  CreditCard,
  ShoppingBag,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { name: "Messages", icon: MessageSquareText, href: "/admin/messages" },
  { name: "Portfolio", icon: ImageIcon, href: "/admin/portfolio" },
  { name: "Services", icon: Briefcase, href: "/admin/services" },
  { name: "Pricing & Hosting", icon: CreditCard, href: "/admin/pricing" },
  { name: "Reviews", icon: Star, href: "/admin/reviews" },
  { name: "About Us", icon: User, href: "/admin/about" },
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
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex h-20 items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-headline font-bold tracking-tight text-sidebar-primary">
          DesignBhai <span className="text-sidebar-foreground/60 font-medium">Admin</span>
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground")} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-400/10"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
