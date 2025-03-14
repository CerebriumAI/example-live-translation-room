export interface Participant {
  id: string;
  name: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  isLocal: boolean;
  isSpeaking: boolean;
}
