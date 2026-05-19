import { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Link as LinkIcon, Outdent, Indent, ChevronDown,
  Superscript, Subscript, Palette, Highlighter, X, Check, Code, Type,
  Plus, Image as ImageIcon, Minus, Quote, Table as TableIcon, Maximize,
  Minimize, Undo, Redo, Eraser, BarChart, Copy, FileCode, HelpCircle, ALargeSmall,
  Smile
} from 'lucide-react';
export { EDITOR_VERSION } from './utils';
import { cn, COLORS, hexToRgb, FONTS, FONT_SIZES, EmojiTheme, EDITOR_VERSION } from './utils';
import './Editor.css';
import type { AdvanceTextEditorProps } from './types';

// Lazy load the heavy emoji picker library
const EmojiPicker = lazy(() => import('emoji-picker-react'));

export const AdvanceTextEditor = ({
  accentColor = '#a855f7',
  mode = 'dark',
  placeholder = 'Start typing your masterpiece...',
  onChange,
  className,
  variant = 'premium',
  minHeight,
  maxHeight,
  padding,
  fontSize,
  initialValue = '<p><br></p>'
}: AdvanceTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<Range | null>(null);

  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>('dark');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [currentFormat, setCurrentFormat] = useState('Paragraph');
  const [currentFont, setCurrentFont] = useState('Inter');
  const [currentFontSize, setCurrentFontSize] = useState('16px');
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [imgResize, setImgResize] = useState({ w: '', h: '' });
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });
  const [customTable, setCustomTable] = useState({ r: 3, c: 3 });
  const [showCustomTable, setShowCustomTable] = useState(false);
  const [isCodeView, setIsCodeView] = useState(false);
  const [htmlContent, setHtmlContent] = useState(initialValue);
  const [codeBackup, setCodeBackup] = useState('');
  const [codeFontSize, setCodeFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTextCaseDropdown, setShowTextCaseDropdown] = useState(false);
  const [showOrderedListDropdown, setShowOrderedListDropdown] = useState(false);
  const [showUnorderedListDropdown, setShowUnorderedListDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [helpActiveTab, setHelpActiveTab] = useState('shortcuts');
  const [customFontSizeInput, setCustomFontSizeInput] = useState('');
  const [stats, setStats] = useState({ words: 0, characters: 0 });
  const lastHtmlRef = useRef(htmlContent);


  const updateStats = useCallback((html: string) => {
    const text = html.replace(/<[^>]*>/g, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const characters = text.length;
    setStats({ words, characters });
  }, []);

  // Sync external initialValue changes (like dynamic value updates or resets) into editor
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== htmlContent) {
      setHtmlContent(initialValue);
      if (editorRef.current) {
        editorRef.current.innerHTML = initialValue;
        lastHtmlRef.current = initialValue;
        updateStats(initialValue);
      }
    }
  }, [initialValue, htmlContent, updateStats]);

  const updateActiveFormats = useCallback(() => {
    if (isCodeView || !editorRef.current) return;

    try {
      const formats = [];
      if (document.queryCommandState('bold')) formats.push('bold');
      if (document.queryCommandState('italic')) formats.push('italic');
      if (document.queryCommandState('underline')) formats.push('underline');
      if (document.queryCommandState('strikeThrough')) formats.push('strike');
      if (document.queryCommandState('subscript')) formats.push('sub');
      if (document.queryCommandState('superscript')) formats.push('super');

      if (document.queryCommandState('justifyCenter')) formats.push('center');
      else if (document.queryCommandState('justifyRight')) formats.push('right');
      else if (document.queryCommandState('justifyFull')) formats.push('full');
      else formats.push('left');

      setActiveFormats(formats);

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let container = range.commonAncestorContainer as HTMLElement;
        if (container.nodeType === 3) container = container.parentElement as HTMLElement;

        if (editorRef.current.contains(container)) {
          // Detect format
          const tag = container.closest('h1, h2, h3, h4, p, div')?.tagName;
          if (tag === 'H1') setCurrentFormat('Heading 1');
          else if (tag === 'H2') setCurrentFormat('Heading 2');
          else if (tag === 'H3') setCurrentFormat('Heading 3');
          else if (tag === 'H4') setCurrentFormat('Heading 4');
          else setCurrentFormat('Paragraph');

          // Detect font
          const style = window.getComputedStyle(container);
          const rawFont = style.fontFamily.toLowerCase();
          const foundFont = FONTS.find(f => {
            const fontName = f.name.toLowerCase();
            const fontValue = f.value.toLowerCase();
            return rawFont.includes(`"${fontName}"`) ||
              rawFont.includes(`'${fontName}'`) ||
              rawFont.includes(fontName) ||
              rawFont.includes(fontValue);
          });
          setCurrentFont(foundFont ? foundFont.name : 'Inter');

          // Detect Font Size
          const rawFontSize = document.queryCommandValue('fontSize');
          const foundSize = FONT_SIZES.find(s => s.value === rawFontSize);
          setCurrentFontSize(foundSize ? foundSize.name : '16px');

          // Detect Lists
          const parentList = container.closest('ol, ul');
          if (parentList) {
            formats.push(parentList.tagName === 'OL' ? 'orderedList' : 'unorderedList');
          }
          setActiveFormats([...formats]);
        }
      }

      // Update stats
      if (editorRef.current) {
        const text = editorRef.current.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        setStats({ words, characters });
      }
    } catch { }
  }, [isCodeView]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastHtmlRef.current = html;
      setHtmlContent(html);
      updateStats(html);
      if (onChange) onChange(html);
      updateActiveFormats();
    }
  }, [onChange, updateStats, setHtmlContent, updateActiveFormats]);

  // Sync htmlContent to editor DOM only if change came from outside (e.g. toolbar)
  useEffect(() => {
    if (editorRef.current && htmlContent !== lastHtmlRef.current) {
      editorRef.current.innerHTML = htmlContent;
      lastHtmlRef.current = htmlContent;
      updateStats(htmlContent);
    }
  }, [htmlContent, updateStats]);

  // Theme resolution logic
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };
    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedMode = mode === 'system' ? systemMode : mode;

  const isEditorEmpty = useMemo(() => {
    if (!htmlContent) return true;
    const trimmed = htmlContent.trim();
    return (
      trimmed === '' ||
      trimmed === '<p><br></p>' ||
      trimmed === '<p></p>' ||
      trimmed === '<div><br></div>' ||
      trimmed === '<div></div>' ||
      trimmed === '<br>'
    );
  }, [htmlContent]);

  const dynamicStyles = useMemo(() => {
    const styles = {
      '--editor-accent': accentColor,
      '--editor-accent-rgb': hexToRgb(accentColor),
      '--selection-bg': `${accentColor}40`, // 25% opacity
    } as React.CSSProperties & Record<string, string>;

    if (minHeight !== undefined) {
      styles['--editor-min-height'] = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
    }
    if (maxHeight !== undefined) {
      styles['--editor-max-height'] = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    }
    if (padding !== undefined) {
      styles['--editor-padding'] = padding;
      const parts = padding.trim().split(/\s+/);
      if (parts.length === 2) {
        styles['--editor-placeholder-top'] = parts[0];
        styles['--editor-placeholder-left'] = parts[1];
      } else if (parts.length === 4) {
        styles['--editor-placeholder-top'] = parts[0];
        styles['--editor-placeholder-left'] = parts[3];
      } else if (parts.length === 1) {
        styles['--editor-placeholder-top'] = parts[0];
        styles['--editor-placeholder-left'] = parts[0];
      }
    }
    if (fontSize !== undefined) {
      styles['--editor-font-size'] = fontSize;
    }

    return styles;
  }, [accentColor, minHeight, maxHeight, padding, fontSize]);

  // Helper to save selection before dropdowns open
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      // Only save if the selection is inside our editor
      if (editorRef.current && (editorRef.current.contains(range.commonAncestorContainer) || editorRef.current === range.commonAncestorContainer)) {
        selectionRef.current = range.cloneRange();
      }
    }
  };

  // Helper to restore selection before command
  const restoreSelection = () => {
    if (selectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(selectionRef.current);
      }
    }
  };
  const execCommand = (command: string, value: string | any = undefined) => {
    if (isCodeView) return;
    if (selectionRef.current) {
      restoreSelection();
      selectionRef.current = null;
    }
    if (editorRef.current) {
      editorRef.current.focus();
    }
    try {
      document.execCommand('styleWithCSS', false, 'true');
      const finalValue = command === 'fontName' ? (typeof value === 'string' && value.includes(' ') ? `'${value}'` : value) : value;
      document.execCommand(command, false, finalValue);
    } catch {
      console.warn('Command failed:', command);
    }
    updateActiveFormats();
  };

  const closeAllPopups = (except: string | null = null) => {
    if (except !== 'format') setShowFormatDropdown(false);
    if (except !== 'font') setShowFontDropdown(false);
    if (except !== 'fontSize') setShowFontSizeDropdown(false);
    if (except !== 'orderedList') setShowOrderedListDropdown(false);
    if (except !== 'unorderedList') setShowUnorderedListDropdown(false);
    if (except !== 'emoji') setShowEmojiPicker(false);
    if (except !== 'textCase') setShowTextCaseDropdown(false);
    if (except !== 'picker') setActivePicker(null);
  };

  const setFontSize = (size: string) => {
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      document.execCommand('fontSize', false, '3');
      const fontTags = editorRef.current?.querySelectorAll('font[size="3"]');
      fontTags?.forEach(tag => {
        const span = document.createElement('span');
        span.style.fontSize = size;
        span.innerHTML = tag.innerHTML;
        tag.parentNode?.replaceChild(span, tag);
      });
    } else {
      const span = document.createElement('span');
      span.style.fontSize = size;
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
      } catch {
        document.execCommand('insertHTML', false, `<span style="font-size: ${size}">${selection.toString()}</span>`);
      }
    }
    setCurrentFontSize(size);
    setShowFontSizeDropdown(false);
    handleInput();
  };

  const changeTextCase = (type: 'uppercase' | 'lowercase' | 'capitalize') => {
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const text = range.toString();
    if (!text) return;

    let newText = '';
    if (type === 'uppercase') newText = text.toUpperCase();
    else if (type === 'lowercase') newText = text.toLowerCase();
    else if (type === 'capitalize') {
      newText = text.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
    }

    document.execCommand('insertHTML', false, newText);
    setShowTextCaseDropdown(false);
    handleInput();
  };

  const applyCustomFontSize = () => {
    if (customFontSizeInput) {
      setFontSize(`${customFontSizeInput}px`);
      setCustomFontSizeInput('');
    }
  };

  const setListStyle = (type: 'ol' | 'ul', style: string) => {
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // First ensure we have a list
    const command = type === 'ol' ? 'insertOrderedList' : 'insertUnorderedList';
    document.execCommand(command, false, undefined);

    // Now find the parent list and apply style
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let list = range.commonAncestorContainer as HTMLElement;
      if (list.nodeType === 3) list = list.parentElement as HTMLElement;

      const parentList = list.closest(type);
      if (parentList) {
        (parentList as HTMLElement).style.listStyleType = style;
      }
    }

    setShowOrderedListDropdown(false);
    setShowUnorderedListDropdown(false);
    handleInput();
  };

  const insertEmoji = (emoji: string) => {
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('insertText', false, emoji);
    setShowEmojiPicker(false);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isCodeView) return;

    const isMod = e.ctrlKey || e.metaKey;

    // Bold (Ctrl+B)
    if (isMod && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      execCommand('bold');
    }
    // Italic (Ctrl+I)
    else if (isMod && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      execCommand('italic');
    }
    // Underline (Ctrl+U)
    else if (isMod && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      execCommand('underline');
    }
    // Strikethrough (Ctrl+Shift+X or Ctrl+S)
    else if (isMod && (e.key.toLowerCase() === 's' || (e.shiftKey && e.key.toLowerCase() === 'x'))) {
      e.preventDefault();
      execCommand('strikeThrough');
    }
    // Undo (Ctrl+Z)
    else if (isMod && !e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      execCommand('undo');
    }
    // Redo (Ctrl+Y or Ctrl+Shift+Z)
    else if (isMod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
      e.preventDefault();
      execCommand('redo');
    }
    // Tab (Indent/Outdent)
    else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        execCommand('outdent');
      } else {
        execCommand('indent');
      }
    }
    // Select All (Ctrl+A) - already handled by browser usually, but we can ensure selection state updates
    else if (isMod && e.key.toLowerCase() === 'a') {
      setTimeout(updateActiveFormats, 0);
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      requestAnimationFrame(updateActiveFormats);
    };
    document.addEventListener('selectionchange', handleSelectionChange);

    // Click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.format-dropdown-container') && !target.closest('.picker-popup')) {
        setShowFormatDropdown(false);
        setShowFontDropdown(false);
        setShowFontSizeDropdown(false);
        setActivePicker(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [updateActiveFormats]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = htmlContent;
    }
  }, []);

  const handleFormatChange = (format: string) => {
    if (format === 'H1') execCommand('formatBlock', 'h1');
    else if (format === 'H2') execCommand('formatBlock', 'h2');
    else if (format === 'H3') execCommand('formatBlock', 'h3');
    else if (format === 'H4') execCommand('formatBlock', 'h4');
    else execCommand('formatBlock', 'p');
    setShowFormatDropdown(false);
  };

  const handleFontSizeChange = (size: { name: string; value: string }) => {
    saveSelection();
    setFontSize(size.value);
  };

  const handleFontChange = (font: { name: string; value: string }) => {
    // Explicitly focus and ensure selection is preserved
    if (editorRef.current) editorRef.current.focus();
    execCommand('fontName', font.value);
    setCurrentFont(font.name);
    setShowFontDropdown(false);
  };

  const togglePicker = (picker: string) => {
    const nextState = activePicker === picker ? null : picker;
    closeAllPopups('picker');
    setActivePicker(nextState);
  };

  const clearFormatting = () => {
    if (isCodeView) return;
    if (selectionRef.current) {
      restoreSelection();
      selectionRef.current = null;
    }
    if (editorRef.current) editorRef.current.focus();

    // 1. Remove inline styles (bold, italic, color, font-family etc)
    document.execCommand('removeFormat', false, undefined);

    // 2. Reset block type to normal paragraph
    document.execCommand('formatBlock', false, 'p');

    updateActiveFormats();
  };

  const applyLink = () => {
    if (linkUrl) {
      // Ensure selection is valid
      restoreSelection();
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setActivePicker(null);
    }
  };

  const applyImage = () => {
    if (imageUrl) {
      restoreSelection();
      const w = imageWidth ? ` width="${imageWidth}"` : '';
      const h = imageHeight ? ` height="${imageHeight}"` : '';
      const style = (imageWidth || imageHeight)
        ? ` style="${imageWidth ? `width:${imageWidth}px;` : ''}${imageHeight ? `height:${imageHeight}px;` : ''}"`
        : '';
      execCommand('insertHTML', `<img src="${imageUrl}"${w}${h}${style} alt="" />`);
      setImageUrl('');
      setImageWidth('');
      setImageHeight('');
      setActivePicker(null);
    }
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      setSelectedImg(img);
      setImgResize({
        w: img.style.width ? img.style.width.replace('px', '') : (img.width ? String(img.width) : ''),
        h: img.style.height ? img.style.height.replace('px', '') : (img.height ? String(img.height) : ''),
      });
    } else {
      setSelectedImg(null);
    }
  };

  const applyImgResize = () => {
    if (!selectedImg) return;
    if (imgResize.w) {
      selectedImg.style.width = `${imgResize.w}px`;
      selectedImg.removeAttribute('width');
    }
    if (imgResize.h) {
      selectedImg.style.height = `${imgResize.h}px`;
      selectedImg.removeAttribute('height');
    }
    // trigger onChange
    if (editorRef.current && onChange) onChange(editorRef.current.innerHTML);
  };

  const insertTable = (rows: number, cols: number) => {
    restoreSelection();
    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;"><tbody>';
    for (let i = 0; i < rows; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHtml += '<td style="border: 1px solid #1e293b; padding: 8px; min-height: 1.5em;">&nbsp;</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    execCommand('insertHTML', tableHtml);
    setActivePicker(null);
    if (editorRef.current) editorRef.current.focus();
  };

  const toggleCodeView = () => {
    if (isCodeView) {
      setIsCodeView(false);
    } else {
      if (editorRef.current) {
        setCodeBackup(editorRef.current.innerHTML);
        setHtmlContent(editorRef.current.innerHTML);
      }
      setIsCodeView(true);
    }
  };

  const cancelCodeView = () => {
    setHtmlContent(codeBackup);
    setIsCodeView(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(htmlContent);
  };

  const formatCode = () => {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    htmlContent.split(/>\s*</).forEach((element) => {
      if (element.match(/^\/\w/)) indent--;
      formatted += tab.repeat(indent > 0 ? indent : 0) + '<' + element + '>\n';
      if (element.match(/^<?\w[^>]*[^/]$/) && !element.startsWith('input') && !element.startsWith('img') && !element.startsWith('br')) {
        indent++;
      }
    });
    setHtmlContent(formatted.substring(1, formatted.length - 2));
  };

  useEffect(() => {
    if (!isCodeView && editorRef.current) {
      editorRef.current.innerHTML = htmlContent;
    }
  }, [isCodeView]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !isCodeView) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            execCommand('bold');
            break;
          case 'i':
            e.preventDefault();
            execCommand('italic');
            break;
          case 'u':
            e.preventDefault();
            execCommand('underline');
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) execCommand('redo');
            else execCommand('undo');
            break;
          case 'y':
            e.preventDefault();
            execCommand('redo');
            break;
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCodeView]);

  return (
    <div
      className={cn(
        "custom-editor-container",
        variant === 'flat' && "flat",
        resolvedMode === 'light' && "light",
        isFullscreen && "fullscreen",
        isCodeView && "code-mode-active",
        className
      )}
      style={dynamicStyles}
    >
      <div className="custom-toolbar">
        {isCodeView ? (
          <div className="code-view-toolbar w-full flex justify-between items-center">
            <div className="toolbar-group">
              <ToolbarButton onClick={() => setIsFullscreen(!isFullscreen)} title="Fullscreen" icon={isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />} />
              <div className="toolbar-divider" />
              <ToolbarButton onClick={copyCode} title="Copy code" icon={<Copy size={18} />} />
              <ToolbarButton onClick={formatCode} title="Format code" icon={<FileCode size={18} />} />
              <div className="toolbar-divider" />
              <ToolbarButton onClick={() => setCodeFontSize(s => Math.min(s + 2, 30))} title="Increase font" icon={<div className="flex items-center text-[10px] font-bold">T<Plus size={8} /></div>} />
              <ToolbarButton onClick={() => setCodeFontSize(s => Math.max(s - 2, 10))} title="Decrease font" icon={<div className="flex items-center text-[10px] font-bold">T<Minus size={8} /></div>} />
            </div>

            <div className="toolbar-group">
              <button className="code-action-btn cancel" onClick={cancelCodeView}>
                <X size={14} className="mr-1.5" /> Cancel
              </button>
              <button className="code-action-btn save" onClick={() => setIsCodeView(false)}>
                <Check size={14} className="mr-1.5" /> Save code
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Undo / Redo */}
            <div className="toolbar-group">
              <ToolbarButton title="Undo (Ctrl+Z)" onClick={() => execCommand('undo')} icon={<Undo size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Redo (Ctrl+Y)" onClick={() => execCommand('redo')} icon={<Redo size={18} />} disabled={isCodeView} />
            </div>

            <div className="toolbar-divider" />

            {/* Block Type Dropdown */}
            <div className="toolbar-group">
              <div className="format-dropdown-container">
                <div
                  className="format-dropdown"
                  onMouseDown={(e) => { e.preventDefault(); if (!isCodeView) { saveSelection(); const next = !showFormatDropdown; closeAllPopups('format'); setShowFormatDropdown(next); } }}
                >
                  <span>{currentFormat}</span>
                  <ChevronDown size={14} className={cn("transition-transform", showFormatDropdown && "rotate-180")} />
                </div>
                {showFormatDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormatChange('Paragraph')}>Paragraph</div>
                    <div className="dropdown-item h1" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormatChange('H1')}>Heading 1</div>
                    <div className="dropdown-item h2" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormatChange('H2')}>Heading 2</div>
                    <div className="dropdown-item h3" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormatChange('H3')}>Heading 3</div>
                    <div className="dropdown-item h4" onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormatChange('H4')}>Heading 4</div>
                  </div>
                )}
              </div>
            </div>

            <div className="toolbar-divider" />

            {/* Font Family Dropdown */}
            <div className="toolbar-group">
              <div className="format-dropdown-container">
                <div
                  className="format-dropdown"
                  onMouseDown={(e) => { e.preventDefault(); if (!isCodeView) { saveSelection(); const next = !showFontDropdown; closeAllPopups('font'); setShowFontDropdown(next); } }}
                >
                  <Type size={16} className="mr-2" />
                  <span className="truncate max-w-[80px]">{currentFont}</span>
                  <ChevronDown size={14} className={cn("transition-transform", showFontDropdown && "rotate-180")} />
                </div>
                {showFontDropdown && (
                  <div className="dropdown-menu scrollable-menu">
                    {FONTS.map(font => (
                      <div
                        key={font.name}
                        className="dropdown-item"
                        style={{ fontFamily: font.value }}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleFontChange(font)}
                      >
                        {font.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="toolbar-divider" />

            {/* Font Size Dropdown */}
            <div className="toolbar-group">
              <div className="format-dropdown-container">
                <div
                  className="format-dropdown"
                  onMouseDown={(e) => { e.preventDefault(); if (!isCodeView) { saveSelection(); const next = !showFontSizeDropdown; closeAllPopups('fontSize'); setShowFontSizeDropdown(next); } }}
                >
                  <span className="truncate max-w-[60px]">{currentFontSize}</span>
                  <ChevronDown size={14} className={cn("transition-transform", showFontSizeDropdown && "rotate-180")} />
                </div>
                {showFontSizeDropdown && (
                  <div className="dropdown-menu p-0 overflow-hidden min-w-[120px]">
                    <div className="px-3 py-2 border-b border-editor-border bg-editor-toolbar flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="px"
                        className="custom-size-field"
                        value={customFontSizeInput}
                        onChange={(e) => setCustomFontSizeInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyCustomFontSize()}
                        onMouseDown={(e) => e.stopPropagation()}
                        min="1"
                        max="200"
                      />
                      <button
                        className="custom-size-apply"
                        onClick={applyCustomFontSize}
                      >
                        OK
                      </button>
                    </div>
                    <div className="max-h-[250px] overflow-auto">
                      {FONT_SIZES.map(size => (
                        <div
                          key={size.name}
                          className="dropdown-item"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleFontSizeChange(size)}
                        >
                          {size.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="toolbar-divider" />

            {/* Text Formats */}
            <div className="toolbar-group">
              <ToolbarButton title="Bold" active={activeFormats.includes('bold')} onClick={() => execCommand('bold')} icon={<Bold size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Italic" active={activeFormats.includes('italic')} onClick={() => execCommand('italic')} icon={<Italic size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Underline" active={activeFormats.includes('underline')} onClick={() => execCommand('underline')} icon={<Underline size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Strikethrough" active={activeFormats.includes('strike')} onClick={() => execCommand('strikeThrough')} icon={<Strikethrough size={18} />} disabled={isCodeView} />

              {/* Text Case Dropdown */}
              <div className="toolbar-divider" />
              <div className="toolbar-group">
                <div className="format-dropdown-container">
                  <ToolbarButton
                    title="Change Case"
                    active={showTextCaseDropdown}
                    onClick={() => { saveSelection(); const next = !showTextCaseDropdown; closeAllPopups('textCase'); setShowTextCaseDropdown(next); }}
                    icon={<ALargeSmall size={18} />}
                    disabled={isCodeView}
                  />
                  {showTextCaseDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-item" onMouseDown={(e) => e.preventDefault()} onClick={() => changeTextCase('uppercase')}>UPPERCASE</div>
                      <div className="dropdown-item" onMouseDown={(e) => e.preventDefault()} onClick={() => changeTextCase('lowercase')}>lowercase</div>
                      <div className="dropdown-item" onMouseDown={(e) => e.preventDefault()} onClick={() => changeTextCase('capitalize')}>Title Case</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <div className="format-dropdown-container">
                <ToolbarButton
                  title="Numbered List"
                  active={showOrderedListDropdown || activeFormats.includes('orderedList')}
                  onClick={() => { saveSelection(); const next = !showOrderedListDropdown; closeAllPopups('orderedList'); setShowOrderedListDropdown(next); }}
                  icon={<ListOrdered size={18} />}
                  disabled={isCodeView}
                />
                {showOrderedListDropdown && (
                  <div className="dropdown-menu list-picker-menu min-w-[220px]">
                    <div className="dropdown-header">Numbered List Styles</div>
                    <div className="list-type-grid">
                      <div className="list-type-card" onMouseDown={(e) => e.preventDefault()} onClick={() => setListStyle('ol', 'decimal')}>
                        <div className="list-icon-preview decimal">1</div>
                        <div className="list-info">
                          <span className="list-label">Decimal</span>
                          <span className="list-desc">1, 2, 3...</span>
                        </div>
                      </div>
                      <div className="list-type-card" onMouseDown={(e) => e.preventDefault()} onClick={() => setListStyle('ol', 'lower-alpha')}>
                        <div className="list-icon-preview alpha">a</div>
                        <div className="list-info">
                          <span className="list-label">Alpha Lower</span>
                          <span className="list-desc">a, b, c...</span>
                        </div>
                      </div>
                      <div className="list-type-card" onMouseDown={(e) => e.preventDefault()} onClick={() => setListStyle('ol', 'upper-alpha')}>
                        <div className="list-icon-preview alpha-upper">A</div>
                        <div className="list-info">
                          <span className="list-label">Alpha Upper</span>
                          <span className="list-desc">A, B, C...</span>
                        </div>
                      </div>
                      <div className="list-type-card" onMouseDown={(e) => e.preventDefault()} onClick={() => setListStyle('ol', 'lower-roman')}>
                        <div className="list-icon-preview roman">i</div>
                        <div className="list-info">
                          <span className="list-label">Roman Lower</span>
                          <span className="list-desc">i, ii, iii...</span>
                        </div>
                      </div>
                      <div className="list-type-card" onMouseDown={(e) => e.preventDefault()} onClick={() => setListStyle('ol', 'upper-roman')}>
                        <div className="list-icon-preview roman-upper">I</div>
                        <div className="list-info">
                          <span className="list-label">Roman Upper</span>
                          <span className="list-desc">I, II, III...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="format-dropdown-container">
                <ToolbarButton
                  title="Bullet List"
                  active={showUnorderedListDropdown || activeFormats.includes('unorderedList')}
                  onClick={() => { saveSelection(); const next = !showUnorderedListDropdown; closeAllPopups('unorderedList'); setShowUnorderedListDropdown(next); }}
                  icon={<List size={18} />}
                  disabled={isCodeView}
                />
                {showUnorderedListDropdown && (
                  <div className="dropdown-menu list-picker-menu min-w-[200px]">
                    <div className="dropdown-header">Bullet List Styles</div>
                    <div className="list-type-grid">
                      <div className="list-type-card" onMouseDown={(e) => e.preventDefault()} onClick={() => setListStyle('ul', 'disc')}>
                        <div className="list-icon-preview dot">●</div>
                        <div className="list-info">
                          <span className="list-label">Default Disc</span>
                          <span className="list-desc">Solid bullet</span>
                        </div>
                      </div>
                      <div className="list-type-card" onMouseDown={(e) => e.preventDefault()} onClick={() => setListStyle('ul', 'circle')}>
                        <div className="list-icon-preview circle">○</div>
                        <div className="list-info">
                          <span className="list-label">Hollow Circle</span>
                          <span className="list-desc">Outlined bullet</span>
                        </div>
                      </div>
                      <div className="list-type-card" onMouseDown={(e) => e.preventDefault()} onClick={() => setListStyle('ul', 'square')}>
                        <div className="list-icon-preview square">■</div>
                        <div className="list-info">
                          <span className="list-label">Solid Square</span>
                          <span className="list-desc">Square bullet</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <ToolbarButton title="Blockquote" onClick={() => execCommand('formatBlock', 'blockquote')} icon={<Quote size={18} />} disabled={isCodeView} />
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <ToolbarButton title="Subscript" active={activeFormats.includes('sub')} onClick={() => execCommand('subscript')} icon={<Subscript size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Superscript" active={activeFormats.includes('super')} onClick={() => execCommand('superscript')} icon={<Superscript size={18} />} disabled={isCodeView} />
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <ToolbarButton title="Outdent" onClick={() => execCommand('outdent')} icon={<Outdent size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Indent" onClick={() => execCommand('indent')} icon={<Indent size={18} />} disabled={isCodeView} />
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <ToolbarButton title="Align Left" active={activeFormats.includes('left')} onClick={() => execCommand('justifyLeft')} icon={<AlignLeft size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Align Center" active={activeFormats.includes('center')} onClick={() => execCommand('justifyCenter')} icon={<AlignCenter size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Align Right" active={activeFormats.includes('right')} onClick={() => execCommand('justifyRight')} icon={<AlignRight size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Justify" active={activeFormats.includes('full')} onClick={() => execCommand('justifyFull')} icon={<AlignJustify size={18} />} disabled={isCodeView} />
            </div>

            <div className="toolbar-divider" />

            {/* Colors */}
            <div className="toolbar-group relative">
              <ToolbarButton title="Text Color" active={activePicker === 'color'} onClick={() => { saveSelection(); togglePicker('color'); }} icon={<Palette size={18} />} disabled={isCodeView} />
              {activePicker === 'color' && !isCodeView && (
                <div className="picker-popup color-picker-wrapper">
                  <div className="color-grid">
                    {COLORS.map(c => (
                      <div key={c} className="color-swatch" style={{ background: c }} onMouseDown={(e) => e.preventDefault()} onClick={() => { execCommand('foreColor', c); setActivePicker(null); }} />
                    ))}
                    <div className="color-swatch custom-color-trigger" onMouseDown={(e) => e.preventDefault()} onClick={() => colorInputRef.current?.click()}>
                      <Plus size={14} />
                    </div>
                  </div>
                  <input ref={colorInputRef} type="color" className="hidden-color-input" onChange={(e) => { execCommand('foreColor', e.target.value); setActivePicker(null); }} />
                </div>
              )}

              <ToolbarButton title="Background Color" active={activePicker === 'bg'} onClick={() => { saveSelection(); togglePicker('bg'); }} icon={<Highlighter size={18} />} disabled={isCodeView} />
              {activePicker === 'bg' && !isCodeView && (
                <div className="picker-popup color-picker-wrapper">
                  <div className="color-grid">
                    {COLORS.map(c => (
                      <div key={c} className="color-swatch" style={{ background: c }} onMouseDown={(e) => e.preventDefault()} onClick={() => { execCommand('hiliteColor', c); setActivePicker(null); }} />
                    ))}
                    <div className="color-swatch custom-color-trigger" onMouseDown={(e) => e.preventDefault()} onClick={() => bgInputRef.current?.click()}>
                      <Plus size={14} />
                    </div>
                  </div>
                  <input ref={bgInputRef} type="color" className="hidden-color-input" onChange={(e) => { execCommand('hiliteColor', e.target.value); setActivePicker(null); }} />
                </div>
              )}
            </div>

            <div className="toolbar-divider" />

            {/* Link / Image / Table / HR */}
            <div className="toolbar-group relative">
              <ToolbarButton title="Insert Link" active={activePicker === 'link'} onClick={() => { saveSelection(); togglePicker('link'); }} icon={<LinkIcon size={18} />} disabled={isCodeView} />
              {activePicker === 'link' && !isCodeView && (
                <div className="picker-popup link-picker">
                  <input autoFocus placeholder="https://example.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyLink()} />
                  <button onClick={applyLink} className="confirm-btn"><Check size={14} /></button>
                  <button onClick={() => setActivePicker(null)} className="cancel-btn"><X size={14} /></button>
                </div>
              )}

              <ToolbarButton title="Insert Image" active={activePicker === 'image'} onClick={() => { saveSelection(); togglePicker('image'); }} icon={<ImageIcon size={18} />} disabled={isCodeView} />
              {activePicker === 'image' && !isCodeView && (
                <div className="picker-popup image-picker">
                  {/* Header */}
                  <div className="image-picker-header">
                    <div className="image-picker-header-icon">
                      <ImageIcon size={14} />
                    </div>
                    <h4>Insert Image</h4>
                  </div>

                  {/* Body */}
                  <div className="image-picker-body">
                    <div className="image-input-group">
                      <span className="image-input-label">Image URL</span>
                      <input
                        autoFocus
                        className="image-url-input"
                        placeholder="https://example.com/image.png"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyImage()}
                      />
                    </div>

                    <div className="image-dimension-row">
                      <div className="image-dim-field">
                        <label>Width</label>
                        <input
                          type="number"
                          className="image-dim-input"
                          placeholder="auto"
                          value={imageWidth}
                          onChange={(e) => setImageWidth(e.target.value)}
                          min="1"
                        />
                      </div>
                      <span className="dim-separator">&times;</span>
                      <div className="image-dim-field">
                        <label>Height</label>
                        <input
                          type="number"
                          className="image-dim-input"
                          placeholder="auto"
                          value={imageHeight}
                          onChange={(e) => setImageHeight(e.target.value)}
                          min="1"
                        />
                      </div>
                    </div>
                    <span className="image-dim-hint">Leave blank to use natural image size</span>
                  </div>

                  {/* Footer */}
                  <div className="image-picker-footer">
                    <button onClick={() => setActivePicker(null)} className="image-cancel-btn">
                      <X size={13} /> Cancel
                    </button>
                    <button onClick={applyImage} className="image-insert-btn">
                      <Check size={13} /> Insert Image
                    </button>
                  </div>
                </div>
              )}

              <ToolbarButton title="Insert Table" active={activePicker === 'table'} onClick={() => { saveSelection(); togglePicker('table'); setShowCustomTable(false); }} icon={<TableIcon size={18} />} disabled={isCodeView} />
              {activePicker === 'table' && !isCodeView && (
                <div className="picker-popup table-picker" onMouseLeave={() => !showCustomTable && setTableHover({ r: 0, c: 0 })}>
                  {!showCustomTable ? (
                    <>
                      <div className="table-grid-selector">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(r => (
                          <div key={r} className="table-row-preview">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(c => (
                              <div
                                key={c}
                                className={cn("table-cell-preview", r <= tableHover.r && c <= tableHover.c && "active")}
                                onMouseEnter={() => setTableHover({ r, c })}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => insertTable(r, c)}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="table-picker-info">
                        {tableHover.r > 0 ? `${tableHover.r} x ${tableHover.c} Table` : "Select rows x columns"}
                      </div>
                      <button className="custom-table-toggle" onClick={() => setShowCustomTable(true)}>
                        Custom Size...
                      </button>
                    </>
                  ) : (
                    <div className="custom-table-form">
                      <div className="custom-table-inputs">
                        <div className="input-field">
                          <label>Rows</label>
                          <input type="number" min="1" max="50" value={customTable.r} onChange={(e) => setCustomTable({ ...customTable, r: parseInt(e.target.value) || 1 })} />
                        </div>
                        <div className="input-field">
                          <label>Cols</label>
                          <input type="number" min="1" max="20" value={customTable.c} onChange={(e) => setCustomTable({ ...customTable, c: parseInt(e.target.value) || 1 })} />
                        </div>
                      </div>
                      <div className="custom-table-actions">
                        <button className="back-btn" onClick={() => setShowCustomTable(false)}>Back</button>
                        <button className="insert-btn" onClick={() => insertTable(customTable.r, customTable.c)}>Insert</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <ToolbarButton title="Horizontal Rule" onClick={() => execCommand('insertHorizontalRule')} icon={<Minus size={18} />} disabled={isCodeView} />

              <div className="format-dropdown-container">
                <ToolbarButton
                  title="Emoji"
                  active={showEmojiPicker}
                  onClick={() => { saveSelection(); const next = !showEmojiPicker; closeAllPopups('emoji'); setShowEmojiPicker(next); }}
                  icon={<Smile size={18} />}
                  disabled={isCodeView}
                />
                {showEmojiPicker && (
                  <div className="dropdown-menu emoji-picker-wrapper p-0 overflow-hidden">
                    <Suspense fallback={
                      <div className="flex items-center justify-center w-[350px] h-[450px] bg-editor-bg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-editor-accent"></div>
                      </div>
                    }>
                      <EmojiPicker
                        theme={(resolvedMode === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT) as any}
                        onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)}
                        width="350px"
                        height="450px"
                        lazyLoadEmojis={true}
                        skinTonesDisabled={false}
                        searchPlaceholder="Search emojis..."
                      />
                    </Suspense>
                  </div>
                )}
              </div>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <ToolbarButton title="Clear Formatting" onClick={clearFormatting} icon={<Eraser size={18} />} disabled={isCodeView} />
              <ToolbarButton title="Toggle Code View" active={isCodeView} onClick={toggleCodeView} icon={<Code size={18} />} />
              <ToolbarButton title="Fullscreen" onClick={() => setIsFullscreen(!isFullscreen)} icon={isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />} />
              <ToolbarButton title="Help" onClick={() => setShowHelpModal(true)} icon={<HelpCircle size={18} />} />
            </div>
          </>
        )}
      </div>

      <div className={cn("editor-scroller", isFullscreen && "flex-grow overflow-auto")}>
        {isCodeView ? (
          <textarea
            className="custom-code-view"
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            style={{ fontSize: `${codeFontSize}px` }}
            spellCheck="false"
          />
        ) : (
          <>
            {/* Floating image resize panel */}
            {selectedImg && (
              <div className="img-resize-panel">
                <span className="img-resize-label">
                  <span className="img-resize-dot" />
                  Resize Image
                </span>
                <div className="img-resize-inputs">
                  <div className="img-resize-field">
                    <span>W</span>
                    <input
                      type="number"
                      min="1"
                      value={imgResize.w}
                      onChange={(e) => setImgResize(r => ({ ...r, w: e.target.value }))}
                      placeholder="px"
                    />
                  </div>
                  <span className="img-resize-sep">&times;</span>
                  <div className="img-resize-field">
                    <span>H</span>
                    <input
                      type="number"
                      min="1"
                      value={imgResize.h}
                      onChange={(e) => setImgResize(r => ({ ...r, h: e.target.value }))}
                      placeholder="px"
                    />
                  </div>
                </div>
                <div className="img-resize-actions">
                  <button className="img-resize-apply" onClick={applyImgResize}><Check size={12} /> Apply</button>
                  <button className="img-resize-close" onClick={() => setSelectedImg(null)}><X size={12} /></button>
                </div>
              </div>
            )}
            <div
              ref={editorRef}
              className={cn("custom-editable", isEditorEmpty && "is-empty")}
              contentEditable={!isCodeView}
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onMouseUp={updateActiveFormats}
              onKeyUp={updateActiveFormats}
              onBlur={saveSelection}
              onClick={handleEditorClick}
              data-placeholder={placeholder}
            />
          </>
        )}
      </div>

      {/* Status Bar */}
      <div className="custom-status-bar">
        <div className="status-item">
          <div className="status-badge">
            <BarChart size={12} className="mr-1.5" />
            Words: <b>{stats.words}</b>
          </div>
          <div className="status-divider" />
          <div className="status-badge">
            <Type size={12} className="mr-1.5" />
            Chars: <b>{stats.characters}</b>
          </div>
        </div>

        <div className="status-brand">
          <div className="brand-dot" />
          <span>VELVET EDITOR</span>
        </div>

        <div className="status-item">
          <div className="mode-indicator">
            <div className={cn("mode-dot", isCodeView && "active")} />
            {isCodeView ? "HTML Mode" : "Rich Text Mode"}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="help-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="help-modal-content enhanced-help" onClick={e => e.stopPropagation()}>
            <div className="help-modal-header">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-editor-accent" />
                <h2>Help Center</h2>
              </div>
              <button className="cancel-btn" onClick={() => setShowHelpModal(false)}><X size={20} /></button>
            </div>

            <div className="help-modal-main">
              {/* Tabs Sidebar */}
              <div className="help-tabs">
                <button className={cn("help-tab-btn", helpActiveTab === 'shortcuts' && "active")} onClick={() => setHelpActiveTab('shortcuts')}>
                  Handy Shortcuts
                </button>
                <button className={cn("help-tab-btn", helpActiveTab === 'navigation' && "active")} onClick={() => setHelpActiveTab('navigation')}>
                  Keyboard Navigation
                </button>
                <button className={cn("help-tab-btn", helpActiveTab === 'features' && "active")} onClick={() => setHelpActiveTab('features')}>
                  Advanced Features
                </button>
                <button className={cn("help-tab-btn", helpActiveTab === 'about' && "active")} onClick={() => setHelpActiveTab('about')}>
                  About Velvet
                </button>
              </div>

              {/* Tab Content */}
              <div className="help-content-area">
                {helpActiveTab === 'shortcuts' && (
                  <div className="help-tab-content">
                    <h3>Essential Shortcuts</h3>
                    <div className="shortcut-grid">
                      <div className="shortcut-row"><span>Bold</span> <kbd>Ctrl + B</kbd></div>
                      <div className="shortcut-row"><span>Italic</span> <kbd>Ctrl + I</kbd></div>
                      <div className="shortcut-row"><span>Underline</span> <kbd>Ctrl + U</kbd></div>
                      <div className="shortcut-row"><span>Strikethrough</span> <kbd>Ctrl + S</kbd></div>
                      <div className="shortcut-row"><span>Undo</span> <kbd>Ctrl + Z</kbd></div>
                      <div className="shortcut-row"><span>Redo</span> <kbd>Ctrl + Y</kbd></div>
                      <div className="shortcut-row"><span>Select All</span> <kbd>Ctrl + A</kbd></div>
                      <div className="shortcut-row"><span>Insert Link</span> <kbd>Ctrl + K</kbd></div>
                    </div>
                  </div>
                )}

                {helpActiveTab === 'navigation' && (
                  <div className="help-tab-content">
                    <h3>Keyboard Navigation</h3>
                    <div className="navigation-list">
                      <div className="nav-item">
                        <kbd>Tab</kbd>
                        <p>Indent list item or create nested list.</p>
                      </div>
                      <div className="nav-item">
                        <kbd>Shift + Tab</kbd>
                        <p>Outdent list item or remove nesting.</p>
                      </div>
                      <div className="nav-item">
                        <kbd>Alt + 0</kbd>
                        <p>Quickly open this help dialog.</p>
                      </div>
                      <div className="nav-item">
                        <kbd>Alt + F10</kbd>
                        <p>Focus the toolbar for keyboard access.</p>
                      </div>
                    </div>
                  </div>
                )}

                {helpActiveTab === 'features' && (
                  <div className="help-tab-content">
                    <h3>Advanced Capabilities</h3>
                    <div className="feature-showcase">
                      <div className="feature-item">
                        <strong>Pixel Typography</strong>
                        <p>Bypass standard font scales with our custom PX input. Enter any value from 1 to 200px for pixel-perfect design.</p>
                      </div>
                      <div className="feature-item">
                        <strong>Dynamic Image Resizing</strong>
                        <p>Select any image to reveal an interactive resize panel. Adjust dimensions in real-time without leaving the editor.</p>
                      </div>
                      <div className="feature-item">
                        <strong>Advanced Lists</strong>
                        <p>Choose from Roman, Alpha, and various bullet styles. Use the dropdown arrows next to list icons for more options.</p>
                      </div>
                    </div>
                  </div>
                )}

                {helpActiveTab === 'about' && (
                  <div className="help-tab-content about-velvet">
                    <h3>Velvet Editor v{EDITOR_VERSION}</h3>
                    <p>A premium rich-text editing experience built with React and precision styling.</p>
                    <div className="brand-stats">
                      <div className="stat"><span>Performance</span> <b>99%</b></div>
                      <div className="stat"><span>Accessibility</span> <b>WCAG 2.1</b></div>
                      <div className="stat"><span>Engine</span> <b>Velvet-Core</b></div>
                    </div>
                    <p className="mt-4 text-xs opacity-50">© 2024 Velvet Writing Systems. All rights reserved.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="help-modal-footer">
              <button className="close-help-btn" onClick={() => setShowHelpModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ToolbarButton = ({ active, onClick, icon, title, disabled }: { active?: boolean; onClick: () => void; icon: React.ReactNode; title: string; disabled?: boolean }) => (
  <button
    title={title}
    disabled={disabled}
    className={cn("custom-toolbar-btn", active && "active", disabled && "opacity-30 cursor-not-allowed")}
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
  >
    {icon}
  </button>
);
