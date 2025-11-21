'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Activity, Shield, TrendingUp, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/auth/api';
import { motion } from 'framer-motion';

interface AnalyticsSummary {
    scans: {
        total: number;
        by_status: Record<string, number>;
        by_type: Record<string, number>;
        average_duration_seconds: number;
    };
    crawls: {
        total: number;
        successful: number;
        failed: number;
        success_rate_percent: number;
    };
    threats: {
        total: number;
        by_severity: Record<string, number>;
        by_type: Record<string, number>;
    };
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/scan/analytics/summary');
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight gradient-text">
                    Analytics Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                    Comprehensive insights into your security scanning operations.
                </p>
            </div>

            {/* Scan Analytics */}
            <motion.div variants={item}>
                <Card className="border-white/[0.08] bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Scan Performance
                        </CardTitle>
                        <CardDescription>Overview of all security scans and their performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Total Scans */}
                            <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-blue-500/10 to-transparent p-6">
                                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl" />
                                <div className="relative space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <BarChart3 className="h-4 w-4 text-blue-500" />
                                        <span>Total Scans</span>
                                    </div>
                                    <div className="text-3xl font-bold">{data?.scans.total || 0}</div>
                                </div>
                            </div>

                            {/* Average Duration */}
                            <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-purple-500/10 to-transparent p-6">
                                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-purple-500/10 blur-2xl" />
                                <div className="relative space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4 text-purple-500" />
                                        <span>Avg Duration</span>
                                    </div>
                                    <div className="text-3xl font-bold">{data?.scans.average_duration_seconds.toFixed(1) || 0}s</div>
                                </div>
                            </div>

                            {/* Completed Scans */}
                            <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-green-500/10 to-transparent p-6">
                                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-green-500/10 blur-2xl" />
                                <div className="relative space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Completed</span>
                                    </div>
                                    <div className="text-3xl font-bold text-green-500">{data?.scans.by_status.completed || 0}</div>
                                </div>
                            </div>

                            {/*Failed Scans */}
                            <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-red-500/10 to-transparent p-6">
                                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-red-500/10 blur-2xl" />
                                <div className="relative space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span>Failed</span>
                                    </div>
                                    <div className="text-3xl font-bold text-red-500">{data?.scans.by_status.failed || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* Scan Types Breakdown */}
                        <div className="mt-6 space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Scans by Type</h3>
                            <div className="grid gap-3 md:grid-cols-3">
                                {Object.entries(data?.scans.by_type || {}).map(([type, count]) => (
                                    <div key={type} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/[0.06]">
                                        <span className="text-sm font-medium capitalize">{type}</span>
                                        <Badge variant="outline" className="font-mono">{count}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Crawl Analytics */}
            <motion.div variants={item}>
                <Card className="border-white/[0.08] bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Crawl Statistics
                        </CardTitle>
                        <CardDescription>Detailed metrics on URL crawling performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Total URLs */}
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Total URLs Crawled</div>
                                <div className="text-3xl font-bold">{data?.crawls.total || 0}</div>
                            </div>

                            {/* Successful */}
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Successful</div>
                                <div className="text-3xl font-bold text-green-500">{data?.crawls.successful || 0}</div>
                            </div>

                            {/* Failed */}
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Failed</div>
                                <div className="text-3xl font-bold text-destructive">{data?.crawls.failed || 0}</div>
                            </div>

                            {/* Success Rate */}
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Success Rate</div>
                                <div className="text-3xl font-bold text-primary">{data?.crawls.success_rate_percent.toFixed(1) || 0}%</div>
                            </div>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Overall Performance</span>
                                <span className="font-medium">{data?.crawls.success_rate_percent.toFixed(1)}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-1000"
                                    style={{ width: `${data?.crawls.success_rate_percent || 0}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{data?.crawls.successful} successful</span>
                                <span>{data?.crawls.failed} failed</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Threat Analytics */}
            <motion.div variants={item}>
                <Card className="border-white/[0.08] bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Shield className="h-5 w-5 text-destructive" />
                            Threat Intelligence
                        </CardTitle>
                        <CardDescription>Security threats identified across all scans</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Overall Stats */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-br from-destructive/10 to-transparent border border-destructive/20">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Total Threats</div>
                                        <div className="text-4xl font-bold text-destructive">{data?.threats.total || 0}</div>
                                    </div>
                                    <AlertTriangle className="h-12 w-12 text-destructive opacity-50" />
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-muted-foreground">By Severity</h4>
                                    {Object.entries(data?.threats.by_severity || {}).map(([severity, count]) => {
                                        const config = {
                                            high: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                                            medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
                                            low: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                                            critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
                                        }[severity.toLowerCase()] || { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };

                                        return (
                                            <div key={severity} className={`flex items-center justify-between p-4 rounded-xl ${config.bg} border ${config.border}`}>
                                                <span className={`text-sm font-medium capitalize ${config.color}`}>{severity}</span>
                                                <Badge variant="outline" className={`${config.color} ${config.border} font-mono`}>{count}</Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* By Type */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground">By Type</h4>
                                <div className="space-y-3">
                                    {Object.entries(data?.threats.by_type || {}).map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                                            <span className="text-sm font-medium capitalize">{type.replace(/_/g, ' ')}</span>
                                            <Badge variant="destructive" className="font-mono">{count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
