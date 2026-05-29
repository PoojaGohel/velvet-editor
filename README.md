# Velvet Writer

[![npm version](https://img.shields.io/npm/v/velvet-writer.svg?style=flat-square&color=a855f7)](https://www.npmjs.com/package/velvet-writer)
[![npm downloads](https://img.shields.io/npm/dm/velvet-writer.svg?style=flat-square&color=10b981)](https://www.npmjs.com/package/velvet-writer)
[![bundle size](https://img.shields.io/bundlephobia/minzip/velvet-writer?style=flat-square&color=3b82f6)](https://bundlephobia.com/package/velvet-writer)
[![license](https://img.shields.io/npm/l/velvet-writer.svg?style=flat-square&color=f59e0b)](https://github.com/PoojaGohel/velvet-editor/blob/main/LICENSE)
[![sponsor](https://img.shields.io/badge/sponsor-pooja--gohel-ea4aaa?style=flat-square&logo=github-sponsors)](https://github.com/sponsors/PoojaGohel)
[![ko-fi](https://img.shields.io/badge/ko--fi-donate-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/PoojaGohel)

A premium, high-performance, and 100% custom-built **rich text editor** for React. Zero dependency on Slate, Quill, or Draft.js — just raw DOM performance with a stunning glassmorphism UI.

> 🔗 **[Live Demo](https://poojagohel.github.io/velvet-editor/)** | 💻 **[Try on CodeSandbox](https://codesandbox.io/s/x5d927)**

## ✨ Key Features & Capabilities

*   🚀 **100% Dependency-Free Core** — Built entirely on native DOM APIs. No Slate, Quill, or DraftJS bloat. Incredible performance, lightweight footprints, and zero security audit warnings.
*   🎨 **Premium Glassmorphism UI** — A modern, stunning design featuring smooth transitions, glassmorphic dropdowns, micro-interactions, and premium layouts.
*   🌓 **Smart Theme & Auto-Dark Mode** — Full support for Light, Dark, and System-adaptive modes with seamless visual switching.
*   🖌️ **Dynamic Accent Coloring** — Instantly brand the editor to your application. Pass any custom hex color (`accentColor`) to match your identity.
*   ⌨️ **Pro Keyboard Shortcuts** — Deep workflow support with `Ctrl+B` (Bold), `Ctrl+I` (Italic), `Ctrl+U` (Underline), `Ctrl+S` (Strikethrough), `Ctrl+Z` (Undo), `Ctrl+Y` (Redo), and intuitive `Tab`/`Shift+Tab` indentation.
*   📊 **Visual Table Suite** — Insert structured data seamlessly using an elegant 8×8 hover grid picker or manual column/row inputs.
*   💻 **Raw HTML Code View** — Switch instantly between editing modes with a built-in code editor featuring auto-prettify, instant copy-to-clipboard, and customizable font scaling.
*   🔤 **Elite Typography Suite** — Pre-integrated with premium Google Fonts (Inter, Roboto, Poppins, Outfit, etc.), 7 customizable font sizes, and clear heading hierarchies (H1 to H4).
*   🔗 **Dynamic Media & Links** — Simple popovers for inserting hyperlinks and embedding responsive images with real-time sizing adjustments.
*   📈 **Real-Time Word Metric Bar** — High-fidelity status bar with instant word and character counts, active editor states, and clean design metrics.
*   🛡️ **TypeScript Ready & React 18+ Optimized** — Complete typesafety with built-in typescript support. Optimized for modern React applications.

## 📦 Installation

```bash
npm install velvet-writer
# or
yarn add velvet-writer
```

## 🚀 Quick Start

```tsx
import { AdvanceTextEditor } from 'velvet-writer';
import 'velvet-writer/dist/index.css';

function App() {
  const handleChange = (html: string) => {
    console.log(html);
  };

  return (
    <AdvanceTextEditor 
      accentColor="#a855f7" 
      mode="system" 
      onChange={handleChange} 
    />
  );
}
```

## ⚙️ Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `accentColor` | `string` | `#a855f7` | Primary theme color for highlights, selections, and UI accents |
| `mode` | `'light' \| 'dark' \| 'system'` | `'system'` | Theme mode with auto-detection for system preference |
| `onChange` | `(html: string) => void` | `undefined` | Callback triggered on every content change, returns raw HTML |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text displayed when the editor is empty |

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + B` | Bold |
| `Ctrl + I` | Italic |
| `Ctrl + U` | Underline |
| `Ctrl + S` | Strikethrough |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Tab` | Indent |
| `Shift + Tab` | Outdent |

## 🎨 Theming

Velvet Writer supports three theme modes out of the box:

```tsx
// Auto-detect user's OS preference
<AdvanceTextEditor mode="system" />

// Force dark mode
<AdvanceTextEditor mode="dark" />

// Force light mode with custom accent
<AdvanceTextEditor mode="light" accentColor="#10b981" />
```

## 📄 License

MIT © [Pooja Gohel](https://github.com/PoojaGohel)
