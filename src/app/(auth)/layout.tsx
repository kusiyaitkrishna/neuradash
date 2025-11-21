export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">Neuraguard</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Advanced Digital Protection Dashboard
                    </p>
                </div>
                {children}
            </div>
        </div>
    )
}
