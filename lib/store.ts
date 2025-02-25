import { create } from "zustand"
import type { Translation } from "./types"

interface RoomStore {
    activeSpeakerId: string | null
    pinnedParticipantId: string | null
    showChat: boolean
    isRecording: boolean
    isSharingScreen: boolean
    meetingStartTime: Date | null
    translations: Translation[]
    preferences: {
        showTranslations: boolean
        targetLanguage: string
        layout: "speaker" | "grid"
        audioOnly: boolean
    }
    setActiveSpeaker: (id: string | null) => void
    setPinnedParticipant: (id: string | null) => void
    toggleChat: () => void
    setRecording: (isRecording: boolean) => void
    setScreenSharing: (isSharing: boolean) => void
    setMeetingStartTime: (time: Date) => void
    addTranslation: (translation: Translation) => void
    updatePreferences: (preferences: Partial<RoomStore["preferences"]>) => void
}

export const useRoomStore = create<RoomStore>((set) => ({
    activeSpeakerId: null,
    pinnedParticipantId: null,
    showChat: false,
    isRecording: false,
    isSharingScreen: false,
    meetingStartTime: null,
    translations: [],
    preferences: {
        showTranslations: true,
        targetLanguage: "en",
        layout: "speaker",
        audioOnly: false,
    },
    setActiveSpeaker: (id) => set({ activeSpeakerId: id }),
    setPinnedParticipant: (id) => set({ pinnedParticipantId: id }),
    toggleChat: () => set((state) => ({ showChat: !state.showChat })),
    setRecording: (isRecording) => set({ isRecording }),
    setScreenSharing: (isSharing) => set({ isSharingScreen: isSharing }),
    setMeetingStartTime: (time) => set({ meetingStartTime: time }),
    addTranslation: (translation) => set((state) => ({ translations: [...state.translations, translation] })),
    updatePreferences: (preferences) => set((state) => ({ preferences: { ...state.preferences, ...preferences } })),
}))