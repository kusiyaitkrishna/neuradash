'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Shield, Scan, AlertTriangle, Database, User, LogOut, Activity, ChevronRight, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth/auth-store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const sidebarItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Identities', href: '/identities', icon: Shield },
    { name: 'Scans', href: '/scans', icon: Scan },
    { name: 'Threats', href: '/threats', icon: AlertTriangle },
    { name: 'Sources', href: '/sources', icon: Database },
    { name: 'Analytics', href: '/analytics', icon: Activity },
    { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <aside className="flex h-screen w-72 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
            {/* Brand Header */}
            <div className="flex h-16 items-center gap-3 border-b border-border px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Shield className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight">Neuraguard</span>
                    <span className="text-[10px] font-medium text-muted-foreground">Enterprise Security</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Platform
                </div>
                <div className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Button
                                key={item.href}
                                variant="ghost"
                                className={cn(
                                    "group w-full justify-between px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                                    isActive
                                        ? "bg-secondary text-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                )}
                                onClick={() => router.push(item.href)}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                    {item.name}
                                </div>
                                {isActive && (
                                    <motion.div layoutId="active-nav" className="h-1.5 w-1.5 rounded-full bg-primary" />
                                )}
                            </Button>
                        );
                    })}
                </div>
            </nav>

            {/* Footer Actions */}
            <div className="border-t border-border p-4">
                <div className="mb-4 rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">System Status</span>
                        <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </div>
                    <div className="text-lg font-bold tracking-tight">99.9%</div>
                    <div className="text-[10px] text-muted-foreground">Uptime this month</div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
