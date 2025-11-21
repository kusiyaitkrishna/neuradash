'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Trash2, Clock, AlertCircle, CheckCircle2, Search, Filter, Zap, Shield, Microscope, Layers, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { api } from '@/lib/auth/api';
import { motion } from 'framer-motion';

interface Scan {
    scan_uuid: string;
    status: string;
    scan_type: string;
    created_at: string;
    identity_id?: number; // Assuming backend returns this
}

interface Identity {
    id: number;
    name: string;
    email: string;
}

export default function ScansPage() {
    const router = useRouter();
    const [scans, setScans] = useState<Scan[]>([]);
    const [identities, setIdentities] = useState<Identity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [scanType, setScanType] = useState('quick');
    const [selectedIdentity, setSelectedIdentity] = useState<string>('');

    const fetchScans = async () => {
        try {
            const response = await api.get('/scan/list/scans');
            if (response.data.scans) {
                setScans(response.data.scans);
            } else if (Array.isArray(response.data)) {
                setScans(response.data);
            } else {
                setScans([]);
            }
        } catch (error) {
            console.error('Failed to fetch scans', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchIdentities = async () => {
        try {
            const response = await api.get('/monitoring/identities');
            if (Array.isArray(response.data)) {
                setIdentities(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch identities', error);
        }
    };

    useEffect(() => {
        fetchScans();
        fetchIdentities();
    }, []);

    const handleStartScan = async () => {
        if (!selectedIdentity) {
            alert('Please select an identity to scan.');
            return;
        }
        try {
            await api.post('/scan/start', {
                scan_type: scanType,
                identity_id: parseInt(selectedIdentity)
            });
            setIsDialogOpen(false);
            fetchScans();
            setSelectedIdentity('');
        } catch (error) {
            console.error('Failed to start scan', error);
            alert('Failed to start scan. Please try again.');
        }
    };

    const getStatusColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'running': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case 'completed': return <CheckCircle2 className="h-3 w-3 mr-1" />;
            case 'failed': return <AlertCircle className="h-3 w-3 mr-1" />;
            case 'running': return <Clock className="h-3 w-3 mr-1 animate-spin" />;
            default: return <Clock className="h-3 w-3 mr-1" />;
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    const scanTypes = [
        {
            id: 'quick',
            title: 'Quick Scan',
            description: 'Fast surface-level check for immediate threats.',
            icon: Zap,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20'
        },
        {
            id: 'standard',
            title: 'Standard Scan',
            description: 'Balanced analysis of common vulnerabilities.',
            icon: Shield,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            id: 'detailed',
            title: 'Detailed Scan',
            description: 'In-depth examination of all assets.',
            icon: Microscope,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            id: 'comprehensive',
            title: 'Comprehensive',
            description: 'Full-spectrum analysis including deep web sources.',
            icon: Layers,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        }
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Scan Management</h1>
                    <p className="text-muted-foreground mt-2">Manage and monitor your security scans.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-lg shadow-primary/20">
                            <Play className="mr-2 h-4 w-4" />
                            Start New Scan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Start Security Scan</DialogTitle>
                            <DialogDescription>
                                Select a target identity and choose the scan intensity.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="identity">Target Identity</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <select
                                        id="identity"
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={selectedIdentity}
                                        onChange={(e) => setSelectedIdentity(e.target.value)}
                                    >
                                        <option value="" disabled>Select an identity to scan...</option>
                                        {identities.map((identity) => (
                                            <option key={identity.id} value={identity.id}>
                                                {identity.name} ({identity.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {identities.length === 0 && (
                                    <p className="text-xs text-destructive">No identities found. Please add an identity first.</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Scan Type</Label>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {scanTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            className={`cursor-pointer rounded-xl border-2 p-4 hover:bg-accent transition-all relative overflow-hidden ${scanType === type.id ? `border-primary bg-primary/5` : 'border-muted/20 bg-card/50'}`}
                                            onClick={() => setScanType(type.id)}
                                        >
                                            <div className={`absolute top-0 right-0 p-3 opacity-10 ${type.color}`}>
                                                <type.icon className="h-16 w-16" />
                                            </div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-lg ${type.bg} ${type.color}`}>
                                                    <type.icon className="h-5 w-5" />
                                                </div>
                                                <div className="font-semibold">{type.title}</div>
                                            </div>
                                            <div className="text-sm text-muted-foreground relative z-10">{type.description}</div>
                                            {scanType === type.id && (
                                                <div className="absolute top-2 right-2 text-primary">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleStartScan} className="w-full md:w-auto" disabled={!selectedIdentity}>
                                <Play className="mr-2 h-4 w-4" /> Start {scanTypes.find(t => t.id === scanType)?.title}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search scans..." className="pl-10 bg-card/50 border-white/5" />
                </div>
                <Button variant="outline" className="gap-2 border-white/5 bg-card/50">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
            </div>

            {loading ? (
                <div className="text-center p-20 text-muted-foreground">Loading scans...</div>
            ) : (
                <div className="grid gap-4">
                    {scans.map((scan) => (
                        <motion.div variants={item} key={scan.scan_uuid}>
                            <div
                                className="group flex items-center justify-between p-4 rounded-xl bg-card/30 border border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                                onClick={() => router.push(`/scans/${scan.scan_uuid}`)}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Search className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">Scan {scan.scan_uuid?.substring(0, 8) || 'Unknown'}</h3>
                                            <Badge variant="outline" className={getStatusColor(scan.status)}>
                                                {getStatusIcon(scan.status)}
                                                {scan.status || 'Unknown'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                            <span className="capitalize flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                {scan.scan_type || 'Standard'} Scan
                                            </span>
                                            <span>•</span>
                                            <span>{scan.created_at ? new Date(scan.created_at).toLocaleString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm">View Details</Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {scans.length === 0 && (
                        <div className="text-center py-20 border rounded-xl border-dashed border-white/10 bg-card/10">
                            <p className="text-muted-foreground">No scans found. Start a new scan to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
