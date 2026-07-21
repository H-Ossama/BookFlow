import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import type { WebsiteSection, WebsiteTheme } from '../../types/website.types';
import { renderSection } from './sections';

interface PreviewFrameProps {
  sections: WebsiteSection[];
  theme: WebsiteTheme;
  deviceWidth: number;
}

export function PreviewFrame({ sections, theme, deviceWidth }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const visible = sections.filter((s) => s.isVisible !== false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${deviceWidth}, initial-scale=1.0">
  <style>
    body { margin: 0; background: #0a0c10; -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  <div id="root"></div>
</body>
</html>`);
    doc.close();

    // Copy all stylesheets from parent page so Tailwind classes work inside iframe
    const copyStyles = () => {
      const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
      parentStyles.forEach((el) => {
        try {
          const clone = el.cloneNode(true);
          doc.head.appendChild(clone);
        } catch {
          // skip cross-origin stylesheets
        }
      });
    };
    copyStyles();

    setPortalTarget(doc.getElementById('root'));
  }, [deviceWidth]);

  return (
    <div className="flex-1 flex justify-center bg-[#0a0c10] overflow-y-auto">
      <div
        className="shrink-0"
        style={{ width: deviceWidth, maxWidth: '100%' }}
      >
        <iframe
          ref={iframeRef}
          style={{
            width: '100%',
            height: 'calc(100vh - 64px)',
            border: 'none',
            display: 'block',
          }}
          title="Preview"
        />
      </div>
      {portalTarget &&
        createPortal(
          <MemoryRouter>
            <div style={{ minHeight: '100vh', background: '#0a0c10' }}>
              {visible.map((s) => (
                <div key={s.id}>
                  {renderSection(s.sectionType, s.layoutVariant, s.content, theme)}
                </div>
              ))}
            </div>
          </MemoryRouter>,
          portalTarget,
        )}
    </div>
  );
}
