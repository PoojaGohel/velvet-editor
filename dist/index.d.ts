import * as react_jsx_runtime from 'react/jsx-runtime';

/** Injected at build time via tsup `define` — avoids bundling package.json */
declare const EDITOR_VERSION: string;

interface EditorStats {
    words: number;
    characters: number;
}
interface FontOption {
    name: string;
    value: string;
}
interface FontSizeOption {
    name: string;
    value: string;
}
type PickerType = 'color' | 'bg' | 'link' | 'image' | 'table' | null;
type EditorMode = 'light' | 'dark' | 'system';
interface AdvanceTextEditorProps {
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
    autoSaveKey?: string;
}

declare const AdvanceTextEditor: ({ accentColor, mode, placeholder, onChange, className, variant, minHeight, maxHeight, padding, fontSize, initialValue, autoSaveKey }: AdvanceTextEditorProps) => react_jsx_runtime.JSX.Element;

export { AdvanceTextEditor, type AdvanceTextEditorProps, EDITOR_VERSION, type EditorMode, type EditorStats, type FontOption, type FontSizeOption, type PickerType };
