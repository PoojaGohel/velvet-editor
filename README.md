# Velvet Writer - The Best Rich Text Editor for React

[![npm version](https://img.shields.io/npm/v/velvet-writer.svg?style=flat-square&color=a855f7)](https://www.npmjs.com/package/velvet-writer)
[![npm downloads](https://img.shields.io/npm/dm/velvet-writer.svg?style=flat-square&color=10b981)](https://www.npmjs.com/package/velvet-writer)
[![bundle size](https://img.shields.io/bundlephobia/minzip/velvet-writer?style=flat-square&color=3b82f6)](https://bundlephobia.com/package/velvet-writer)
[![license](https://img.shields.io/npm/l/velvet-writer.svg?style=flat-square&color=f59e0b)](https://github.com/PoojaGohel/velvet-editor/blob/main/LICENSE)
[![sponsor](https://img.shields.io/badge/sponsor-pooja--gohel-ea4aaa?style=flat-square&logo=github-sponsors)](https://github.com/sponsors/PoojaGohel)
[![ko-fi](https://img.shields.io/badge/ko--fi-donate-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/PoojaGohel)

Looking for the **best rich text editor for React**? Velvet Writer is a premium, high-performance, and 100% custom-built **text editor for React**. Designed to be the **most popular rich text editor for React** applications needing a beautiful, zero-dependency WYSIWYG solution. No Slate, Quill, or Draft.js bloat — just raw DOM performance with a stunning glassmorphism UI. It is the perfect **Tiptap alternative**, **Slate alternative**, and **Quill alternative** for modern projects. If you want to build a **Notion clone in React**, Velvet Writer provides the exact **Notion-like editor** experience out of the box.

> 🔗 **[Live Demo](https://poojagohel.github.io/velvet-editor/)** | 💻 **[Try on CodeSandbox](https://codesandbox.io/s/x5d927)**

## ⚖️ Why Choose Velvet Writer?

When developers look for the best React rich text editor, Velvet Writer stands out as the ultimate modern choice:
- **No Boilerplate:** No need to write hundreds of lines of custom plugin code just to get basic formatting working; Velvet Writer is plug-and-play out of the box.
- **Zero Dependencies:** Velvet Writer uses 100% native DOM APIs for maximum performance and a tiny bundle size, avoiding heavy external libraries and styling bloat.
- **Modern UI First:** Built specifically for modern web aesthetics with built-in glassmorphism, smooth animations, and automatic dark mode.
- **Notion Style Editing:** Bring block-style, command-palette driven editing to your app instantly.

## ✨ Key Features & Capabilities

Velvet Writer ships with a massive suite of features out of the box, requiring absolutely zero configuration or plugin installations.

### 🏗️ Core Architecture
*   🚀 **100% Dependency-Free Core** — Built entirely on native DOM APIs. No Slate, Quill, or DraftJS bloat. Incredible performance, sub-millisecond input latency, and zero security audit warnings.
*   🛡️ **TypeScript Native** — Written from the ground up in strict TypeScript. Provides flawless autocompletion and is heavily optimized for React 18+ and modern frameworks.
*   💻 **Raw HTML Engine** — Switch instantly between visual editing and a built-in code editor featuring auto-prettify, instant copy-to-clipboard, and live bidirectional DOM updates.

### ✍️ Next-Gen Editing Experience
*   ⚡ **Notion-Style Slash Commands** — Type `/` anywhere to open a lightning-fast floating command palette. Swiftly insert headings, quotes, tables, and media entirely from the keyboard.
*   📊 **Interactive Table Suite** — Insert structured data seamlessly using an elegant 8×8 hover grid picker. Features interactive cell highlighting and a floating toolbar for dynamic column/row manipulation.
*   🤖 **Markdown Auto-Parsing** — Instantly convert markdown syntax into rich elements on the fly. Type `# ` for H1, `> ` for blockquotes, or `- ` for bullet lists.
*   🔗 **Dynamic Media Engine** — Clean, inline popovers for inserting hyperlinks and embedding responsive images with real-time scaling and alignment support.

### 🎨 Premium UI & Design System
*   🎨 **Glassmorphism Aesthetics** — A visually stunning design featuring smooth transitions, frosted glass dropdowns, floating menus, and ultra-premium micro-interactions.
*   🌓 **Smart Auto-Dark Mode** — Complete native support for Light, Dark, and System-adaptive modes that instantly react to the user's OS preference without flashing.
*   🖌️ **One-Prop Branding** — Instantly brand the editor to your SaaS application. Pass a single hex color (`accentColor="#a855f7"`) and the entire UI intelligently adapts its shadows, borders, and highlights.
*   🔤 **Elite Typography System** — Pre-integrated with premium Google Fonts (Inter, Roboto, Poppins, Outfit, etc.), 7 adaptive font sizes, and mathematically perfect heading hierarchies (H1 to H4).

### ⚡ Power User Workflows
*   ⌨️ **Pro Keyboard Shortcuts** — Deep workflow support with `Ctrl+B`, `Ctrl+I`, `Ctrl+U`, `Ctrl+S`, `Ctrl+Z` (Undo), `Ctrl+Y` (Redo), and intuitive `Tab`/`Shift+Tab` block indentation.
*   📈 **Real-Time Status Metrics** — High-fidelity bottom status bar providing instant word counts, character limits, active formatting states, and clean design metrics.

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

### Standard Formatting

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + B` | Bold |
| `Ctrl + I` | Italic |
| `Ctrl + U` | Underline |
| `Ctrl + S` | Strikethrough |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + K` | Insert Link |

### Editor Navigation

| Shortcut | Action |
| :--- | :--- |
| `/` | Open Notion-Style Slash Command Menu |
| `Tab` | Indent block (List or Text) |
| `Shift + Tab` | Outdent block (List or Text) |
| `Alt + 0` | Open Editor Help Center Modal |
| `Alt + F10` | Focus the formatting toolbar |

### Markdown Auto-Parsing
Type these at the start of a new line followed by a **Space** to auto-format:

| Syntax | Converts To |
| :--- | :--- |
| `#` | Heading 1 |
| `##` | Heading 2 |
| `###` | Heading 3 |
| `>` | Blockquote |
| `-` | Bulleted List |
| `1.` | Numbered List |

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
