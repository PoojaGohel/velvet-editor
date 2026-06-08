import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { AdvanceTextEditor } from './Editor';

describe('AdvanceTextEditor', () => {
  it('renders the editor shell', () => {
    render(<AdvanceTextEditor placeholder="Write here…" />);
    expect(document.querySelector('.custom-editor-container')).toBeTruthy();
  });

  it('renders contenteditable area', () => {
    render(<AdvanceTextEditor initialValue="<p>Hello</p>" />);
    expect(document.querySelector('[contenteditable="true"]')).toBeTruthy();
  });
});
