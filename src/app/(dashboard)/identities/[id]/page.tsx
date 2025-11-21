'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/auth/api';

export default function IdentityThreatsPage() {
    const params = useParams();
    const router = useRouter();
    const identityId = params.id as string;
    const [threats, setThreats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThreats = async () => {
            try {
                const response = await api.get(`/threats/identity/${identityId}`);
                // Assuming response is a list
                if (Array.isArray(response.data)) {
                    setThreats(response.data);
                } else if (response.data.threats) {
                    setThreats(response.data.threats);
                } else {
                    setThreats([]);
                }
            } catch (error) {
                console.error('Failed to fetch identity threats', error);
            } finally {
                setLoading(false);
            }
        };

        if (identityId) {
            fetchThreats();
        }
    }, [identityId]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Identity Threats</h1>
            </div>

            {loading ? (
                <div className="text-center p-10">Loading threats...</div>
            ) : threats.length === 0 ? (
                <div className="text-center p-10 border rounded-lg border-dashed text-muted-foreground">
                    No threats found for this identity.
                </div>
            ) : (
                <div className="space-y-4">
                    {threats.map((threat, index) => (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            {threat.severity === 'high' ? (
                                                <ShieldAlert className="h-5 w-5 text-destructive" />
                                            ) : (
                                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold">{threat.type || 'Unknown Threat'}</h3>
                                                <Badge variant={threat.severity === 'high' ? 'destructive' : 'secondary'}>
                                                    {threat.severity || 'Medium'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{threat.description}</p>
                                            {threat.url && (
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        Source: <a href={threat.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{threat.url} <ExternalLink className="h-3 w-3 inline" /></a>
                                                    </span>
                                                    <span>{threat.created_at ? new Date(threat.created_at).toLocaleDateString() : ''}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
