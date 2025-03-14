"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useParticipantIds, useDailyEvent, useDaily } from "@daily-co/daily-react"
import { UserMediaError } from "./user-media-error"
import { Tile } from "./tile"
import { Controls } from "./controls"
import { RoomHeader } from "./room-header"
import { TranslatorPlaceholder } from "./translator-placeholder"
import { useRoomStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {DailyParticipantsObject} from "@daily-co/daily-js";

export const parseTranslatorInfo = (userName: string) => {
    if (!userName) return null;

    if (userName.startsWith('Translator-') && userName.includes('__for__')) {
        const parts = userName.split('__for__');
        if (parts.length === 2) {
            const translatorPart = parts[0];
            const userId = parts[1];

            const language = translatorPart.split('-')[1]; // Extract language

            return {
                isTranslator: true,
                language,
                forUserId: userId
            };
        }
    }

    return null;
};

export default function VideoRoom({ userName, roomName, url }: { userName: string; roomName: string, url: string }) {
    const [getUserMediaError, setGetUserMediaError] = useState(false)
    const [isTranslationLoading, setIsTranslationLoading] = useState(false)
    const [translatorFound, setTranslatorFound] = useState(false)
    const daily = useDaily()
    const participantIds = useParticipantIds()
    const [userId, setUserId] = useState('')
    const { setActiveSpeaker, setMeetingStartTime, preferences } = useRoomStore()
    const targetLanguage = preferences?.targetLanguage || 'en'

    useDailyEvent(
        "camera-error",
        useCallback(() => {
            setGetUserMediaError(true)
        }, []),
    )

    useDailyEvent(
        "active-speaker-change",
        useCallback(
            (event) => {
                setActiveSpeaker(event?.activeSpeaker?.peerId || null)
            },
            [setActiveSpeaker],
        ),
    )

    useEffect(() => {
        console.log("Translation loading:", isTranslationLoading);
        console.log("Translator found:", translatorFound);
        console.log("Participant count:", participantIds.length);
    }, [isTranslationLoading, translatorFound, participantIds.length]);

    useEffect(() => {
        if (!daily || !userId) return

        const checkForTranslator = () => {
            const allParticipants = daily.participants();
            let found = false;

            for (const id in allParticipants) {
                const participant = allParticipants[id];
                const userName = participant?.user_name;

                const translatorInfo = parseTranslatorInfo(userName || '');

                if (translatorInfo && translatorInfo.forUserId === userId) {
                    found = true;
                    break;
                }
            }

            setTranslatorFound(found);
        }

        checkForTranslator();

        const handleParticipantChange = () => {
            checkForTranslator();
        }

        daily.on('participant-joined', handleParticipantChange);
        daily.on('participant-updated', handleParticipantChange);

        return () => {
            daily.off('participant-joined', handleParticipantChange);
            daily.off('participant-updated', handleParticipantChange);
        }
    }, [daily, userId]);

    const startTranslationService = useCallback(async () => {
        if (!daily || !userId) return;
        console.log('Starting translation service');

        try {
            setIsTranslationLoading(true);

            const response = await fetch(process.env.NEXT_PUBLIC_CEREBRIUM_URL || '', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CEREBRIUM_API_KEY}`
                },
                body: JSON.stringify({
                    room_url: url,
                    target_language: targetLanguage,
                    user_name: userName,
                    user_id: userId
                }),
            });

            await response.json();

        } catch (err) {
            console.error('Failed to start translation service:', err);
            setIsTranslationLoading(false);
        }
    }, [userId]);

    React.useEffect(() => {
        if (!userId) return;
        startTranslationService();
    }, [userId])

    React.useEffect(() => {
        if (!daily) return

        const join = async () => {
            try {
                const result = await daily.join({ userName, userData: {language: targetLanguage} }) as DailyParticipantsObject
                if (result.local) {
                    setUserId(result.local.user_id)
                }
                setMeetingStartTime(new Date())
            } catch (err) {
                console.error("Failed to join room:", err)
                setGetUserMediaError(true)
            }
        }

        join()

        return () => {
            daily.leave()
        }
    }, [daily])

    useEffect(() => {
        if (translatorFound && isTranslationLoading) {
            setIsTranslationLoading(false)
        }
    }, [translatorFound, isTranslationLoading])

    const getGridLayout = (count: number) => {
        const adjustedCount = isTranslationLoading && !translatorFound ? count + 1 : count;

        if (adjustedCount <= 1) return "grid-cols-1"
        if (adjustedCount === 2) return "grid-cols-2"
        if (adjustedCount <= 4) return "grid-cols-2 grid-rows-2"
        if (adjustedCount <= 6) return "grid-cols-3 grid-rows-2"
        if (adjustedCount <= 9) return "grid-cols-3 grid-rows-3"
        return "grid-cols-4 grid-rows-3" // Max 12 participants
    }

    const renderCallScreen = () => (
        <div className="h-screen flex flex-col overflow-hidden relative">
            <RoomHeader roomName={roomName} />

            <main className="flex-1 min-h-0 p-4">
                <div className={cn("grid gap-4 h-full", getGridLayout(participantIds.length))}>
                    {participantIds.map((id) => (
                        <Tile key={id} id={id} />
                    ))}

                    {isTranslationLoading && !translatorFound && (
                        <TranslatorPlaceholder
                            targetLanguage={targetLanguage}
                            userName={userName}
                            isTranslationLoading={isTranslationLoading}
                            setIsTranslationLoading={setIsTranslationLoading}
                        />
                    )}
                </div>
            </main>

            <Controls className="flex-none h-16" />
        </div>
    )

    return getUserMediaError ? <UserMediaError /> : renderCallScreen()
}