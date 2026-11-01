import { Page } from "@playwright/test";

export type HandGestureType =
  | "oneFinger"
  | "twoFingers"
  | "threeFingers"
  | "fourFingers"
  | "openPalm"
  | "fist"
  | "pinch"
  | "nearCamera"
  | "noHand";

export async function setupMediaPipeStub(page: Page) {
  await page.addInitScript(() => {
    (window as any).__handsCallbacks = [];
    (window as any).__currentGestureLandmarks = null;

    function buildLandmarks(type: string, cx = 0.5, cy = 0.5) {
      if (type === "noHand") return [];

      const scale = type === "nearCamera" ? 2.5 : 1.0;
      const x = cx;
      const y = cy;

      const isIndexUp = ["oneFinger", "twoFingers", "threeFingers", "fourFingers", "openPalm", "nearCamera"].includes(type);
      const isMiddleUp = ["twoFingers", "threeFingers", "fourFingers", "openPalm", "nearCamera"].includes(type);
      const isRingUp = ["threeFingers", "fourFingers", "openPalm", "nearCamera"].includes(type);
      const isPinkyUp = ["fourFingers", "openPalm", "nearCamera"].includes(type);
      const isThumbOut = ["openPalm", "nearCamera"].includes(type);
      const isPinch = type === "pinch";

      const lm: Array<{ x: number; y: number; z: number }> = new Array(21);

      // Wrist
      lm[0] = { x: x, y: y + 0.30 * scale, z: 0 };

      // Thumb
      lm[1] = { x: x - 0.08 * scale, y: y + 0.20 * scale, z: 0 };
      lm[2] = { x: x - 0.12 * scale, y: y + 0.13 * scale, z: 0 };
      lm[3] = { x: x - 0.16 * scale, y: y + 0.06 * scale, z: 0 };
      if (isPinch) {
        lm[4] = { x: x - 0.03 * scale, y: y - 0.18 * scale, z: 0 };
      } else if (isThumbOut) {
        lm[4] = { x: x - 0.28 * scale, y: y + 0.01 * scale, z: 0 };
      } else {
        // Folded thumb tucked across palm towards pinky MCP (distance < 0.10)
        lm[4] = { x: x + 0.02 * scale, y: y + 0.10 * scale, z: 0 };
      }

      // Index
      lm[5] = { x: x - 0.04 * scale, y: y + 0.05 * scale, z: 0 };
      lm[6] = { x: x - 0.04 * scale, y: y - 0.04 * scale, z: 0 };
      lm[7] = { x: x - 0.04 * scale, y: y - 0.12 * scale, z: 0 };
      lm[8] = isIndexUp || isPinch
        ? { x: x - 0.04 * scale, y: y - 0.20 * scale, z: 0 }
        : { x: x - 0.04 * scale, y: y + 0.12 * scale, z: 0 };

      // Middle
      lm[9] = { x: x, y: y + 0.04 * scale, z: 0 };
      lm[10] = { x: x, y: y - 0.05 * scale, z: 0 };
      lm[11] = { x: x, y: y - 0.14 * scale, z: 0 };
      lm[12] = isMiddleUp
        ? { x: x, y: y - 0.22 * scale, z: 0 }
        : { x: x, y: y + 0.12 * scale, z: 0 };

      // Ring
      lm[13] = { x: x + 0.04 * scale, y: y + 0.05 * scale, z: 0 };
      lm[14] = { x: x + 0.04 * scale, y: y - 0.03 * scale, z: 0 };
      lm[15] = { x: x + 0.04 * scale, y: y - 0.11 * scale, z: 0 };
      lm[16] = isRingUp
        ? { x: x + 0.04 * scale, y: y - 0.19 * scale, z: 0 }
        : { x: x + 0.04 * scale, y: y + 0.12 * scale, z: 0 };

      // Pinky
      lm[17] = { x: x + 0.08 * scale, y: y + 0.08 * scale, z: 0 };
      lm[18] = { x: x + 0.08 * scale, y: y + 0.01 * scale, z: 0 };
      lm[19] = { x: x + 0.08 * scale, y: y - 0.06 * scale, z: 0 };
      lm[20] = isPinkyUp
        ? { x: x + 0.08 * scale, y: y - 0.14 * scale, z: 0 }
        : { x: x + 0.08 * scale, y: y + 0.12 * scale, z: 0 };

      return lm;
    }

    (window as any).__buildLandmarks = buildLandmarks;

    function dispatchCurrentLandmarks() {
      const landmarks = (window as any).__currentGestureLandmarks;
      const results = landmarks && landmarks.length > 0
        ? {
            multiHandLandmarks: [landmarks],
            multiHandedness: [{ label: "Right", score: 0.99 }],
          }
        : {
            multiHandLandmarks: [],
            multiHandedness: [],
          };
      const callbacks = (window as any).__handsCallbacks || [];
      for (const cb of callbacks) {
        try {
          cb(results);
        } catch (_err) {}
      }
    }

    (window as any).__simulateGesture = (type: string, cx = 0.5, cy = 0.5) => {
      const landmarks = buildLandmarks(type, cx, cy);
      (window as any).__currentGestureLandmarks = landmarks;
      dispatchCurrentLandmarks();
    };

    // Define stub Hands class
    class StubHands {
      options: any = {};
      constructor(_config?: any) {}
      setOptions(opts: any) {
        this.options = opts;
      }
      onResults(cb: any) {
        (window as any).__handsCallbacks.push(cb);
        if ((window as any).__currentGestureLandmarks) {
          dispatchCurrentLandmarks();
        }
      }
      async send(_input: any) {
        // Continuous loop calls send({ image }) - dispatch simulated landmarks
        if ((window as any).__currentGestureLandmarks) {
          dispatchCurrentLandmarks();
        }
        return Promise.resolve();
      }
      close() {
        return Promise.resolve();
      }
    }

    // Set on window and prevent CDN overwrite from breaking the stub
    Object.defineProperty(window, "Hands", {
      configurable: true,
      get() {
        return StubHands;
      },
      set(_val) {
        // Keep StubHands active for Layer 2 tests
      },
    });
  });
}

export async function simulateHandGesture(
  page: Page,
  gesture: HandGestureType,
  coords: { x: number; y: number } = { x: 0.5, y: 0.5 }
) {
  return await page.evaluate(
    ({ g, c }) => {
      return (window as any).__simulateGesture(g, c.x, c.y);
    },
    { g: gesture, c: coords }
  );
}
