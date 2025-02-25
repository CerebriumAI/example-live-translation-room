"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"
import type { ChatMessage } from "@/lib/types"

export function ChatPanel({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState("")

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const message: ChatMessage = {
            id: Date.now().toString(),
            sender: "You",
            message: newMessage,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, message])
        setNewMessage("")
    }

    return (
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-background border-l">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Chat</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="h-[calc(100%-8rem)] p-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-4">
                        <div className="font-medium text-sm">{msg.sender}</div>
                        <div className="bg-muted p-2 rounded-lg mt-1">{msg.message}</div>
                    </div>
                ))}
            </ScrollArea>

            <form onSubmit={sendMessage} className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full"
                />
            </form>
        </div>
    )
}

