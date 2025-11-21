'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, ExternalLink, TrendingDown, Filter as FilterIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/auth/api';
import { motion } from 'framer-motion';

interface Threat {
    id: number;
    uuid: string;
    url: string;
    finding_type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    matched_pattern: string;
    confidence_score: number;
    verified: boolean;
    false_positive: boolean;
    created_at: string;
}

interface ThreatsData {
    scan_uuid: string;
    total: number;
    skip: number;
    limit: number;
    severity_filter: string | null;
    threats: Threat[];
}

export function ScanThreats({ scanId }: { scanId: string }) {
    const [data, setData] = useState<ThreatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThreats = async () => {
            try {
                const response = await api.get(`/scan/threats/${scanId}`, {
                    params: { skip: 0, limit: 50 }
                });
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch threats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchThreats();
    }, [scanId]);

    if (loading) {
        return (
            <Card className="border-white/[0.08] bg-card/50">
                <CardContent className="p-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <p className="text-sm text-muted-foreground">Analyzing threats...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'critical':
                return {
                    bg: 'bg-red-500/10',
                    text: 'text-red-500',
                    border: 'border-red-500/20',
                    icon: ShieldAlert
                };
            case 'high':
                return {
                    bg: 'bg-orange-500/10',
                    text: 'text-orange-500',
                    border: 'border-orange-500/20',
                    icon: AlertTriangle
                };
            case 'medium':
                return {
                    bg: 'bg-yellow-500/10',
                    text: 'text-yellow-500',
                    border: 'border-yellow-500/20',
                    icon: TrendingDown
                };
            default:
                return {
                    bg: 'bg-blue-500/10',
                    text: 'text-blue-500',
                    border: 'border-blue-500/20',
                    icon: FilterIcon
                };
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <Card className="border-white/[0.08] bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-destructive" />
                            Security Threats
                        </CardTitle>
                        <CardDescription className="mt-1">
                            {data?.total} {data?.total === 1 ? 'threat' : 'threats'} detected during this scan
                        </CardDescription>
                    </div>
                    {data && data.total > 0 && (
                        <Badge variant="destructive" className="text-base px-4 py-1.5">
                            {data.total}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {data && data.threats.length > 0 ? (
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                        {data.threats.map((threat) => {
                            const config = getSeverityConfig(threat.severity);
                            const Icon = config.icon;

                            return (
                                <motion.div
                                    key={threat.uuid}
                                    variants={item}
                                    className={`group relative overflow-hidden rounded-xl border ${config.border} bg-gradient-to-br from-${threat.severity === 'critical' ? 'red' : threat.severity === 'high' ? 'orange' : threat.severity === 'medium' ? 'yellow' : 'blue'}-500/5 to-transparent p-6 hover:shadow-lg transition-all`}
                                >
                                    {/* Background Gradient Effect */}
                                    <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${config.bg} blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`} />

                                    <div className="relative flex gap-4">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 p-3 rounded-xl ${config.bg} ${config.text}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 space-y-3">
                                            {/* Header */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-lg mb-1 capitalize">
                                                        {threat.finding_type.replace(/_/g, ' ')}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {threat.description}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`${config.text} ${config.border} capitalize font-medium`}
                                                >
                                                    {threat.severity}
                                                </Badge>
                                            </div>

                                            {/* Matched Pattern */}
                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-white/[0.06]">
                                                <span className="text-xs text-muted-foreground">Pattern:</span>
                                                <code className="text-xs font-mono text-foreground bg-white/5 px-2 py-0.5 rounded">
                                                    {threat.matched_pattern}
                                                </code>
                                            </div>

                                            {/* Metadata */}
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    <span>Confidence: <span className="text-foreground font-medium">{(threat.confidence_score * 100).toFixed(0)}%</span></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    <span>Detected: <span className="text-foreground font-medium">{new Date(threat.created_at).toLocaleString()}</span></span>
                                                </div>
                                                {threat.verified && (
                                                    <Badge variant="outline" className="border-green-500/30 text-green-500 text-xs">
                                                        Verified
                                                    </Badge>
                                                )}
                                                {threat.false_positive && (
                                                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 text-xs">
                                                        False Positive
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* URL */}
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-white/[0.06]">
                                                <span className="text-sm text-muted-foreground truncate flex-1 mr-2">
                                                    {threat.url}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-shrink-0 h-8 w-8 p-0"
                                                    asChild
                                                >
                                                    <a href={threat.url} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
                            <ShieldAlert className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Threats Detected</h3>
                        <p className="text-sm text-muted-foreground">
                            This scan completed successfully with no security threats found.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
