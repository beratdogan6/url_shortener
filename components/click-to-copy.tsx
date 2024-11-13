"use client"

import React, { useState } from 'react';

type ClickToCopyProps = {
  text: string;
};

const ClickToCopy: React.FC<ClickToCopyProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <span
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Click to copy'}
      className='cursor-pointer'
    >
      {text}
    </span>
  );
};

export default ClickToCopy;