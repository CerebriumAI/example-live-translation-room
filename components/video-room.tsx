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
    const { activeSpeakerId, setActiveSpeaker, setMeetingStartTime, preferences, updatePreferences } = useRoomStore()

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
                setMeetingStartTime(new Date())

                // Only start the translation service if we're the first to join
                // or if we're the host of the meeting
                const participants = await daily.participants()
                const participantCount = Object.keys(participants).length
                const isHost = daily.participants().local?.owner
                const translatorExists = Object.values(participants).some(
                    p => p.userData?.isTranslator
                )

                // Start translation service if we're the first participant or the host
                // and no translator exists yet
                if ((participantCount <= 2 || isHost) && !translatorExists) {
                    const roomUrl = daily.properties.url
                    const selectedLanguage = preferences.targetLanguage || 'es'

                    // Start the translation service
                    fetch(process.env.NEXT_PUBLIC_CEREBRIUM_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CEREBRIUM_API_KEY}`
                        },
                        body: JSON.stringify({
                            room_url: roomUrl,
                            target_language: selectedLanguage
                        }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Translation service started:', data)
                        })
                        .catch(err => {
                            console.error('Failed to start translation service:', err)
                        })
                }
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