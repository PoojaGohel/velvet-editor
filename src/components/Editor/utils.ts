// Lightweight class name joiner — no external deps needed
export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return inputs.filter(Boolean).join(' ');
}

/** Injected at build time via tsup `define` — avoids bundling package.json */
export const EDITOR_VERSION = __EDITOR_VERSION__;

export const COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
];

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
    '168, 85, 247';
};

export const FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Outfit', value: 'Outfit' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Quicksand', value: 'Quicksand' },
  { name: 'Lora', value: 'Lora' },
  { name: 'Merriweather', value: 'Merriweather' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Dancing Script', value: 'Dancing Script' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono' },
  { name: 'Sans Serif', value: 'Arial' },
  { name: 'Serif', value: 'Georgia' },
  { name: 'Monospace', value: 'Courier New' },
];

export const FONT_SIZES = [
  { name: '12px', value: '12px' },
  { name: '14px', value: '14px' },
  { name: '16px', value: '16px' },
  { name: '18px', value: '18px' },
  { name: '20px', value: '20px' },
  { name: '24px', value: '24px' },
  { name: '30px', value: '30px' },
  { name: '36px', value: '36px' },
  { name: '48px', value: '48px' },
  { name: '60px', value: '60px' },
  { name: '72px', value: '72px' }
];

export const EmojiTheme = {
  DARK: 'dark' as const,
  LIGHT: 'light' as const
};
