/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BreathingPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'completed';
export type BreathingMode = '478' | 'box';

export interface BreathingPhaseConfig {
  phase: BreathingPhase;
  durationSeconds: number;
  labelEs: string;
  labelEn: string;
  instructionEs: string;
  instructionEn: string;
}

export const BREATHING_478_SEQUENCE: BreathingPhaseConfig[] = [
  {
    phase: 'inhale',
    durationSeconds: 4,
    labelEs: 'Inhala',
    labelEn: 'Inhale',
    instructionEs: 'Inhala suavemente por la nariz',
    instructionEn: 'Inhale gently through your nose',
  },
  {
    phase: 'hold',
    durationSeconds: 7,
    labelEs: 'Mantén',
    labelEn: 'Hold',
    instructionEs: 'Mantén la respiración',
    instructionEn: 'Hold your breath',
  },
  {
    phase: 'exhale',
    durationSeconds: 8,
    labelEs: 'Exhala',
    labelEn: 'Exhale',
    instructionEs: 'Exhala lentamente por la boca',
    instructionEn: 'Exhale slowly through your mouth',
  },
];

export const TOTAL_478_DURATION_SECONDS = 19; // 4 + 7 + 8 = 19 seconds

export const COMPLETION_MESSAGE_ES = 'Respiración completada. Tómate un momento para relajarte.';
export const COMPLETION_MESSAGE_EN = 'Breathing completed. Take a moment to relax.';

/**
 * Pure transition calculator for single-cycle breathing.
 * Returns the next state given current phase and remaining seconds.
 * When exhale reaches 0, returns phase 'completed' and seconds 0 (NO infinite loop).
 */
export function getNext478Step(
  currentPhase: BreathingPhase,
  remainingSeconds: number
): { nextPhase: BreathingPhase; nextSeconds: number; isCompleted: boolean } {
  if (currentPhase === 'idle' || currentPhase === 'completed') {
    return { nextPhase: currentPhase, nextSeconds: remainingSeconds, isCompleted: currentPhase === 'completed' };
  }

  // If still counting down in the current phase
  if (remainingSeconds > 1) {
    return {
      nextPhase: currentPhase,
      nextSeconds: remainingSeconds - 1,
      isCompleted: false,
    };
  }

  // remainingSeconds === 1, transition to next phase
  if (currentPhase === 'inhale') {
    return {
      nextPhase: 'hold',
      nextSeconds: 7,
      isCompleted: false,
    };
  }

  if (currentPhase === 'hold') {
    return {
      nextPhase: 'exhale',
      nextSeconds: 8,
      isCompleted: false,
    };
  }

  // currentPhase === 'exhale': END OF THE 19-SECOND CYCLE!
  return {
    nextPhase: 'completed',
    nextSeconds: 0,
    isCompleted: true,
  };
}

/**
 * Synthesizes a clean, domestic oven / microwave timer finish beep ("bip-bip-bip").
 * Duration: ~0.65 seconds total.
 * Audio properties:
 * - Pure sine oscillator tone (1046.5 Hz - High C6 with closing soft chime at 1174.6 Hz - D6)
 * - Three distinct pulses reminiscent of a household kitchen timer/oven
 * - Exponential ramps to avoid clicks or clipping
 * - Respects volume (0.0 to 1.0) and master mute
 */
export function playOvenTimerBeep(
  volume = 0.7,
  audioCtx?: AudioContext | null
): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return false;

    const ctx = audioCtx && audioCtx.state !== 'closed' ? audioCtx : new AudioCtxClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    const clampedVol = Math.max(0, Math.min(1, volume)) * 0.35; // gentle, non-jarring domestic volume
    masterGain.gain.setValueAtTime(clampedVol, now);
    masterGain.connect(ctx.destination);

    // 3 characteristic electronic kitchen timer pulses
    const pulses = [
      { start: 0.00, dur: 0.12, freq: 1046.5 },
      { start: 0.20, dur: 0.12, freq: 1046.5 },
      { start: 0.40, dur: 0.20, freq: 1174.6 },
    ];

    pulses.forEach(({ start, dur, freq }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      // Envelope to eliminate audible click transients
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(1.0, now + start + 0.015);
      gain.gain.setValueAtTime(1.0, now + start + dur - 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    });

    return true;
  } catch (err) {
    console.warn('Web Audio oven beep could not be played:', err);
    return false;
  }
}
