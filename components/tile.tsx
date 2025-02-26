"use client"

import { useEffect, useRef } from "react"
import { useParticipant } from "@daily-co/daily-react"
import { Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface TileProps {
    id: string
    isLocal?: boolean
    isActive?: boolean
}

export function Tile({ id, isLocal = false, isActive = false }: TileProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const participant = useParticipant(id)

    useEffect(() => {
        if (!participant || !videoRef.current) return

        if (participant.videoTrack) {
            videoRef.current.srcObject = new MediaStream([participant.videoTrack])
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
        }
    }, [participant])

    if (!participant) return null

    return (
        <div
            className={cn(
                "relative w-full h-full rounded-lg overflow-hidden",
                "transition-all duration-200",
                isActive && "ring-2 ring-primary",
                participant.isSpeaking && "ring-2 ring-blue-500 ring-offset-2",
            )}
        >
            <video ref={videoRef} autoPlay playsInline muted={isLocal} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">
              {participant.user_name} {isLocal && "(You)"}
            </span>
                        {participant.audio ? <Mic className="h-4 w-4 text-white" /> : <MicOff className="h-4 w-4 text-red-500" />}
                    </div>
                </div>
            </div>
        </div>
    )
}

