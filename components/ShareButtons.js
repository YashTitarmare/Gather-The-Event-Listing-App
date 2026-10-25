'use client';
import { useState } from 'react';

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(`${title} ${url}`);
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch {}
  }
  return (
    <div className="row">
      <a className="btn ghost sm" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${text}`}>Share on WhatsApp</a>
      <a className="btn ghost sm" href={`mailto:?subject=${encodeURIComponent(title)}&body=${text}`}>Email a friend</a>
      <button className="btn ghost sm" onClick={share}>{copied ? 'Link copied' : 'Copy link'}</button>
    </div>
  );
}
