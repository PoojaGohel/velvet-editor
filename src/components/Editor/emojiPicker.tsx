import { lazy, useEffect, useState } from 'react';

/** Lazy component — no-ops if emoji-picker-react is not installed. */
export const EmojiPicker = lazy(async () => {
  try {
    const mod = await import('emoji-picker-react');
    return { default: mod.default };
  } catch {
    return { default: () => null };
  }
});

/** Detect optional peer dependency without opening the picker. */
export function useEmojiPickerAvailable(): boolean {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import('emoji-picker-react')
      .then(() => {
        if (!cancelled) setAvailable(true);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return available;
}
