"use client"

import { useParticipant } from "@daily-co/daily-react"
import { cn } from "@/lib/utils"

function ParticipantTile({ id, isLocal, isActive }: { id: string; isLocal?: boolean; isActive?: boolean }) {
    const participant = useParticipant(id)

    if (!participant) return null

    return (
        <div className={cn("relative w-32 aspect-video rounded-lg overflow-hidden", isActive && "ring-2 ring-primary")}>
            <video
                ref={(el) => {
                    if (el) {
                        el.srcObject = participant.videoTrack
                    }
                }}
                autoPlay
                muted={isLocal}
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs">
                {participant.user_name} {isLocal && "(You)"}
            </div>
        </div>
    )
}

export function ParticipantsList({
                                     participantIds,
                                     localParticipantId,
                                     activeSpeakerId,
                                 }: {
    participantIds: string[]
    localParticipantId?: string
    activeSpeakerId?: string
}) {
    // Move local participant to the start of the list
    const sortedIds = participantIds.sort((a, b) => {
        if (a === localParticipantId) return -1
        if (b === localParticipantId) return 1
        return 0
    })

    return (
        <div className="absolute top-4 right-4 flex flex-col gap-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {sortedIds.map((id) => (
                <ParticipantTile key={id} id={id} isLocal={id === localParticipantId} isActive={id === activeSpeakerId} />
            ))}
        </div>
    )
}

