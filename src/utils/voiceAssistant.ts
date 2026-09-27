/**
 * Cyclewise Voice & Audio Engine (Sauti ya Cyclewise)
 * Provides speech-to-text (voice recording) and text-to-speech (audio playback)
 * with native support for Kenyan English, Swahili (sw-KE) and dialect pronunciations.
 */

export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  error?: string;
}

export class VoiceAssistant {
  private static recognition: any = null;
  private static isSpeaking: boolean = false;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }

  public static isTtsSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Start listening to the microphone in Kenyan English / Swahili
   */
  public static startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    language: 'sw-KE' | 'en-KE' | 'en-US' = 'sw-KE'
  ): () => void {
    if (!this.isSupported()) {
      onError('Speech recognition is not supported in this browser. Please type or use Chrome/Safari.');
      return () => {};
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onResult(text, !!finalTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('[VoiceAssistant] Speech error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Microphone permission denied. Please allow microphone access in your browser.');
        } else {
          onError(`Voice input notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        this.recognition = null;
      };

      this.recognition = recognition;
      recognition.start();

      return () => {
        if (this.recognition) {
          try {
            this.recognition.stop();
          } catch {}
          this.recognition = null;
        }
      };
    } catch (e: any) {
      onError(e.message || 'Failed to start microphone');
      return () => {};
    }
  }

  /**
   * Stop any active microphone listening
   */
  public static stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }
  }

  /**
   * Speak text aloud using SpeechSynthesis
   */
  public static speak(text: string, onEnd?: () => void, language: string = 'sw'): void {
    if (!this.isTtsSupported() || !text) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior speech

      // Clean markdown, symbols, and code tags
      const cleanText = text
        .replace(/[*#_`~[\]()]/g, '')
        .replace(/KES/g, 'Kenya Shillings')
        .replace(/\bSME\b/g, 'small business')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95; // slightly slower for maximum clarity
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      // Try to find Swahili or British/African English voice
      const preferredVoice = voices.find(
        (v) => v.lang.includes('sw') || v.lang.includes('en-KE') || v.lang.includes('en-GB') || v.lang.includes('en-ZA')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      this.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[VoiceAssistant] TTS error:', e);
      if (onEnd) onEnd();
    }
  }

  /**
   * Stop speaking audio immediately
   */
  public static stopSpeaking(): void {
    if (this.isTtsSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isSpeaking = false;
  }
}
