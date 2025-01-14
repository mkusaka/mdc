"use client";

import { useState } from "react";

export function MarkdownView({ markdown }: { markdown: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Markdown
        </h2>
        <button
          onClick={handleCopy}
          className={`
            px-4 py-2 text-sm rounded transition-all duration-200 focus:outline-none focus:ring-2
            ${isCopied 
              ? "bg-green-100 text-green-700 focus:ring-green-300" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300"
            }
          `}
        >
          {isCopied ? "コピーしました！" : "コピー"}
        </button>
      </div>
      <pre className="p-4 bg-gray-50 rounded-lg overflow-auto text-gray-700 font-mono text-sm whitespace-pre-wrap">
        {markdown}
      </pre>
    </div>
  );
} 
