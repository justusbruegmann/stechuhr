// `src/components/CopyToClipboard.tsx` AI GENERATED!!! because just a QoL feature not needed
'use client';

import * as React from 'react';
import Image from 'next/image';

type Props = {
    text: string;
    className?: string;
};

export default function CopyToClipboard({text, className}: Props) {
    const [copied, setCopied] = React.useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        } catch {
            setCopied(false);
        }
    };

    return (
        <span
            className={className}
            style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}
        >
      <span style={{fontFamily: 'monospace', fontSize: '1rem'}}>{text}</span>

      <button
          type="button"
          onClick={copy}
          aria-label="Copy to clipboard"
          title={copied ? 'Copied' : 'Copy'}
          style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 0,
              padding: 0,
              cursor: 'pointer'
          }}
      >
        <Image src="/copy.svg" alt="copy" width={32} height={32} style={{filter: 'invert()'}}/>
      </button>

            {copied && <span style={{fontSize: '0.85rem'}}>Copied</span>}
    </span>
    );
}