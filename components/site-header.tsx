import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between">
                <Link href="https://www.cerebrium.ai" className="flex items-center gap-2">
                    <Image
                        src="/cerebrium-logo.svg?height=60&width=160"
                        alt="Cerebrium Logo"
                        width={160}
                        height={60}
                        className="rounded-lg"
                    />
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="https://github.com/your-repo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Github className="h-4 w-4" />
                        Repository
                    </Link>
                    <Link href="/tutorial" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Tutorial
                    </Link>
                    <Button asChild>
                        <Link href="https://dashboard.cerebrium.ai/register" target="_blank" rel="noopener noreferrer">
                            Sign Up
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}

