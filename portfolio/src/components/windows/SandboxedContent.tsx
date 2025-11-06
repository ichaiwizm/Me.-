import React, { useEffect, useRef } from "react";

type Props = {
  html: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function SandboxedContent({ html, className, style }: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    iframeRef.current.srcdoc = html;
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title="window-content"
      sandbox="allow-scripts allow-forms allow-pointer-lock allow-popups"
      className={className}
      style={{ width: "100%", height: "100%", border: 0, ...style }}
    />
  );
}


