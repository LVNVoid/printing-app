import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-5 w-48 mt-1" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-[180px]" />
                </div>

                <div className="rounded-md border bg-card">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <Skeleton className="h-4 w-12" />
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <Skeleton className="h-4 w-24" />
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <Skeleton className="h-4 w-16" />
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        <Skeleton className="h-4 w-32" />
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <Skeleton className="h-16 w-16 rounded" />
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Skeleton className="h-4 w-32" />
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Skeleton className="h-4 w-24" />
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Skeleton className="h-4 w-16" />
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Skeleton className="h-4 w-48" />
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <Skeleton className="h-8 w-8 ml-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-2 py-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        </div>
    )
}
