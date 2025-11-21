'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ExternalLink, Filter, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/auth/api';
import { motion } from 'framer-motion';

interface ThreatReport {
    total_threats: number;
    by_severity: Record<string, number>;
    by_type: Record<string, number>;
    recent_findings: any[];
}

export default function ThreatsPage() {
    const [report, setReport] = useState<ThreatReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await api.get('/threats/report');
                setReport(response.data);
            } catch (error) {
                console.error('Failed to fetch threat report', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center text-muted-foreground">Loading threat report...</div>;
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Threat Intelligence</h1>
                    <p className="text-muted-foreground mt-2">Monitor and mitigate security threats across your digital footprint.</p>
                </div>
                <Button variant="outline" className="gap-2 border-white/5 bg-card/50">
                    <Filter className="h-4 w-4" />
                    Filter View
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <motion.div variants={item}>
                    <Card className="bg-destructive/5 border-destructive/20 overflow-hidden relative">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-destructive/10 blur-2xl" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4" />
                                Total Threats
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-destructive">{report?.total_threats || 0}</div>
                            <p className="text-xs text-destructive/80 mt-1">Detected across all sources</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="bg-orange-500/5 border-orange-500/20 overflow-hidden relative">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-500 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                High Severity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-orange-500">{report?.by_severity?.['high'] || 0}</div>
                            <p className="text-xs text-orange-500/80 mt-1">Critical issues requiring attention</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="bg-blue-500/5 border-blue-500/20 overflow-hidden relative">
                        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-500 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Medium Severity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-blue-500">{report?.by_severity?.['medium'] || 0}</div>
                            <p className="text-xs text-blue-500/80 mt-1">Potential risks found</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Recent Findings
                </h2>
                <div className="grid gap-4">
                    {report?.recent_findings?.map((finding) => (
                        <motion.div variants={item} key={finding.id}>
                            <Card className="hover:bg-white/5 transition-colors border-white/5 bg-card/30">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex gap-4">
                                            <div className="mt-1">
                                                {finding.severity === 'high' ? (
                                                    <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
                                                        <ShieldAlert className="h-6 w-6" />
                                                    </div>
                                                ) : (
                                                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
                                                        <AlertTriangle className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-lg">{finding.finding_type}</h3>
                                                    <Badge variant={finding.severity === 'high' ? 'destructive' : 'secondary'} className="capitalize">
                                                        {finding.severity}
                                                    </Badge>
                                                    {finding.verified && (
                                                        <Badge variant="outline" className="border-green-500 text-green-500 gap-1">
                                                            <CheckCircle className="h-3 w-3" /> Verified
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground mb-3 leading-relaxed">{finding.description}</p>
                                                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                        Confidence: <span className="text-foreground font-medium">{(finding.confidence_score * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                        Source: <span className="text-foreground font-medium">{finding.url}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                        Detected: <span className="text-foreground font-medium">{new Date(finding.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                            <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
                                                <a href={finding.url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4" />
                                                    Visit Source
                                                </a>
                                            </Button>
                                            <div className="flex gap-2 w-full">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-green-500 hover:text-green-600 hover:bg-green-500/10 border-green-500/20"
                                                    onClick={async () => {
                                                        try {
                                                            await api.post(`/threats/findings/${finding.id}/verify`);
                                                            const response = await api.get('/threats/report');
                                                            setReport(response.data);
                                                        } catch (e) { console.error(e); }
                                                    }}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-white/10"
                                                    onClick={async () => {
                                                        try {
                                                            await api.post(`/threats/findings/${finding.id}/false-positive`);
                                                            const response = await api.get('/threats/report');
                                                            setReport(response.data);
                                                        } catch (e) { console.error(e); }
                                                    }}
                                                >
                                                    Ignore
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                    {(!report?.recent_findings || report.recent_findings.length === 0) && (
                        <div className="text-center py-20 border rounded-xl border-dashed border-white/10 bg-card/10">
                            <p className="text-muted-foreground">No recent findings.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
