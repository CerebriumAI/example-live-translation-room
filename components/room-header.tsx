import { Button } from "@/components/ui/button"
import { Users, Copy, Link } from "lucide-react"
import { MeetingTimer } from "./meeting-timer"
import { useParticipantIds, useParticipant } from "@daily-co/daily-react"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function RoomHeader({ roomName }: { roomName: string }) {
    const participantIds = useParticipantIds()

    const copyRoomLink = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Room link copied to clipboard")
    }

    return (
        <header className="h-14 border-b px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h1 className="font-semibold">{roomName}</h1>
                <div className="h-4 w-px bg-border" />
                <MeetingTimer />
            </div>

            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Link className="h-4 w-4" />
                            Share Room
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium">Room Link</h3>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 p-2 rounded bg-muted text-xs break-all">{window.location.href}</code>
                                    <Button size="sm" variant="ghost" className="shrink-0" onClick={copyRoomLink}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">Participants ({participantIds.length})</h3>
                                <div className="space-y-2">
                                    {participantIds.map((id) => (
                                        <ParticipantItem key={id} id={id} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button variant="ghost" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    {participantIds.length}
                </Button>
            </div>
        </header>
    )
}

function ParticipantItem({ id }: { id: string }) {
    const participant = useParticipant(id)
    if (!participant) return null

    return (
        <div className="flex items-center gap-2 text-sm p-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {participant.user_name?.[0]?.toUpperCase()}
            </div>
            <span>{participant.user_name}</span>
            {participant.local && <span className="text-xs text-muted-foreground">(You)</span>}
        </div>
    )
}