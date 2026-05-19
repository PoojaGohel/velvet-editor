import * as react_jsx_runtime from 'react/jsx-runtime';

declare const EDITOR_VERSION: string;

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
}

declare const AdvanceTextEditor: ({ accentColor, mode, placeholder, onChange, className, variant, minHeight, maxHeight, padding, fontSize, initialValue }: AdvanceTextEditorProps) => react_jsx_runtime.JSX.Element;

export { AdvanceTextEditor, EDITOR_VERSION };
