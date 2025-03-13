"use client"

import {useParticipantProperty} from "@daily-co/daily-react"
import { cn } from "@/lib/utils"
import { Mic, MicOff } from "lucide-react"

export function MainView({
                             participantId,
                             layout = "speaker",
                         }: {
    participantId: string | null
    layout?: "speaker" | "grid"
}) {
    const videoTrack = useParticipantProperty(participantId || '', 'videoTrack')
    const userName = useParticipantProperty(participantId || '', 'user_name')
    const local = useParticipantProperty(participantId || '', 'local')
    const audio = useParticipantProperty(participantId || '', 'audio')

    console.log(userName, local, audio)

    if (!userName) {
        return (
            <div className="flex items-center justify-center h-full bg-muted">
                <p className="text-muted-foreground">No active participant</p>
            </div>
        )
    }

    return (
        <div className={cn("relative", layout === "speaker" ? "h-full" : "aspect-video")}>
            <video
                ref={(el) => {
                    if (el) el.srcObject = videoTrack as any
                }}
                autoPlay
                playsInline
                className={cn("w-full h-full", layout === "speaker" ? "object-cover" : "object-contain bg-black")}
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                    {userName} {local && "(You)"}
                </div>
                {audio ? <Mic className="h-5 w-5 text-white"/> :
                    <MicOff className="h-5 w-5 text-destructive"/>}
            </div>
        </div>
    )
}