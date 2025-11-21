'use client';

import { useState, useRef } from 'react';
import { Loader2, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/auth/api';
import { useAuthStore } from '@/lib/auth/auth-store';
import { cn } from '@/lib/utils';

export function ImageUpload() {
    const user = useAuthStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(user?.image_url || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            await api.post('/users/me/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh user data to get new image URL if needed, or just rely on preview
            // Ideally, we should fetch user again or update store manually if API returns URL
        } catch (error) {
            console.error('Failed to upload image', error);
            // Revert preview on error
            setPreview(user?.image_url || null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-muted bg-muted">
                {preview ? (
                    <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <User className="h-16 w-16" />
                    </div>
                )}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Picture
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            <p className="text-xs text-muted-foreground">
                JPG, GIF or PNG. Max size of 2MB.
            </p>
        </div>
    );
}
