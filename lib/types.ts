export interface Participant {
    id: string
    name: string
    videoEnabled: boolean
    audioEnabled: boolean
    isLocal: boolean
    isSpeaking: boolean
}

export interface ChatMessage {
    id: string
    sender: string
    message: string
    timestamp: Date
}

export interface Translation {
    text: string
    language: string
    timestamp: Date
}

