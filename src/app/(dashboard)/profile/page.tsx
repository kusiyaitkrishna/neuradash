'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock, MapPin, Share2 } from 'lucide-react';

import { ProfileForm } from '@/components/profile/profile-form';
import { ImageUpload } from '@/components/profile/image-upload';
import { PasswordChange } from '@/components/profile/password-change';
import { AddressList } from '@/components/profile/address-list';
import { SocialMediaList } from '@/components/profile/social-media-list';

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general" className="gap-2">
                        <User className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Lock className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="gap-2">
                        <MapPin className="h-4 w-4" />
                        Addresses
                    </TabsTrigger>
                    <TabsTrigger value="socials" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Social Media
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details and bio.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProfileForm />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                                <CardDescription>Upload a new profile picture.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageUpload />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Ensure your account is secure by using a strong password.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PasswordChange />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="addresses">
                    <Card>
                        <CardHeader>
                            <CardTitle>Address Management</CardTitle>
                            <CardDescription>Manage your physical addresses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddressList />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="socials">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Media Accounts</CardTitle>
                            <CardDescription>Link your social media profiles.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SocialMediaList />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
