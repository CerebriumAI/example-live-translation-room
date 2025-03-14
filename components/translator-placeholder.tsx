"use client"

import React from "react"
import { useDaily, useLocalSessionId } from "@daily-co/daily-react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {parseTranslatorInfo} from "@/components/video-room";

interface TranslatorPlaceholderProps {
    targetLanguage: string;
    userName: string;
    isTranslationLoading: boolean;
    setIsTranslationLoading: (loading: boolean) => void;
}

export function TranslatorPlaceholder({
                                          targetLanguage = 'en',
                                          userName,
                                          isTranslationLoading,
                                          setIsTranslationLoading
                                      }: TranslatorPlaceholderProps) {
    const daily = useDaily()
    const localSessionId = useLocalSessionId()
    const [hasFoundTranslator, setHasFoundTranslator] = React.useState(false)

    React.useEffect(() => {
        if (!daily || !localSessionId) return

        const findUserTranslator = () => {
            const allParticipants = daily.participants()

            console.log(allParticipants)

            for (const id in allParticipants) {
                const participant = allParticipants[id];
                console.log(id)
                const translatorInfo = parseTranslatorInfo(userName)

                if (
                    translatorInfo?.isTranslator  &&
                    translatorInfo.forUserId === localSessionId
                ) {
                    setHasFoundTranslator(true)

                    if (isTranslationLoading) {
                        setIsTranslationLoading(false)
                    }

                    return
                }
            }

            setHasFoundTranslator(false)
        }

        findUserTranslator()

        const handleParticipantChange = () => {
            findUserTranslator()
        }

        daily.on('participant-joined', handleParticipantChange)
        daily.on('participant-updated', handleParticipantChange)

        return () => {
            daily.off('participant-joined', handleParticipantChange)
            daily.off('participant-updated', handleParticipantChange)
        }
    }, [daily, localSessionId, isTranslationLoading, setIsTranslationLoading])

    if (hasFoundTranslator) {
        return null
    }

    if (isTranslationLoading) {
        const bgColor = targetLanguage === 'en' ? "bg-blue-500" :
            targetLanguage === 'es' ? "bg-red-500" : "bg-gray-500";
        const languageText = targetLanguage === 'en' ? 'English' :
            targetLanguage === 'es' ? 'Spanish' : '';

        return (
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-200">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center text-white mb-2",
                        bgColor
                    )}>
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium">{userName} (Translator-{targetLanguage})</p>
                        <p className="text-sm text-gray-600">
                            {languageText} translation connecting...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return null
}