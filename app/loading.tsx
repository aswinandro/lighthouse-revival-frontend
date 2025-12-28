import { Loader } from "@/components/ui/loader"

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
            <Loader size={200} />
            <div className="mt-8 space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-primary animate-pulse">
                    Lighthouse Revival
                </h2>
                <p className="text-sm text-muted-foreground animate-pulse delay-75">
                    Voices of Many Nations
                </p>
            </div>

            {/* Premium accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
    )
}
