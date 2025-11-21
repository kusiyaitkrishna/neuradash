'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, Clock, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/auth/api';
import { motion } from 'framer-motion';

interface CrawlResult {
    id: number;
    uuid: string;
    url: string;
    domain: string;
    status_code: number | null;
    success: boolean;
    error_message: string | null;
    response_time: number;
    response_size: number | null;
    content_hash: string | null;
    crawled_at: string;
    created_at: string;
}

interface CrawlResultsData {
    scan_uuid: string;
    total: number;
    skip: number;
    limit: number;
    success_only: boolean;
    crawl_results: CrawlResult[];
}

export function CrawlResults({ scanId }: { scanId: string }) {
    const [data, setData] = useState<CrawlResultsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [successOnly, setSuccessOnly] = useState(false);

    useEffect(() => {
        const fetchCrawlResults = async () => {
            try {
                const response = await api.get(`/scan/crawl-results/${scanId}`, {
                    params: { skip: 0, limit: 50, success_only: successOnly }
                });
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch crawl results', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCrawlResults();
    }, [scanId, successOnly]);

    if (loading) {
        return (
            <Card className="border-white/[0.08] bg-card/50">
                <CardContent className="p-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading crawl results...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const successCount = data?.crawl_results.filter(r => r.success).length || 0;
    const failureCount = (data?.total || 0) - successCount;
    const successRate = data?.total ? ((successCount / data.total) * 100).toFixed(1) : 0;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.02 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <Card className="border-white/[0.08] bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Crawl Results
                        </CardTitle>
                        <CardDescription className="mt-1">
                            {data?.total} URLs discovered • {successRate}% success rate
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={successOnly ? "outline" : "default"}
                            size="sm"
                            onClick={() => setSuccessOnly(!successOnly)}
                            className="gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            {successOnly ? 'Show All' : 'Success Only'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl border border-white/[0.08] bg-background/30">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{successCount}</div>
                        <div className="text-xs text-muted-foreground mt-1">Successful</div>
                    </div>
                    <div className="text-center border-x border-white/[0.08]">
                        <div className="text-2xl font-bold text-destructive">{failureCount}</div>
                        <div className="text-xs text-muted-foreground mt-1">Failed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{data?.total}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total URLs</div>
                    </div>
                </div>

                {/* Results List */}
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {data?.crawl_results.map((result) => (
                        <motion.div
                            key={result.uuid}
                            variants={item}
                            className="group flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-background/50 hover:bg-white/[0.02] hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Status Icon */}
                                <div className={`flex-shrink-0 p-2 rounded-lg ${result.success
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-destructive/10 text-destructive'
                                    }`}>
                                    {result.success ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4" />
                                    )}
                                </div>

                                {/* URL Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm truncate">{result.domain}</span>
                                        {result.status_code && (
                                            <Badge variant="outline" className={`text-xs font-mono ${result.status_code >= 200 && result.status_code < 300
                                                    ? 'border-green-500/30 text-green-500'
                                                    : result.status_code >= 400
                                                        ? 'border-destructive/30 text-destructive'
                                                        : 'border-yellow-500/30 text-yellow-500'
                                                }`}>
                                                {result.status_code}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">{result.url}</div>
                                </div>

                                {/* Metrics */}
                                <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{result.response_time.toFixed(2)}s</span>
                                    </div>
                                    <div>
                                        {new Date(result.crawled_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>

                            {/* External Link Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                                asChild
                            >
                                <a href={result.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>

                {(!data?.crawl_results || data.crawl_results.length === 0) && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No crawl results found</p>
                    </div>
                )}
            </CardContent>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
        </Card>
    );
}
