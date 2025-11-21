'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, MapPin } from 'lucide-react';
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

interface Address {
    id: number;
    street: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
}

export function AddressList() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
    });

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/users/me/addresses');
            setAddresses(response.data);
        } catch (error) {
            console.error('Failed to fetch addresses', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAddAddress = async () => {
        setIsAdding(true);
        try {
            await api.post('/users/me/addresses', newAddress);
            await fetchAddresses();
            setIsDialogOpen(false);
            setNewAddress({ street: '', city: '', state: '', country: '', zip_code: '' });
        } catch (error) {
            console.error('Failed to add address', error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteAddress = async (id: number) => {
        try {
            await api.delete(`/users/me/addresses/${id}`);
            setAddresses(addresses.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to delete address', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="street">Street</Label>
                                <Input
                                    id="street"
                                    value={newAddress.street}
                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={newAddress.country}
                                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="zip_code">Zip Code</Label>
                                    <Input
                                        id="zip_code"
                                        value={newAddress.zip_code}
                                        onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddAddress} disabled={isAdding}>
                                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Address
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="text-center p-4">Loading addresses...</div>
            ) : addresses.length === 0 ? (
                <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground">
                    No addresses added yet.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                        <Card key={address.id} className="relative">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="font-medium">{address.street}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {address.city}, {address.state} {address.zip_code}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{address.country}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                                        onClick={() => handleDeleteAddress(address.id)}
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
