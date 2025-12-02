'use client';

import { useState } from 'react';
import { Banner } from '@/app/generated/prisma/client';
import { createBanner, deleteBanner, toggleBannerActive } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useFormStatus } from 'react-dom';
import { Trash2, ExternalLink } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Adding...' : 'Add Banner'}
        </Button>
    );
}

export function BannerManager({ banners }: { banners: Banner[] }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Banner</CardTitle>
                    <CardDescription>Upload a new banner image to display on the home page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        await createBanner(formData);
                        setPreviewUrl(null);
                        const form = document.getElementById('banner-form') as HTMLFormElement;
                        form?.reset();
                    }} id="banner-form" className="space-y-4 max-w-xl">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required placeholder="Summer Sale" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link">Link (Optional)</Label>
                            <Input id="link" name="link" placeholder="/products/summer-sale" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPreviewUrl(URL.createObjectURL(file));
                                    } else {
                                        setPreviewUrl(null);
                                    }
                                }}
                            />
                            {previewUrl && (
                                <div className="mt-2 relative w-full h-40 border rounded-lg overflow-hidden bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="active" name="active" defaultChecked />
                            <Label htmlFor="active">Active immediately</Label>
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {banners.map((banner) => (
                    <Card key={banner.id} className={`overflow-hidden transition-opacity ${!banner.active ? 'opacity-75 bg-muted/50' : ''}`}>
                        <div className="relative w-full aspect-video bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={banner.imageUrl} alt={banner.title} className="object-cover w-full h-full" />
                            {!banner.active && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <span className="bg-background/80 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">Inactive</span>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4 space-y-3">
                            <div className="space-y-1">
                                <h3 className="font-semibold truncate" title={banner.title}>{banner.title}</h3>
                                {banner.link && (
                                    <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground flex items-center hover:underline truncate">
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        {banner.link}
                                    </a>
                                )}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={banner.active}
                                        onCheckedChange={(checked) => toggleBannerActive(banner.id, checked)}
                                    />
                                    <span className="text-xs text-muted-foreground">{banner.active ? 'Active' : 'Inactive'}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this banner?')) {
                                            deleteBanner(banner.id);
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
