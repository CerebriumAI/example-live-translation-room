"use client"

import { useEffect, useRef } from "react"
import { useParticipant } from "@daily-co/daily-react"
import { Mic, MicOff, Pin, PinOff } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useRoomStore } from "@/lib/store"

interface TileProps {
    id: string
    isLocal?: boolean
    isAlone?: boolean
    isScreenShare?: boolean
}

export function Tile({ id, isLocal = false, isAlone = false, isScreenShare = false }: TileProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const participant = useParticipant(id)
    const { pinnedParticipantId, setPinnedParticipant } = useRoomStore()
    const isPinned = pinnedParticipantId === id

    useEffect(() => {
        if (!participant || !videoRef.current) return

        const videoTrack = isScreenShare ? participant.screenShare : participant.videoTrack
        if (videoTrack) {
            videoRef.current.srcObject = new MediaStream([videoTrack])
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
        }
    }, [participant, isScreenShare])

    if (!participant) return null

    return (
        <div
            className={cn(
                "relative rounded-lg overflow-hidden bg-muted",
                isLocal && "local-tile",
                isPinned && "ring-2 ring-primary",
                isScreenShare ? "col-span-2" : "aspect-video"
            )}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal}
                className={cn(
                    "w-full h-full object-cover",
                    isScreenShare && "object-contain bg-black"
                )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">
              {participant.user_name} {isLocal && "(You)"}
            </span>
                        {participant.audio ? (
                            <Mic className="h-4 w-4 text-white" />
                        ) : (
                            <MicOff className="h-4 w-4 text-red-500" />
                        )}
                    </div>
                    {!isLocal && !isScreenShare && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:text-white"
                            onClick={() => setPinnedParticipant(isPinned ? null : id)}
                        >
                            {isPinned ? (
                                <PinOff className="h-4 w-4" />
                            ) : (
                                <Pin className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
