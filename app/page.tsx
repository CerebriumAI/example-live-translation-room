import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            <div className="relative">
                <div className="absolute inset-x-0 top-0 h-[600px] bg-primary">
                    <div className="absolute inset-0 bg-grid-white/10" />
                </div>

                <div className="relative">
                    <div className="container mx-auto px-6 pt-32 pb-48 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl">Live Translation</h1>
                        <p className="mt-6 text-lg leading-8 text-primary-foreground/90 max-w-xl mx-auto">
                            Experience real-time video conversations across languages. Our AI-powered app translates speech
                            instantly, making global communication seamless and natural.
                        </p>
                        <div className="mt-10">
                            <Link href="/demo">
                                <Button size="lg" variant="secondary" className="gap-2 rounded-full px-8">
                                    Start Meeting
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="container mx-auto grid max-w-xl grid-cols-1 gap-8 lg:max-w-6xl">
                        <div className="w-full relative -mt-8 px-16 py-12 bg-background rounded-3xl shadow-xl">
                            <div className="w-full flex items-center justify-center gap-x-8">
                                <Image
                                    src="/cerebrium-logo.svg?height=24&width=120"
                                    alt="Daily.co"
                                    width={200}
                                    height={70}
                                    className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
                                />
                                <Image
                                    src="/daily-logo.png?height=24&width=120"
                                    alt="Cerebrium"
                                    width={80}
                                    height={27}
                                    className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"
                                />
                            </div>
                            <div className="mt-8 flex justify-center">
                                <p className="text-sm text-muted-foreground">Powered by industry-leading technologies</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-6xl px-6 py-24">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Project Overview</h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Transform your international meetings with our advanced live translation platform. Break down language
                        barriers and communicate effortlessly with participants from around the world.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-8 lg:max-w-6xl lg:grid-cols-3">
                    <div>
                        <h3 className="font-semibold">Real-Time Translation</h3>
                        <p className="mt-4 text-muted-foreground">
                            Powered by advanced AI models, our system detects speech and provides instant translations, ensuring
                            natural and fluid conversations across different languages.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold">High-Quality Video Calls</h3>
                        <p className="mt-4 text-muted-foreground">
                            Built on Daily.co's robust video infrastructure, enjoy crystal-clear video and audio quality while our
                            translation layer works seamlessly in the background.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Easy to Use</h3>
                        <p className="mt-4 text-muted-foreground">
                            No downloads required. Simply create or join a room, select your language preferences, and start
                            communicating naturally in your preferred language.
                        </p>
                    </div>
                </div>
            </div>

            <footer className="bg-black text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center justify-center gap-8">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/placeholder.svg?height=32&width=32"
                                alt="Cerebrium Logo"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-semibold">Cerebrium</span>
                        </div>
                        <p className="text-center text-sm text-gray-400">
                            Powered by Cerebrium's AI infrastructure. Deploy and scale AI apps with ease.
                        </p>
                        <div className="flex items-center gap-6">
                            <a
                                href="https://www.cerebrium.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Website
                            </a>
                            <a
                                href="https://docs.cerebrium.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Documentation
                            </a>
                            <a
                                href="https://discord.com/invite/ATj6USmeE2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Join our Discord
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}