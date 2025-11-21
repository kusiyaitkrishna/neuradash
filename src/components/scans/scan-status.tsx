'use client';

import { useEffect, useState } from 'react';
import { Activity, Calendar, Clock, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/auth/api';

interface ScanStatusProps {
    scanId: string;
}

export function ScanStatus({ scanId }: ScanStatusProps) {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await api.get(`/scan/status/${scanId}`);
                setStatus(response.data);
            } catch (error) {
                console.error('Failed to fetch scan status', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        // Poll every 5 seconds if running
        const interval = setInterval(() => {
            if (status?.status === 'running') {
                fetchStatus();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [scanId, status?.status]);

    if (loading) return <div>Loading status...</div>;
    if (!status) return <div>Status unavailable</div>;

    const getStatusColor = (s: string) => {
        switch (s?.toLowerCase()) {
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'running': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(status.status)}>
                            {status.status || 'Unknown'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Scan Type</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold capitalize">{status.scan_type || 'Full'}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">URLs Found</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{status.total_urls || 0}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Started At</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        {status.created_at ? new Date(status.created_at).toLocaleString() : 'N/A'}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
