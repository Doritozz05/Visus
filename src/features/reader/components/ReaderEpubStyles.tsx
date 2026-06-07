import * as React from "react";

export function ReaderEpubStyles() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        .epub-content {
          font-family: var(--font-serif, serif);
          color: hsl(var(--foreground));
        }

        /* General reset for direct block tags inside columns to prevent clipping at the column edges */
        .epub-content > * {
          padding-left: 6px;
          padding-right: 6px;
          box-sizing: border-box;
        }
        
        .epub-content > *:last-child {
          margin-bottom: 0 !important;
        }

        .epub-content h1, .epub-content h2, .epub-content h3, .epub-content h4, .epub-content h5, .epub-content h6 {
          color: hsl(var(--primary));
          font-family: var(--font-heading, inherit);
          font-weight: 700;
          margin-top: 1.2em;
          margin-bottom: 0.6em;
          line-height: 1.25;
          break-inside: avoid-column;
          column-break-inside: avoid;
          break-after: avoid;
          column-break-after: avoid;
        }
        .epub-content h1 { font-size: 1.65em; }
        .epub-content h2 { font-size: 1.45em; }
        .epub-content h3 { font-size: 1.25em; }
        
        /* Spaced paragraphs for divisions and text segments */
        .epub-content p {
          margin-bottom: 1em;
          text-align: justify;
          line-height: 1.75;
          text-indent: 1.5em;
          /* Defensive column wrapping protection - absolutely zero cuts between pages! */
          break-inside: avoid-column;
          column-break-inside: avoid;
          page-break-inside: avoid;
        }
        
        /* Space bare div tags that act as paragraphs in Project Gutenberg EPUBs */
        .epub-content div:not(:empty) {
          margin-bottom: 0.8rem;
          line-height: 1.75;
          text-align: justify;
          break-inside: avoid-column;
          column-break-inside: avoid;
        }
        
        .epub-content p:first-of-type, 
        .epub-content h1 + p, 
        .epub-content h2 + p, 
        .epub-content h3 + p,
        .epub-content div + p {
          text-indent: 0;
        }
        
        .epub-content img {
          max-width: 100%;
          max-height: 280px;
          height: auto;
          object-fit: contain;
          display: block;
          margin: 1.5em auto;
          border-radius: 0.5rem;
          break-inside: avoid;
          column-break-inside: avoid;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .epub-content ul {
          list-style-type: disc;
          margin-bottom: 1em;
          padding-left: 2em;
          break-inside: avoid-column;
          column-break-inside: avoid;
        }
        
        .epub-content ol {
          list-style-type: decimal;
          margin-bottom: 1em;
          padding-left: 2em;
          break-inside: avoid-column;
          column-break-inside: avoid;
        }
        
        .epub-content li {
          margin-bottom: 0.5em;
          line-height: 1.6;
          break-inside: avoid-column;
          column-break-inside: avoid;
        }
        
        .epub-content blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 1.2em;
          margin: 1.5em 0;
          color: hsl(var(--muted-foreground));
          font-style: italic;
          break-inside: avoid-column;
          column-break-inside: avoid;
        }
        
        .epub-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
          font-size: 0.9em;
          break-inside: avoid-column;
          column-break-inside: avoid;
        }
        
        .epub-content th, .epub-content td {
          border: 1px solid hsl(var(--border));
          padding: 0.6em;
          text-align: left;
        }
        
        .epub-content th {
          background-color: hsl(var(--accent));
          font-weight: 700;
        }
        
        /* Defensive links styles - completely overrides visited link purple and underline! */
        .epub-content a, .epub-content a:visited, .epub-content a:hover, .epub-content a:active {
          color: inherit !important;
          text-decoration: none !important;
          cursor: text !important;
          pointer-events: none !important;
        }
      `
    }} />
  );
}
