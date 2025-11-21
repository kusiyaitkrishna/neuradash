'use client';

import { useEffect, useState } from 'react';
import { Shield, Activity, AlertTriangle, TrendingUp, ExternalLink, Clock, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/auth/api';
import { motion } from 'framer-motion';

interface DashboardData {
    system_status: {
        status: string;
        last_scan: string;
    };
    monitored_identities: number;
    threats: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    recent_security_findings: Array<{
        id: number;
        finding_type: string;
        severity: string;
        url: string;
        created_at: string;
    }>;
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard/overview');
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading system data...</p>
                </div>
            </div>
        );
    }

    const totalThreats = data
        ? data.threats.critical + data.threats.high + data.threats.medium + data.threats.low
        : 0;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                    <p className="text-muted-foreground">
                        Real-time security insights and threat monitoring.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Clock className="mr-2 h-4 w-4" />
                        Last 24 Hours
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Activity className="mr-2 h-4 w-4" />
                        Quick Scan
                    </Button>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden border-border/50 bg-card/50 transition-colors hover:bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            All systems operational
                        </p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-20" />
                </Card>

                <Card className="relative overflow-hidden border-border/50 bg-card/50 transition-colors hover:bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Identities</CardTitle>
                        <Shield className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.monitored_identities || 0}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <ArrowUpRight className="h-3 w-3 text-blue-500" />
                            +2 this week
                        </p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20" />
                </Card>

                <Card className="relative overflow-hidden border-border/50 bg-card/50 transition-colors hover:bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Threats</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalThreats}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            Across all scans
                        </p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 opacity-20" />
                </Card>

                <Card className="relative overflow-hidden border-border/50 bg-card/50 transition-colors hover:bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{data?.threats.critical || 0}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            Requires immediate action
                        </p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500 opacity-20" />
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-4 md:grid-cols-7">
                {/* Threat Distribution */}
                <Card className="col-span-3 border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle>Threat Distribution</CardTitle>
                        <CardDescription>Severity breakdown of detected issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {[
                                { label: 'Critical', value: data?.threats.critical || 0, color: 'bg-red-500' },
                                { label: 'High', value: data?.threats.high || 0, color: 'bg-orange-500' },
                                { label: 'Medium', value: data?.threats.medium || 0, color: 'bg-yellow-500' },
                                { label: 'Low', value: data?.threats.low || 0, color: 'bg-blue-500' },
                            ].map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{item.label}</span>
                                        <span className="text-muted-foreground">{item.value}</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${totalThreats ? (item.value / totalThreats) * 100 : 0}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Findings */}
                <Card className="col-span-4 border-border/50 bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Findings</CardTitle>
                            <CardDescription>Latest security events</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data?.recent_security_findings?.map((finding) => (
                                <div
                                    key={finding.id}
                                    className="group flex items-center justify-between rounded-lg border border-transparent bg-secondary/30 p-3 transition-all hover:border-border hover:bg-secondary/50"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${finding.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                                                finding.severity === 'high' ? 'bg-orange-500/10 text-orange-500' :
                                                    finding.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            <AlertTriangle className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium capitalize leading-none">
                                                {finding.finding_type.replace(/_/g, ' ')}
                                            </p>
                                            <p className="mt-1 truncate text-xs text-muted-foreground">
                                                {finding.url}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="hidden sm:inline-flex capitalize">
                                            {finding.severity}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                            asChild
                                        >
                                            <a href={finding.url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {(!data?.recent_security_findings || data.recent_security_findings.length === 0) && (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Shield className="mb-2 h-10 w-10 text-muted-foreground/20" />
                                    <p className="text-sm text-muted-foreground">No recent findings detected.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
