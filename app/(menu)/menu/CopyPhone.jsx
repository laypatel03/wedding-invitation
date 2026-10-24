'use client';

import { useRef, useState } from 'react';

export default function CopyPhone({ phone }) {
  const [copied, setCopied] = useState(false);
  const phoneRef = useRef(null);

  function selectIt() {
    const r = document.createRange();
    r.selectNodeContents(phoneRef.current);
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  function copy() {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1600); };
    try {
      navigator.clipboard.writeText(phone).then(done).catch(selectIt);
    } catch (err) { selectIt(); }
  }

  return (
    <>
      <span ref={phoneRef}>{phone}</span>
      <button className="copy" type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
    </>
  );
}
