"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createRoomSchema, joinRoomSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import {RefreshCwIcon} from "lucide-react";

type CreateRoomForm = z.infer<typeof createRoomSchema>
type JoinRoomForm = z.infer<typeof joinRoomSchema>

export default function JoinPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const createForm = useForm<CreateRoomForm>({
        resolver: zodResolver(createRoomSchema),
    })

    const joinForm = useForm<JoinRoomForm>({
        resolver: zodResolver(joinRoomSchema),
    })

    async function handleCreateRoom(data: CreateRoomForm) {
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.error || "Failed to create room")
            }

            router.push(`/demo/rooms/${encodeURIComponent(responseData.roomId)}/check?name=${encodeURIComponent(data.name)}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create room")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleJoinRoom(data: JoinRoomForm) {
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch(`/api/rooms/${data.roomId}`)
            const responseData = await response.json()

            if (!response.ok || !responseData.valid) {
                throw new Error(responseData.error || "Invalid room ID")
            }

            router.push(`/demo/rooms/${encodeURIComponent(data.roomId)}/check?name=${encodeURIComponent(data.name)}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to join room")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Video Meeting</CardTitle>
                    <CardDescription>Create a new room or join an existing one</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="create">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="create">Create Room</TabsTrigger>
                            <TabsTrigger value="join">Join Room</TabsTrigger>
                        </TabsList>
                        <TabsContent value="create">
                            <form onSubmit={createForm.handleSubmit(handleCreateRoom)} className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="create-name">Your Name</Label>
                                    <Input id="create-name" {...createForm.register("name")} placeholder="John Doe" />
                                    {createForm.formState.errors.name && (
                                        <p className="text-sm text-destructive">{createForm.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Room
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="join">
                            <form onSubmit={joinForm.handleSubmit(handleJoinRoom)} className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="join-name">Your Name</Label>
                                    <Input id="join-name" {...joinForm.register("name")} placeholder="John Doe" />
                                    {joinForm.formState.errors.name && (
                                        <p className="text-sm text-destructive">{joinForm.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="roomId">Room ID</Label>
                                    <Input id="roomId" {...joinForm.register("roomId")} placeholder="meeting-room-id" />
                                    {joinForm.formState.errors.roomId && (
                                        <p className="text-sm text-destructive">{joinForm.formState.errors.roomId.message}</p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />}
                                    Join Room
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}