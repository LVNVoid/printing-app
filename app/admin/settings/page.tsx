import { getBanners, getStoreSettings } from './actions';
import { BannerManager } from './_components/banner-manager';
import { GeneralSettings } from './_components/general-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function SettingsAdminPage() {
    const banners = await getBanners();
    const settings = await getStoreSettings();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="banners">Banners</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                    <GeneralSettings settings={settings} />
                </TabsContent>
                <TabsContent value="banners" className="space-y-4">
                    <BannerManager banners={banners} />
                </TabsContent>
            </Tabs>
        </div>
    );
}