import { Page } from "@playwright/test";

export async function setupVoiceMock(page: Page) {
  await page.addInitScript(() => {
    (window as any).__spoken = [];

    // 1. Wrap speechSynthesis to capture spoken answers
    if (window.speechSynthesis) {
      const origSpeak = window.speechSynthesis.speak?.bind(window.speechSynthesis);
      window.speechSynthesis.speak = function (utterance: any) {
        if (utterance && utterance.text) {
          (window as any).__spoken.push(utterance.text);
        }
        if (origSpeak) {
          try {
            origSpeak(utterance);
          } catch (_e) {}
        }
        // Simulate completion
        if (utterance && utterance.onend) {
          setTimeout(() => {
            try {
              utterance.onend({ type: "end" });
            } catch (_e) {}
          }, 50);
        }
      };
    }

    // 2. Mock SpeechRecognition
    class MockSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = "en-US";
      onresult: ((event: any) => void) | null = null;
      onend: ((event: any) => void) | null = null;
      onerror: ((event: any) => void) | null = null;
      onstart: ((event: any) => void) | null = null;

      constructor() {
        (window as any).__activeRecognition = this;
      }

      start() {
        (window as any).__activeRecognition = this;
        if (this.onstart) {
          setTimeout(() => {
            try {
              this.onstart?.({ type: "start" });
            } catch (_e) {}
          }, 10);
        }
      }

      stop() {
        if (this.onend) {
          setTimeout(() => {
            try {
              this.onend?.({ type: "end" });
            } catch (_e) {}
          }, 10);
        }
      }

      abort() {
        if (this.onend) {
          setTimeout(() => {
            try {
              this.onend?.({ type: "end" });
            } catch (_e) {}
          }, 10);
        }
      }
    }

    (window as any).SpeechRecognition = MockSpeechRecognition;
    (window as any).webkitSpeechRecognition = MockSpeechRecognition;

    // 3. Test hook: window.__say(transcript)
    (window as any).__say = function (transcript: string) {
      const rec = (window as any).__activeRecognition;
      if (!rec) {
        console.warn("[VoiceMock] No active recognition instance found");
        return;
      }

      const event = {
        resultIndex: 0,
        results: [
          [
            {
              transcript: transcript,
              confidence: 0.99,
            },
          ],
        ],
      };
      (event.results[0] as any).isFinal = true;

      if (rec.onresult) {
        try {
          rec.onresult(event);
        } catch (err) {
          console.error("[VoiceMock onresult error]", err);
        }
      }

      if (rec.onend) {
        setTimeout(() => {
          try {
            rec.onend?.({ type: "end" });
          } catch (_e) {}
        }, 20);
      }
    };

    // 4. Test hook: simulate error
    (window as any).__simulateVoiceError = function (errorType = "not-allowed") {
      const rec = (window as any).__activeRecognition;
      if (rec && rec.onerror) {
        rec.onerror({ error: errorType, message: `Mock ${errorType} error` });
      }
    };
  });
}

export async function simulateVoiceCommand(page: Page, text: string) {
  await page.evaluate((cmd) => {
    (window as any).__say(cmd);
  }, text);
}

export async function getSpokenTranscripts(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    return (window as any).__spoken || [];
  });
}
