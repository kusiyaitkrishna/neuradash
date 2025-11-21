'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { api } from '@/lib/auth/api';

interface Identity {
    id: number;
    uuid: string;
    email: string;
    name: string;
    username?: string;
    phone?: string;
    is_active: boolean;
    created_at: string;
}

const identitySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    username: z.string().optional(),
    phone: z.string().optional(),
});

type IdentityFormValues = z.infer<typeof identitySchema>;

export default function IdentitiesPage() {
    const [identities, setIdentities] = useState<Identity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IdentityFormValues>({
        resolver: zodResolver(identitySchema),
    });

    const fetchIdentities = async () => {
        try {
            const response = await api.get('/monitoring/identities');
            setIdentities(response.data);
        } catch (error) {
            console.error('Failed to fetch identities', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdentities();
    }, []);

    const onSubmit = async (data: IdentityFormValues) => {
        setIsSubmitting(true);
        try {
            await api.post('/monitoring/identities', data);
            await fetchIdentities();
            setIsDialogOpen(false);
            reset();
        } catch (error) {
            console.error('Failed to add identity', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteIdentity = async (id: number) => {
        if (!confirm('Are you sure you want to delete this identity?')) return;
        try {
            await api.delete(`/monitoring/identities/${id}`);
            setIdentities(identities.filter((i) => i.id !== id));
        } catch (error) {
            console.error('Failed to delete identity', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Monitored Identities</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Identity
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Identity</DialogTitle>
                            <DialogDescription>
                                Add a new identity to monitor for potential threats.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" {...register('name')} />
                                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register('email')} />
                                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username (Optional)</Label>
                                <Input id="username" {...register('username')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone (Optional)</Label>
                                <Input id="phone" {...register('phone')} />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Identity
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="text-center p-10">Loading identities...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {identities.map((identity) => (
                        <Card key={identity.id}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div>
                                    <CardTitle className="text-lg font-medium">{identity.name}</CardTitle>
                                    <CardDescription>{identity.email}</CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => deleteIdentity(identity.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                    {identity.username && <p>Username: {identity.username}</p>}
                                    {identity.phone && <p>Phone: {identity.phone}</p>}
                                    <p>Status: {identity.is_active ? 'Active' : 'Inactive'}</p>
                                    <p>Added: {new Date(identity.created_at).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {identities.length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground p-10 border rounded-lg border-dashed">
                            No identities found. Add one to start monitoring.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
