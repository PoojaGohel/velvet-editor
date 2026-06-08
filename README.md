# Velvet Writer — React Rich Text Editor

[![CI](https://img.shields.io/github/actions/workflow/status/PoojaGohel/velvet-editor/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/PoojaGohel/velvet-editor/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/velvet-writer.svg?style=flat-square&color=a855f7)](https://www.npmjs.com/package/velvet-writer)
[![npm downloads](https://img.shields.io/npm/dm/velvet-writer.svg?style=flat-square&color=10b981)](https://www.npmjs.com/package/velvet-writer)
[![GitHub stars](https://img.shields.io/github/stars/PoojaGohel/velvet-editor?style=flat-square&color=8b5cf6)](https://github.com/PoojaGohel/velvet-editor/stargazers)
[![bundle size](https://img.shields.io/bundlephobia/minzip/velvet-writer?style=flat-square&color=3b82f6&label=~55KB)](https://bundlephobia.com/package/velvet-writer)
[![license](https://img.shields.io/npm/l/velvet-writer.svg?style=flat-square&color=f59e0b)](https://github.com/PoojaGohel/velvet-editor/blob/main/LICENSE)
[![sponsor](https://img.shields.io/badge/sponsor-pooja--gohel-ea4aaa?style=flat-square&logo=github-sponsors)](https://github.com/sponsors/PoojaGohel)

**Zero-dependency React rich text editor** with glassmorphism UI, slash commands, inline markdown, tables, and dark mode — drop in and ship in under 2 minutes. No Slate, Quill, or Draft.js required.

```bash
npm install velvet-writer
```

### Try it now

| | Link |
| :--- | :--- |
| 🎮 **Live demo** | [poojagohel.github.io/velvet-editor](https://poojagohel.github.io/velvet-editor/) |
| ⚡ **StackBlitz** | [Open starter project](https://stackblitz.com/github/PoojaGohel/velvet-editor/tree/main/examples/vite-starter) |
| 📦 **npm** | [velvet-writer](https://www.npmjs.com/package/velvet-writer) |
| 📊 **Compare** | [vs Tiptap, Slate, Quill](./docs/COMPARISON.md) |

> ⭐ **If Velvet Writer saves you time, [star the repo](https://github.com/PoojaGohel/velvet-editor)** — it helps other developers discover the package.

---

## ⚖️ Why Choose Velvet Writer?

- **Zero Runtime Dependencies** — No `clsx`, no `tailwind-merge`, no heavy extras. Just React and native DOM APIs.
- **No Boilerplate** — Plug-and-play. Drop it in and get a full-featured editor with one component.
- **Modern UI First** — Built-in glassmorphism, smooth animations, and automatic dark mode.
- **Notion-Style Editing** — Block-style slash commands, inline markdown parsing, and contextual table tools.
- **Production stability** — Automated tests, CI on every push, error boundary, safe localStorage, and graceful optional emoji support.

---

## 📦 Installation

```bash
npm install velvet-writer
# or
yarn add velvet-writer
```

### Optional: Enable the Emoji Picker

The emoji toolbar button requires `emoji-picker-react`. Install it only if you need emoji support:

```bash
npm install emoji-picker-react
```

If `emoji-picker-react` is not installed, the emoji button simply won't render the picker. No errors, no crashes.

---

## 🚀 Quick Start

```tsx
import { AdvanceTextEditor } from 'velvet-writer';
import 'velvet-writer/dist/index.css';

function App() {
  return (
    <AdvanceTextEditor
      accentColor="#a855f7"
      mode="system"
      onChange={(html) => console.log(html)}
    />
  );
}
```

### Vite / Create React App

Works with any React 18+ bundler. See the [minimal Vite starter](../examples/vite-starter/) or [open it in StackBlitz](https://stackblitz.com/github/PoojaGohel/velvet-editor/tree/main/examples/vite-starter).

### Next.js (App Router)

Velvet Writer uses `contenteditable` and runs in the browser. Import it **client-side only**:

```tsx
'use client';

import dynamic from 'next/dynamic';

const AdvanceTextEditor = dynamic(
  () => import('velvet-writer').then((m) => m.AdvanceTextEditor),
  { ssr: false, loading: () => <p>Loading editor…</p> }
);

// In layout or page — also import CSS once:
// import 'velvet-writer/dist/index.css';

export default function EditorPage() {
  return (
    <AdvanceTextEditor mode="system" accentColor="#a855f7" />
  );
}
```

Add `import 'velvet-writer/dist/index.css'` in your root layout or this page.

---

## 🔌 Integration Guide

### Basic CMS / Blog Editor

```tsx
import { useState } from 'react';
import { AdvanceTextEditor } from 'velvet-writer';
import 'velvet-writer/dist/index.css';

function BlogEditor() {
  const [content, setContent] = useState('');

  const handleSave = () => {
    // `content` is clean semantic HTML — store it in your database
    fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ body: content }),
    });
  };

  return (
    <div>
      <AdvanceTextEditor
        accentColor="#6366f1"
        mode="light"
        variant="flat"
        placeholder="Write your post..."
        onChange={setContent}
        autoSaveKey="my-blog-draft"   // auto-saves to localStorage
      />
      <button onClick={handleSave}>Publish</button>
    </div>
  );
}
```

### Controlled Editor with Initial HTML Value

```tsx
import { AdvanceTextEditor } from 'velvet-writer';
import 'velvet-writer/dist/index.css';

function EditPost({ post }: { post: { body: string } }) {
  return (
    <AdvanceTextEditor
      initialValue={post.body}          // pre-fill with existing HTML
      onChange={(html) => console.log(html)}
      accentColor="#10b981"
      mode="dark"
      variant="premium"
      minHeight="400px"
      maxHeight="800px"
      padding="24px 32px"
      fontSize="1.05rem"
    />
  );
}
```

### With React Hook Form

```tsx
import { Controller, useForm } from 'react-hook-form';
import { AdvanceTextEditor } from 'velvet-writer';
import 'velvet-writer/dist/index.css';

function PostForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="body"
        control={control}
        render={({ field }) => (
          <AdvanceTextEditor
            initialValue={field.value}
            onChange={field.onChange}
            accentColor="#a855f7"
          />
        )}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

---

## ⚙️ Props (All Options)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `accentColor` | `string` | `#a855f7` | Primary theme color for highlights, selections, borders, and UI accents. Pass any valid hex color. |
| `mode` | `'light' \| 'dark' \| 'system'` | `'dark'` | Theme mode. `'system'` auto-detects the user's OS preference. |
| `variant` | `'premium' \| 'flat'` | `'premium'` | `'premium'` shows a glassmorphism frosted-glass toolbar. `'flat'` is a clean minimal style. |
| `placeholder` | `string` | `'Start typing your masterpiece...'` | Placeholder text shown when the editor is empty. |
| `initialValue` | `string` | `<p><br></p>` | Initial HTML content to pre-fill the editor. Updates when this prop changes. |
| `onChange` | `(html: string) => void` | — | Callback called on every edit, returning clean semantic HTML. |
| `minHeight` | `string \| number` | — | Minimum height of the editable area (e.g., `'400px'` or `400`). |
| `maxHeight` | `string \| number` | — | Maximum height before the editor scrolls (e.g., `'800px'` or `800`). |
| `padding` | `string` | — | Internal padding for the editable content area (e.g., `'24px 32px'`). |
| `fontSize` | `string` | — | Base font size for editor content (e.g., `'1rem'` or `'16px'`). |
| `autoSaveKey` | `string` | — | When set, automatically persists content to `localStorage` under this key and restores it on mount. |
| `className` | `string` | — | Additional CSS class applied to the outermost editor wrapper. |

---

## ✨ Features

### 🏗️ Core Architecture
- 🚀 **Zero Dependencies** — Built entirely on native DOM APIs. No Slate, Quill, or DraftJS. Tiny bundle, sub-millisecond input latency.
- 🛡️ **TypeScript Native** — Full type definitions included. Flawless autocompletion in VS Code, WebStorm, etc.
- 💻 **Raw HTML Source View** — Toggle to a live code editor with auto-prettify and instant clipboard copy.

### ✍️ Editing Experience
- ⚡ **Slash Commands** — Type `/` to open a floating command palette. Insert headings, quotes, tables, and images by keyboard.
- 📊 **Interactive Table Editor** — Elegant 8×8 hover grid picker, floating toolbar for add/delete row/column actions.
- 🤖 **Inline Markdown** — `# ` → H1, `**bold**` → **bold**, `~~text~~` → strikethrough, all convert on Space.
- 🔗 **Media Engine** — Inline popovers for links and images with real-time width/height controls.

### 🎨 Design System
- 🎨 **Glassmorphism UI** — Frosted glass dropdowns, floating menus, and premium micro-interactions.
- 🌓 **Smart Dark Mode** — Light, Dark, and System-adaptive modes with no flash.
- 🖌️ **One-Prop Branding** — Pass `accentColor="#your-hex"` and the entire UI adapts its shadows, borders, and highlights.
- 🔤 **Typography Suite** — Pre-integrated with 16 Google Fonts, 11 font sizes, and H1–H4 heading hierarchy.

### ⚡ Power Features
- ⌨️ **Keyboard Shortcuts** — `Ctrl+B/I/U/S/Z/Y`, Tab indentation, and more.
- 📈 **Real-Time Status Bar** — Live word count, character count, and active format indicators.
- 😊 **Emoji Picker** — Searchable emoji picker with dark/light theme sync (requires optional `emoji-picker-react`).
- 💾 **Auto-Save** — Pass `autoSaveKey` to get automatic localStorage persistence with debouncing.
- 🎯 **Zen / Focus Mode** — Toggle distraction-free editing.
- 📤 **Export** — Download content as Markdown or trigger a browser print-to-PDF.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + B` | Bold |
| `Ctrl + I` | Italic |
| `Ctrl + U` | Underline |
| `Ctrl + S` | Strikethrough |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + K` | Insert Link |
| `/` | Open Slash Command Menu |
| `Tab` | Indent block |
| `Shift + Tab` | Outdent block |
| `Alt + 0` | Open Help Center Modal |

### Markdown Auto-Parsing

Type at the **start of a line** followed by a **Space**:

| Syntax | Converts To |
| :--- | :--- |
| `#` | Heading 1 |
| `##` | Heading 2 |
| `###` | Heading 3 |
| `>` | Blockquote |
| `-` | Bulleted List |
| `1.` | Numbered List |

Inline (anywhere in text):

| Syntax | Converts To |
| :--- | :--- |
| `**text**` + Space | **Bold** |
| `*text*` + Space | *Italic* |
| `~~text~~` + Space | ~~Strikethrough~~ |
| `` `code` `` + Space | `inline code` |

---

## 🎨 Theming Examples

```tsx
// Auto-detect OS preference (recommended)
<AdvanceTextEditor mode="system" />

// Force dark mode with custom accent
<AdvanceTextEditor mode="dark" accentColor="#f59e0b" />

// Light flat variant (great for admin dashboards)
<AdvanceTextEditor mode="light" variant="flat" accentColor="#10b981" />

// Compact embedded editor
<AdvanceTextEditor
  minHeight="200px"
  maxHeight="400px"
  padding="12px 16px"
  fontSize="0.875rem"
/>
```

---

## 📊 How it compares

See the full [comparison guide](./docs/COMPARISON.md) — Velvet Writer focuses on **fast setup**, **~55 KB minified bundle**, and a **premium UI** without extension hunting.

---

## 🤝 Support the project

- ⭐ [Star on GitHub](https://github.com/PoojaGohel/velvet-editor)
- 🐛 [Report a bug](https://github.com/PoojaGohel/velvet-editor/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/PoojaGohel/velvet-editor/issues/new?template=feature_request.md)
- ☕ [Sponsor on GitHub](https://github.com/sponsors/PoojaGohel)

---

## 📄 License

MIT © [Pooja Gohel](https://github.com/PoojaGohel)
