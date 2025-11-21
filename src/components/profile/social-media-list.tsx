'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/auth/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';

interface SocialMedia {
    id: number;
    platform: string;
    url: string;
}

export function SocialMediaList() {
    const [socials, setSocials] = useState<SocialMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [newSocial, setNewSocial] = useState({
        platform: '',
        url: '',
    });

    const fetchSocials = async () => {
        try {
            const response = await api.get('/users/me/social-media');
            setSocials(response.data);
        } catch (error) {
            console.error('Failed to fetch social media', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSocials();
    }, []);

    const handleAddSocial = async () => {
        setIsAdding(true);
        try {
            await api.post('/users/me/social-media', newSocial);
            await fetchSocials();
            setIsDialogOpen(false);
            setNewSocial({ platform: '', url: '' });
        } catch (error) {
            console.error('Failed to add social media', error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteSocial = async (id: number) => {
        try {
            await api.delete(`/users/me/social-media/${id}`);
            setSocials(socials.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete social media', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Social Media</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="platform">Platform</Label>
                                <Input
                                    id="platform"
                                    placeholder="e.g. Twitter, LinkedIn"
                                    value={newSocial.platform}
                                    onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="url">Profile URL</Label>
                                <Input
                                    id="url"
                                    placeholder="https://..."
                                    value={newSocial.url}
                                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddSocial} disabled={isAdding}>
                                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Account
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="text-center p-4">Loading social accounts...</div>
            ) : socials.length === 0 ? (
                <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
                    No social media accounts linked.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {socials.map((social) => (
                        <Card key={social.id} className="relative">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Share2 className="h-5 w-5 text-primary" />
                                        <div className="space-y-1">
                                            <p className="font-medium capitalize">{social.platform}</p>
                                            <a
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                                            >
                                                View Profile <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                                        onClick={() => handleDeleteSocial(social.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
