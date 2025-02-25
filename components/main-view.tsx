"use client"

import { useParticipant } from "@daily-co/daily-react"
import { useRoomStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Mic, MicOff } from "lucide-react"

export function MainView({
                             participantId,
                             layout = "speaker",
                         }: {
    participantId: string | null
    layout?: "speaker" | "grid"
}) {
    const participant = useParticipant(participantId)
    const { isSharingScreen } = useRoomStore()

    if (!participant) {
        return (
            <div className="flex items-center justify-center h-full bg-muted">
                <p className="text-muted-foreground">No active participant</p>
            </div>
        )
    }

    return (
        <div className={cn("relative", layout === "speaker" ? "h-full" : "aspect-video")}>
            {participant.screenShare ? (
                <video
                    ref={(el) => {
                        if (el) el.srcObject = participant.screenShare
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                />
            ) : (
                <video
                    ref={(el) => {
                        if (el) el.srcObject = participant.videoTrack
                    }}
                    autoPlay
                    playsInline
                    className={cn("w-full h-full", layout === "speaker" ? "object-cover" : "object-contain bg-black")}
                />
            )}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                    {participant.user_name} {participant.local && "(You)"}
                </div>
                {participant.audio ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-destructive" />}
            </div>
        </div>
    )
}