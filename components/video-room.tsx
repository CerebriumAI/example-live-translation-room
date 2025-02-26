"use client"

import React, { useState, useCallback } from "react"
import { useParticipantIds, useDailyEvent, useLocalSessionId, useDaily } from "@daily-co/daily-react"
import { UserMediaError } from "./user-media-error"
import { Tile } from "./tile"
import { Controls } from "./controls"
import { RoomHeader } from "./room-header"
import { useRoomStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function VideoRoom({ userName, roomName }: { userName: string; roomName: string }) {
    const [getUserMediaError, setGetUserMediaError] = useState(false)
    const daily = useDaily()
    const participantIds = useParticipantIds()
    const localSessionId = useLocalSessionId()
    const { activeSpeakerId, setActiveSpeaker } = useRoomStore()

    // Handle camera/microphone errors
    useDailyEvent(
        "camera-error",
        useCallback(() => {
            setGetUserMediaError(true)
        }, []),
    )

    // Handle active speaker updates
    useDailyEvent(
        "active-speaker-change",
        useCallback(
            (event) => {
                setActiveSpeaker(event?.activeSpeaker?.peerId || null)
            },
            [setActiveSpeaker],
        ),
    )

    // Join the room when the component mounts
    React.useEffect(() => {
        if (!daily) return

        const join = async () => {
            try {
                await daily.join({ userName })
                useRoomStore.getState().setMeetingStartTime(new Date())
            } catch (err) {
                console.error("Failed to join room:", err)
                setGetUserMediaError(true)
            }
        }

        join()

        return () => {
            daily.leave()
        }
    }, [daily, userName])

    const getGridLayout = (count: number) => {
        if (count <= 1) return "grid-cols-1"
        if (count === 2) return "grid-cols-2"
        if (count <= 4) return "grid-cols-2 grid-rows-2"
        if (count <= 6) return "grid-cols-3 grid-rows-2"
        if (count <= 9) return "grid-cols-3 grid-rows-3"
        return "grid-cols-4 grid-rows-3" // Max 12 participants
    }

    const renderCallScreen = () => (
        <div className="h-screen flex flex-col overflow-hidden ">
            <RoomHeader roomName={roomName} />

            <main className="flex-1 min-h-0 p-4">
                <div className={cn("grid gap-4 h-full", getGridLayout(participantIds.length))}>
                    {participantIds.map((id) => (
                        <Tile key={id} id={id} isLocal={id === localSessionId} isActive={id === activeSpeakerId} />
                    ))}
                </div>
            </main>

            <Controls className="flex-none h-16" />
        </div>
    )

    return getUserMediaError ? <UserMediaError /> : renderCallScreen()
}