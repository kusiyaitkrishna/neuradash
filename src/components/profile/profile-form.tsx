'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/auth/api';
import { useAuthStore } from '@/lib/auth/auth-store';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone_number: z.string().optional(),
    bio: z.string().optional(),
    profession: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            phone_number: user?.phone_number || '', // Ensure these fields exist in User type or handle optional
            bio: user?.bio || '',
            profession: user?.profession || '',
        },
    });

    // Update form when user data loads
    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                phone_number: (user as any).phone_number || '',
                bio: (user as any).bio || '',
                profession: (user as any).profession || '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await api.put('/users/me', data);
            setUser(response.data);
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch (error: any) {
            console.error('Failed to update profile', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input id="phone_number" {...register('phone_number')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input id="profession" {...register('profession')} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" {...register('bio')} />
            </div>

            {message && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                    {message.text}
                </div>
            )}

            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
            </Button>
        </form>
    );
}
