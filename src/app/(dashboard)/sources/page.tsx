'use client';

import { useEffect, useState } from 'react';
import { Database, ExternalLink, Shield, Plus, Trash2, Edit, BarChart3, Loader2, Globe, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { api } from '@/lib/auth/api';
import { motion } from 'framer-motion';

interface Source {
    id: number;
    url: string;
    domain: string;
    category: string;
    risk_level: string;
    monitoring_priority: string;
}

interface SourceStats {
    total_sources: number;
    by_category: Record<string, number>;
    by_risk: Record<string, number>;
}

export default function SourcesPage() {
    const [sources, setSources] = useState<Source[]>([]);
    const [stats, setStats] = useState<SourceStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const [newSource, setNewSource] = useState({
        url: '',
        category: 'general',
        risk_level: 'medium',
        monitoring_priority: 'standard'
    });

    const fetchData = async () => {
        try {
            const [sourcesRes, statsRes] = await Promise.all([
                api.get('/sources'),
                api.get('/sources/stats')
            ]);

            if (sourcesRes.data.sources) {
                setSources(sourcesRes.data.sources);
            } else if (Array.isArray(sourcesRes.data)) {
                setSources(sourcesRes.data);
            } else {
                setSources([]);
            }

            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to fetch sources data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddSource = async () => {
        setIsAdding(true);
        try {
            await api.post('/sources/add', newSource);
            await fetchData();
            setIsDialogOpen(false);
            setNewSource({ url: '', category: 'general', risk_level: 'medium', monitoring_priority: 'standard' });
        } catch (error) {
            console.error('Failed to add source', error);
            alert('Failed to add source. You might need admin permissions.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteSource = async (id: number) => {
        if (!confirm('Are you sure you want to delete this source?')) return;
        try {
            await api.delete(`/sources/${id}`);
            setSources(sources.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete source', error);
            alert('Failed to delete source. You might need admin permissions.');
        }
    };

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
        return <div className="flex h-[50vh] items-center justify-center text-muted-foreground">Loading sources...</div>;
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
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Monitored Sources</h1>
                    <p className="text-muted-foreground mt-2">Manage external data sources and monitoring targets.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Source
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Source</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="url">Source URL</Label>
                                <Input
                                    id="url"
                                    placeholder="https://example.onion"
                                    value={newSource.url}
                                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        value={newSource.category}
                                        onChange={(e) => setNewSource({ ...newSource, category: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="risk">Risk Level</Label>
                                    <select
                                        id="risk"
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newSource.risk_level}
                                        onChange={(e) => setNewSource({ ...newSource, risk_level: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddSource} disabled={isAdding}>
                                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Source
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {stats && (
                <div className="grid gap-6 md:grid-cols-3">
                    <motion.div variants={item}>
                        <Card className="bg-card/50 border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Database className="h-24 w-24" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Sources</CardTitle>
                                <Database className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.total_sources}</div>
                                <p className="text-xs text-muted-foreground mt-1">Active monitoring targets</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={item}>
                        <Card className="bg-card/50 border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Shield className="h-24 w-24" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
                                <Shield className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.by_risk?.['high'] || 0}</div>
                                <p className="text-xs text-muted-foreground mt-1">Sources requiring attention</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={item}>
                        <Card className="bg-card/50 border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <BarChart3 className="h-24 w-24" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
                                <BarChart3 className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{Object.keys(stats.by_category || {}).length}</div>
                                <p className="text-xs text-muted-foreground mt-1">Distinct source types</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sources.map((source) => (
                    <motion.div variants={item} key={source.id}>
                        <Card className="group hover:bg-white/5 transition-all border-white/5 bg-card/30 h-full flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                            <Globe className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-medium truncate max-w-[150px]" title={source.domain}>
                                                {source.domain || 'Unknown Domain'}
                                            </CardTitle>
                                            <CardDescription className="truncate max-w-[150px]" title={source.url}>
                                                {source.url}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={source.risk_level === 'high' ? 'destructive' : 'secondary'} className="capitalize">
                                        {source.risk_level}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between">
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                                        <span>Category</span>
                                        <span className="font-medium text-foreground capitalize">{source.category}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                                        <span>Priority</span>
                                        <span className="font-medium text-foreground capitalize">{source.monitoring_priority}</span>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-white/5">
                                    <Button variant="ghost" size="icon" className="hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSource(source.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="gap-2 border-white/10" asChild>
                                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3 w-3" />
                                            Visit
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                {sources.length === 0 && (
                    <div className="col-span-full text-center py-20 border rounded-xl border-dashed border-white/10 bg-card/10">
                        <p className="text-muted-foreground">No sources found. Add a source to start monitoring.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
