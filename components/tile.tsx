"use client"

import { useEffect, useRef } from "react"
import {
    useActiveSpeakerId,
    useLocalSessionId,
    useMediaTrack,
    useParticipantProperty,
} from "@daily-co/daily-react"
import { Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface TileProps {
    id: string
}

export function Tile({ id}: TileProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const mediaTrack = useMediaTrack(id, 'video')
    const activeSpeakerId = useActiveSpeakerId();
    const localSessionId = useLocalSessionId()
    const userName = useParticipantProperty(id, 'user_name')
    const audio = useParticipantProperty(id, 'audio')
    const isLocal = id === localSessionId
    const isSpeaking = activeSpeakerId === id

    useEffect(() => {
        if (!mediaTrack.track|| !videoRef.current) return

        if (mediaTrack.track) {
            videoRef.current.srcObject = new MediaStream([mediaTrack.track])
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
        }
    }, [])

    if (!mediaTrack.track || !videoRef) return null

    return (
        <div
            className={cn(
                "relative w-full h-full rounded-lg overflow-hidden",
                "transition-all duration-200",
                isSpeaking && "ring-2 ring-primary ring-offset-2",
            )}
        >
            <video ref={videoRef} autoPlay playsInline muted={isLocal} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">
              {userName} {isLocal && "(You)"}
            </span>
                        {audio ? <Mic className="h-4 w-4 text-white" /> : <MicOff className="h-4 w-4 text-red-500" />}
                    </div>
                </div>
            </div>
        </div>
    )
}

