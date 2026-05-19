export interface EditorStats {
  words: number;
  characters: number;
}

export interface FontOption {
  name: string;
  value: string;
}

export interface FontSizeOption {
  name: string;
  value: string;
}

export type PickerType = 'color' | 'bg' | 'link' | 'image' | 'table' | null;

export type EditorMode = 'light' | 'dark' | 'system';

export interface AdvanceTextEditorProps {
  accentColor?: string;
  mode?: EditorMode;
  placeholder?: string;
  initialValue?: string;
  onChange?: (html: string) => void;
  className?: string;
  variant?: 'premium' | 'flat';
  minHeight?: string | number;
  maxHeight?: string | number;
  padding?: string;
  fontSize?: string;
}
