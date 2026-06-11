"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Sparkles, Send, Trash2, FileText, Check, Copy, Download, Printer, Briefcase, ChevronDown } from "lucide-react";

const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const cleanText = text.replace(/\r\n/g, "\n");
  const blocks = cleanText.split(/\n{2,}/);

  const formatInline = (str: string) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-extrabold text-zinc-100">
            {formatItalics(boldText)}
          </strong>
        );
      }
      return <span key={index}>{formatItalics(part)}</span>;
    });
  };

  const formatItalics = (str: string) => {
    const parts = str.split(/(\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={index} className="italic text-purple-300 not-italic font-medium">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4 whitespace-pre-wrap">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.includes("\n") && (trimmed.match(/^\d+\.\s/m) || trimmed.match(/^[-*]\s/m))) {
          const lines = trimmed.split("\n");
          return (
            <div key={bIdx} className="space-y-3 my-2">
              {lines.map((line, lIdx) => {
                const lineTrimmed = line.trim();
                const numMatch = lineTrimmed.match(/^(\d+)\.\s+(.*)$/);
                if (numMatch) {
                  return (
                    <div key={lIdx} className="flex gap-3 items-start pl-1">
                      <span className="text-purple-400 font-extrabold text-xs sm:text-sm shrink-0 min-w-[20px] text-right mt-0.5">
                        {numMatch[1]}.
                      </span>
                      <div className="flex-1 text-zinc-250 leading-relaxed text-xs sm:text-sm">
                        {formatInline(numMatch[2])}
                      </div>
                    </div>
                  );
                }
                const bulletMatch = lineTrimmed.match(/^[-*]\s+(.*)$/);
                if (bulletMatch) {
                  return (
                    <div key={lIdx} className="flex gap-3 items-start pl-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-2" />
                      <div className="flex-1 text-zinc-250 leading-relaxed text-xs sm:text-sm">
                        {formatInline(bulletMatch[1])}
                      </div>
                    </div>
                  );
                }
                return (
                  <p key={lIdx} className="text-zinc-250 leading-relaxed text-xs sm:text-sm pl-6">
                    {formatInline(line)}
                  </p>
                );
              })}
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={bIdx} className="flex gap-3 items-start pl-1 my-2">
              <span className="text-purple-400 font-extrabold text-xs sm:text-sm shrink-0 min-w-[20px] text-right mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="flex-1 text-zinc-250 leading-relaxed text-xs sm:text-sm">
                {formatInline(numMatch[2])}
              </div>
            </div>
          );
        }

        const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
        if (bulletMatch) {
          return (
            <div key={bIdx} className="flex gap-3 items-start pl-2 my-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-2" />
              <div className="flex-1 text-zinc-250 leading-relaxed text-xs sm:text-sm">
                {formatInline(bulletMatch[1])}
              </div>
            </div>
          );
        }

        return (
          <p key={bIdx} className="text-zinc-250 leading-relaxed text-xs sm:text-sm">
            {formatInline(block)}
          </p>
        );
      })}
    </div>
  );
};

export interface ResumeStyleOptions {
  themeColor: "slate" | "emerald" | "royal" | "purple" | "monochrome";
  fontFamily: "sans" | "serif" | "mono";
  spacing: "compact" | "normal" | "spacious";
}

const RenderStyledDocument: React.FC<{ text: string; options: ResumeStyleOptions }> = ({ text, options }) => {
  const fontClass = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono"
  }[options.fontFamily];

  const spacingClass = {
    compact: "space-y-2.5 p-6 text-xs",
    normal: "space-y-4 p-8 sm:p-10 text-sm",
    spacious: "space-y-6 p-10 sm:p-12 text-base"
  }[options.spacing];

  const themeColors = {
    slate: { primary: "text-slate-800", accent: "text-sky-600", border: "border-slate-200", line: "bg-sky-600" },
    emerald: { primary: "text-emerald-900", accent: "text-emerald-600", border: "border-emerald-100", line: "bg-emerald-600" },
    royal: { primary: "text-blue-900", accent: "text-blue-600", border: "border-blue-100", line: "bg-blue-600" },
    purple: { primary: "text-purple-950", accent: "text-purple-600", border: "border-purple-100", line: "bg-purple-600" },
    monochrome: { primary: "text-zinc-950", accent: "text-zinc-700", border: "border-zinc-200", line: "bg-zinc-900" }
  }[options.themeColor];

  const cleanText = text.replace(/\r\n/g, "\n");
  const lines = cleanText.split("\n");

  const parseInlineFormatting = (str: string) => {
    const boldParts = str.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((part, bIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={bIdx} className="font-extrabold text-zinc-900">
            {parseItalics(boldText)}
          </strong>
        );
      }
      return <span key={bIdx}>{parseItalics(part)}</span>;
    });
  };

  const parseItalics = (str: string) => {
    const parts = str.split(/(\*[^*]+\*)/g);
    return parts.map((part, iIdx) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={iIdx} className="italic text-zinc-700">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className={`bg-white text-zinc-800 ${fontClass} ${spacingClass} rounded-2xl shadow-2xl transition-all duration-300 text-left`} style={{ minHeight: "297mm" }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${themeColors.primary} border-b-2 ${themeColors.border} pb-2 mb-2`}>
              {trimmed.substring(2)}
            </h1>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className={`text-sm sm:text-md font-extrabold tracking-wider uppercase ${themeColors.accent} mt-6 mb-2 flex items-center gap-2 border-b ${themeColors.border} pb-1`}>
              {trimmed.substring(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-xs sm:text-sm font-bold text-zinc-900 mt-3 mb-0.5">
              {trimmed.substring(4)}
            </h3>
          );
        }

        if (trimmed === "---") {
          return <hr key={idx} className={`border-t ${themeColors.border} my-4`} />;
        }

        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          return (
            <div key={idx} className="flex gap-2.5 items-start pl-2 text-zinc-650 leading-relaxed text-xs sm:text-sm my-1">
              <span className={`w-1.5 h-1.5 rounded-full ${themeColors.line} shrink-0 mt-2`} />
              <div className="flex-1">
                {parseInlineFormatting(trimmed.substring(2))}
              </div>
            </div>
          );
        }

        if (trimmed.startsWith("**") && trimmed.includes("|")) {
          return (
            <div key={idx} className="text-xs sm:text-sm text-zinc-500 font-medium flex flex-wrap gap-2 divider mb-3">
              {parseInlineFormatting(trimmed)}
            </div>
          );
        }

        return (
          <p key={idx} className="text-zinc-650 leading-relaxed text-xs sm:text-sm my-1">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

const RenderStyledLetter: React.FC<{ text: string; options: ResumeStyleOptions }> = ({ text, options }) => {
  const fontClass = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono"
  }[options.fontFamily];

  const spacingClass = {
    compact: "space-y-2.5 p-6 text-xs",
    normal: "space-y-4 p-8 sm:p-10 text-sm",
    spacious: "space-y-6 p-10 sm:p-12 text-base"
  }[options.spacing];

  const themeColors = {
    slate: { primary: "text-slate-800", border: "border-slate-200" },
    emerald: { primary: "text-emerald-950", border: "border-emerald-100" },
    royal: { primary: "text-blue-900", border: "border-blue-100" },
    purple: { primary: "text-purple-950", border: "border-purple-100" },
    monochrome: { primary: "text-zinc-950", border: "border-zinc-200" }
  }[options.themeColor];

  const cleanText = text.replace(/\r\n/g, "\n");
  const lines = cleanText.split("\n");

  const parseInlineFormatting = (str: string) => {
    const boldParts = str.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((part, bIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={bIdx} className="font-bold text-zinc-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={bIdx}>{part}</span>;
    });
  };

  return (
    <div className={`bg-white text-zinc-800 ${fontClass} ${spacingClass} rounded-2xl shadow-2xl transition-all duration-300 text-left`} style={{ minHeight: "297mm" }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        if (trimmed.startsWith("Subject:")) {
          return (
            <h3 key={idx} className={`font-bold text-xs sm:text-sm border-b ${themeColors.border} pb-2 mb-4 ${themeColors.primary}`}>
              {parseInlineFormatting(trimmed)}
            </h3>
          );
        }

        return (
          <p key={idx} className="text-zinc-650 leading-relaxed text-xs sm:text-sm my-1">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const AiCoachTab: React.FC = () => {
  const {
    seekerProfile,
    chatMessages,
    sendChatMessage,
    clearChat,
    seekerCVContent,
    setSeekerCVContent,
    seekerCoverLetter,
    setSeekerCoverLetter
  } = useApp();

  // Active subtab
  const [subTab, setSubTab] = useState<"coach" | "cv" | "letter">("coach");

  // Chat message input
  const [chatInput, setChatInput] = useState("");
  const chatFeedRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(chatMessages.length);

  // CV builder states
  const [cvName, setCvName] = useState(seekerProfile.name);
  const [cvTitle, setCvTitle] = useState(seekerProfile.title);
  const [cvEmail, setCvEmail] = useState(seekerProfile.email);
  const [cvPhone, setCvPhone] = useState(seekerProfile.phone);
  const [cvEducation, setCvEducation] = useState(seekerProfile.education[0]?.school || "University of Tech");
  const [cvDegree, setCvDegree] = useState(seekerProfile.education[0]?.degree || "B.S. in Computer Science");
  const [cvIntro, setCvIntro] = useState(seekerProfile.bio);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [cvCopied, setCvCopied] = useState(false);

  // Custom CV styling & layout states
  const [cvViewMode, setCvViewMode] = useState<"document" | "markdown">("document");
  const [cvOptions, setCvOptions] = useState<ResumeStyleOptions>({
    themeColor: "slate",
    fontFamily: "sans",
    spacing: "normal"
  });

  // Cover Letter states
  const [letterName, setLetterName] = useState(seekerProfile.name);
  const [letterEmail, setLetterEmail] = useState(seekerProfile.email);
  const [letterPhone, setLetterPhone] = useState(seekerProfile.phone);
  const [letterJobTitle, setLetterJobTitle] = useState("");
  const [letterCompany, setLetterCompany] = useState("");
  const [letterTone, setLetterTone] = useState("professional");
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [letterCopied, setLetterCopied] = useState(false);
  const [letterViewMode, setLetterViewMode] = useState<"document" | "markdown">("document");
  const [letterOptions, setLetterOptions] = useState<ResumeStyleOptions>({
    themeColor: "slate",
    fontFamily: "sans",
    spacing: "normal"
  });

  // Dropdown visibility states
  const [isCvFontOpen, setIsCvFontOpen] = useState(false);
  const [isCvSpacingOpen, setIsCvSpacingOpen] = useState(false);
  const [isLetterToneOpen, setIsLetterToneOpen] = useState(false);
  const [isLetterFontOpen, setIsLetterFontOpen] = useState(false);
  const [isLetterSpacingOpen, setIsLetterSpacingOpen] = useState(false);

  const printDocument = () => {
    if (!seekerCVContent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const fontClassMap = {
      sans: "font-family: 'Inter', system-ui, -apple-system, sans-serif;",
      serif: "font-family: 'Merriweather', Georgia, serif;",
      mono: "font-family: 'JetBrains Mono', monospace;"
    };

    const themeMap = {
      slate: { primary: "#1e293b", accent: "#0284c7", border: "#e2e8f0", line: "#0284c7" },
      emerald: { primary: "#064e3b", accent: "#059669", border: "#d1fae5", line: "#059669" },
      royal: { primary: "#1e3a8a", accent: "#2563eb", border: "#dbeafe", line: "#2563eb" },
      purple: { primary: "#3b0764", accent: "#7c3aed", border: "#f3e8ff", line: "#7c3aed" },
      monochrome: { primary: "#09090b", accent: "#27272a", border: "#e4e4e7", line: "#09090b" }
    };

    const activeTheme = themeMap[cvOptions.themeColor];
    const activeFont = fontClassMap[cvOptions.fontFamily];
    
    const cleanText = seekerCVContent.replace(/\r\n/g, "\n");
    const lines = cleanText.split("\n");
    
    let htmlContent = "";
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        htmlContent += "<div style='height: 8px;'></div>";
        return;
      }
      if (trimmed.startsWith("# ")) {
        htmlContent += `<h1 style="font-size: 24px; font-weight: 800; color: ${activeTheme.primary}; border-bottom: 2px solid ${activeTheme.border}; padding-bottom: 6px; margin-bottom: 12px; margin-top: 0; letter-spacing: -0.02em;">${trimmed.substring(2)}</h1>`;
      } else if (trimmed.startsWith("## ")) {
        htmlContent += `<h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: ${activeTheme.accent}; margin-top: 22px; margin-bottom: 8px; border-bottom: 1px solid ${activeTheme.border}; padding-bottom: 4px; letter-spacing: 0.05em;">${trimmed.substring(3)}</h2>`;
      } else if (trimmed.startsWith("### ")) {
        htmlContent += `<h3 style="font-size: 13px; font-weight: 700; color: #09090b; margin-top: 10px; margin-bottom: 2px;">${trimmed.substring(4)}</h3>`;
      } else if (trimmed === "---") {
        htmlContent += `<hr style="border: 0; border-top: 1px solid ${activeTheme.border}; margin: 16px 0;" />`;
      } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        htmlContent += `
          <div style="display: flex; gap: 8px; align-items: start; margin: 3px 0 3px 6px; font-size: 12px; color: #3f3f46; line-height: 1.5;">
            <span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${activeTheme.line}; margin-top: 6px; flex-shrink: 0;"></span>
            <div>${trimmed.substring(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>")}</div>
          </div>
        `;
      } else if (trimmed.startsWith("**") && trimmed.includes("|")) {
        htmlContent += `<div style="font-size: 11px; color: #71717a; font-weight: 500; margin-bottom: 8px; display: flex; gap: 8px; flex-wrap: wrap;">${trimmed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>")}</div>`;
      } else {
        htmlContent += `<p style="font-size: 12px; color: #3f3f46; line-height: 1.5; margin: 4px 0;">${trimmed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>")}</p>`;
      }
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>${cvName.trim().replace(/\s+/g, "_")}_CV</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&display=swap" rel="stylesheet">
          <style>
            body {
              ${activeFont}
              background-color: white;
              margin: 0;
              padding: 15mm;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @page {
              size: A4;
              margin: 0;
            }
            strong {
              color: #09090b;
              font-weight: 700;
            }
            em {
              color: #27272a;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 800px; margin: 0 auto;">
            ${htmlContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printLetter = () => {
    if (!seekerCoverLetter) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const fontClassMap = {
      sans: "font-family: 'Inter', system-ui, -apple-system, sans-serif;",
      serif: "font-family: 'Merriweather', Georgia, serif;",
      mono: "font-family: 'JetBrains Mono', monospace;"
    };

    const themeMap = {
      slate: { primary: "#1e293b", border: "#e2e8f0" },
      emerald: { primary: "#064e3b", border: "#d1fae5" },
      royal: { primary: "#1e3a8a", border: "#dbeafe" },
      purple: { primary: "#3b0764", border: "#f3e8ff" },
      monochrome: { primary: "#09090b", border: "#e4e4e7" }
    };

    const activeTheme = themeMap[letterOptions.themeColor];
    const activeFont = fontClassMap[letterOptions.fontFamily];
    
    const cleanText = seekerCoverLetter.replace(/\r\n/g, "\n");
    const lines = cleanText.split("\n");
    
    let htmlContent = "";
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        htmlContent += "<div style='height: 8px;'></div>";
        return;
      }
      if (trimmed.startsWith("Subject:")) {
        htmlContent += `<h3 style="font-size: 13px; font-weight: 700; border-bottom: 1px solid ${activeTheme.border}; padding-bottom: 8px; margin-bottom: 16px; color: ${activeTheme.primary};">${trimmed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</h3>`;
      } else {
        htmlContent += `<p style="font-size: 12px; color: #3f3f46; line-height: 1.5; margin: 4px 0;">${trimmed.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>")}</p>`;
      }
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>${seekerProfile.name.trim().replace(/\s+/g, "_")}_Cover_Letter</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&display=swap" rel="stylesheet">
          <style>
            body {
              ${activeFont}
              background-color: white;
              margin: 0;
              padding: 20mm;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @page {
              size: A4;
              margin: 0;
            }
            strong {
              color: #09090b;
              font-weight: 700;
            }
            em {
              color: #27272a;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 800px; margin: 0 auto;">
            ${htmlContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleGenerateLetter = async () => {
    setIsGeneratingLetter(true);
    try {
      const res = await fetch("/api/letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          seekerProfile: {
            ...seekerProfile,
            name: letterName,
            email: letterEmail,
            phone: letterPhone
          },
          letterJobTitle,
          letterCompany,
          letterTone
        })
      });

      if (!res.ok) {
        throw new Error(`Letter API error: status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.letter) {
        setSeekerCoverLetter(data.letter);
        setIsGeneratingLetter(false);
        return;
      }
      throw new Error(data.error || "Failed to parse cover letter");
    } catch (err: any) {
      console.warn("Falling back to local template:", err.message);
      const dateString = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      const doc = `${letterName}
${seekerProfile.title}
${letterEmail} | ${letterPhone}

${dateString}

Hiring Manager
${letterCompany || "Target Company"}

Subject: Application for ${letterJobTitle || "Target Position"}

Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${letterJobTitle || "Target Position"} role at ${letterCompany || "your company"}. With my background as a ${seekerProfile.title} and a robust skill set including ${seekerProfile.skills.slice(0, 5).join(", ")}, I am confident that I can make a significant contribution to your team.

In my recent experience, I have successfully applied these skills to deliver high-quality solutions. I am particularly drawn to ${letterCompany || "your organization"} because of your commitment to innovation and growth, and I would love the opportunity to bring my experience in frontend development and modern web patterns to this role.

Thank you for your time and consideration. I look forward to the possibility of discussing how my background aligns with your needs.

Sincerely,

${letterName}

*(Generated by PEET AI Cover Letter Writer - Offline Fallback)*`;

      setSeekerCoverLetter(doc);
      setIsGeneratingLetter(false);
    }
  };

  const copyLetterToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setLetterCopied(true);
    setTimeout(() => setLetterCopied(false), 2000);
  };

  // Sync profile details if changed elsewhere
  useEffect(() => {
    setCvName(seekerProfile.name);
    setCvTitle(seekerProfile.title);
    setCvEmail(seekerProfile.email);
    setCvPhone(seekerProfile.phone);
    setCvIntro(seekerProfile.bio);
    setLetterName(seekerProfile.name);
    setLetterEmail(seekerProfile.email);
    setLetterPhone(seekerProfile.phone);
  }, [seekerProfile]);

  // Scroll to correct position on updates without scrolling the global body viewport
  useEffect(() => {
    if (!chatFeedRef.current || chatMessages.length === 0) return;

    const container = chatFeedRef.current;
    
    // Check if messages length actually increased (e.g. a new message was sent/received)
    const isNewMessage = chatMessages.length > prevMessagesLength.current;
    prevMessagesLength.current = chatMessages.length;

    if (isNewMessage) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.sender === "user") {
        container.scrollTop = container.scrollHeight;
      } else {
        // AI message came in! Scroll container exactly to the top of this new message block
        const children = container.children;
        if (children.length > 0) {
          const lastChild = children[children.length - 1] as HTMLElement;
          if (lastChild) {
            container.scrollTo({
              top: lastChild.offsetTop - 16,
              behavior: "smooth"
            });
          }
        }
      }
    } else {
      // Just loaded the tab or cleared, scroll to bottom
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages, subTab]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput("");
  };

  const handleGenerateCV = async () => {
    setIsGeneratingCV(true);
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          seekerProfile: {
            ...seekerProfile,
            name: cvName,
            title: cvTitle,
            email: cvEmail,
            phone: cvPhone
          },
          cvEducation,
          cvDegree,
          cvIntro
        })
      });

      if (!res.ok) {
        throw new Error(`CV API error: status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.cv) {
        setSeekerCVContent(data.cv);
        setIsGeneratingCV(false);
        return;
      }
      throw new Error(data.error || "Failed to parse CV");
    } catch (err: any) {
      console.warn("Falling back to local template:", err.message);
      const currentDateString = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      // Local fallback template
      const doc = `# ${cvName}
**${cvTitle}** | ${cvEmail} | ${cvPhone}
Date Generated: ${currentDateString}

## Summary
${cvIntro}

## Core Skills
${seekerProfile.skills.join(" • ")}

## Professional Experience
${seekerProfile.experience
  .map(
    (exp) => `### ${exp.role} | ${exp.company} (${exp.duration})
${exp.description}`
  )
  .join("\n\n")}

## Education
### ${cvDegree}
*${cvEducation}* | Completed

---
*Generated by PEET AI Career Suite (Offline Fallback)*`;

      setSeekerCVContent(doc);
      setIsGeneratingCV(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCvCopied(true);
    setTimeout(() => setCvCopied(false), 2000);
  };

  const downloadTxt = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Tab navigation headers */}
      <div className="bg-zinc-950/60 p-2 rounded-2xl border border-purple-500/10 flex gap-2.5 justify-center md:justify-start max-w-fit mx-auto md:mx-0 shadow-lg">
        {[
          { id: "coach", label: "Career Chatbot", icon: Sparkles },
          { id: "cv", label: "AI CV Builder", icon: FileText },
          { id: "letter", label: "AI Cover Letter", icon: Briefcase }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Subtab Contents */}
      {subTab === "coach" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar coach prompts - hidden on mobile, chips shown inside chat window instead */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            <div className="glass-panel rounded-3xl p-8 space-y-5 border border-purple-500/10 shadow-xl bg-zinc-950/40">
              <h3 className="font-extrabold text-sm text-zinc-150 tracking-wide">Recommended Topics</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Ask PEET anything or click a preset question below to begin your career support conversation.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "How do I target keywords in my resume?",
                  "Give me tips on salary negotiations.",
                  "How can I format a technical experience card?",
                  "What skills are required for Frontend roles?"
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendChatMessage(q)}
                    className="w-full text-left p-4 rounded-2xl bg-zinc-900/40 hover:bg-purple-500/10 text-xs text-zinc-300 hover:text-purple-300 font-bold border border-purple-500/5 hover:border-purple-500/20 transition-all duration-300 leading-normal cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main chat window */}
          <div className="lg:col-span-3 flex flex-col h-[650px] glass-panel rounded-3xl overflow-hidden shadow-2xl border border-purple-500/15 bg-zinc-950/40 relative">
            {/* Subtle radial background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="p-5 border-b border-purple-500/10 flex justify-between items-center bg-purple-950/20 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-650 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-purple-500/25">
                  🤖
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-100">PEET Career Assistant</h4>
                  <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest animate-pulse flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-450 inline-block animate-ping"></span>
                    AI Agent Online
                  </span>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="p-2.5 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Message Feed */}
            <div
              ref={chatFeedRef}
              className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent relative z-10"
            >
              {chatMessages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-4 animate-fade-in`}
                  >
                    {!isUser && (
                      <div className="w-9 h-9 rounded-xl bg-purple-955/40 flex items-center justify-center text-sm border border-purple-500/15 shrink-0 text-purple-400">
                        🤖
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-purple-500/15 border border-purple-500/25"
                          : "bg-zinc-900/50 rounded-tl-none border border-purple-500/10 text-zinc-250 shadow-sm"
                      }`}
                    >
                      {isUser ? msg.text : <MarkdownText text={msg.text} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile-only preset chips */}
            <div className="lg:hidden px-6 pb-3 pt-2 flex gap-2.5 overflow-x-auto scrollbar-none select-none relative z-10">
              {[
                "How do I target resume keywords?",
                "Salary negotiations advice",
                "Format a technical experience card",
                "Skills for Frontend roles"
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendChatMessage(q)}
                  className="shrink-0 px-4 py-2 rounded-full bg-zinc-900/80 border border-purple-500/15 text-[11px] font-bold text-zinc-300 hover:text-purple-300 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendChat} className="p-5 border-t border-purple-500/10 flex gap-3 bg-zinc-950/60 relative z-10">
              <input
                type="text"
                placeholder="Ask about resume tips, CV enhancement, job match index improvement..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-5 py-3.5 bg-zinc-900/40 rounded-2xl border border-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 text-xs sm:text-sm text-zinc-200 placeholder-zinc-505 transition-all"
              />
              <button
                type="submit"
                className="p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg shadow-purple-500/25 transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {subTab === "cv" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CV Generator parameters */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-8 sm:p-10 space-y-6 border border-purple-500/10 shadow-xl bg-zinc-950/40">
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-zinc-100 tracking-wide">Resume Parameters</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Provide your educational details and bio. PEET merges these with your experience history to compile a beautifully formatted ATS-optimized markdown CV.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={cvName}
                  onChange={(e) => setCvName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Job Title</label>
                <input
                  type="text"
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={cvEmail}
                  onChange={(e) => setCvEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  value={cvPhone}
                  onChange={(e) => setCvPhone(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Education Institute</label>
                <input
                  type="text"
                  value={cvEducation}
                  onChange={(e) => setCvEducation(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Degree Title</label>
                <input
                  type="text"
                  value={cvDegree}
                  onChange={(e) => setCvDegree(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Professional Biography</label>
                <textarea
                  rows={5}
                  value={cvIntro}
                  onChange={(e) => setCvIntro(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 resize-none transition-all font-sans leading-relaxed"
                />
              </div>

              <button
                onClick={handleGenerateCV}
                disabled={isGeneratingCV}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-600/40 disabled:to-indigo-600/40 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingCV ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Generate ATS CV</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CV Markdown Output panel */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 flex flex-col min-h-[550px] border border-purple-500/10 shadow-2xl bg-zinc-950/40">
            <div className="flex justify-between items-center mb-6 border-b border-purple-500/10 pb-4 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {/* macOS window control lights */}
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 border-l border-zinc-800">
                  Document Styler
                </span>
              </div>
              
              {seekerCVContent && (
                <div className="flex items-center gap-3">
                  {/* View Mode Switcher */}
                  <div className="bg-zinc-900/80 p-1 rounded-xl border border-purple-500/10 flex gap-1 text-[10px] font-bold">
                    <button
                      onClick={() => setCvViewMode("document")}
                      className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                        cvViewMode === "document" ? "bg-purple-650 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Document
                    </button>
                    <button
                      onClick={() => setCvViewMode("markdown")}
                      className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                        cvViewMode === "markdown" ? "bg-purple-650 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Markdown
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={printDocument}
                      className="p-2.5 text-zinc-400 hover:text-purple-300 bg-zinc-900/60 hover:bg-purple-500/10 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 shadow-sm cursor-pointer"
                      title="Print / Export PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(seekerCVContent)}
                      className="p-2.5 text-zinc-400 hover:text-purple-300 bg-zinc-900/60 hover:bg-purple-500/10 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 shadow-sm cursor-pointer"
                      title="Copy to Clipboard"
                    >
                      {cvCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => downloadTxt(seekerCVContent, `${cvName.trim().replace(/\s+/g, "_")}_CV.md`)}
                      className="p-2.5 text-zinc-400 hover:text-purple-300 bg-zinc-900/60 hover:bg-purple-500/10 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 shadow-sm cursor-pointer"
                      title="Download Markdown File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Style Customizer Toolbar */}
            {seekerCVContent && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 mb-5 bg-zinc-900/60 rounded-2xl border border-purple-500/10 text-xs">
                {/* Color Theme Selector */}
                <div className="space-y-1.5">
                  <span className="font-bold text-zinc-400 block uppercase tracking-wider text-[9px]">Theme Color</span>
                  <div className="flex gap-2">
                    {[
                      { id: "slate", bg: "bg-slate-700", label: "Slate" },
                      { id: "emerald", bg: "bg-emerald-600", label: "Emerald" },
                      { id: "royal", bg: "bg-blue-600", label: "Royal" },
                      { id: "purple", bg: "bg-purple-650", label: "Purple" },
                      { id: "monochrome", bg: "bg-zinc-950 border border-zinc-700", label: "Mono" }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setCvOptions(prev => ({ ...prev, themeColor: theme.id as any }))}
                        className={`w-5 h-5 rounded-full ${theme.bg} cursor-pointer transition-all ${
                          cvOptions.themeColor === theme.id ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-black scale-110" : "opacity-85 hover:opacity-100"
                        }`}
                        title={theme.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Family Selector */}
                <div className="space-y-1.5 relative">
                  <span className="font-bold text-zinc-400 block uppercase tracking-wider text-[9px]">Font Style</span>
                  <button
                    type="button"
                    onClick={() => setIsCvFontOpen(!isCvFontOpen)}
                    className="w-full px-2.5 py-1.5 bg-zinc-950 rounded-lg border border-purple-500/10 text-zinc-350 flex items-center justify-between transition-all select-none text-left"
                  >
                    <span>
                      {cvOptions.fontFamily === "sans"
                        ? "Modern Sans (Inter)"
                        : cvOptions.fontFamily === "serif"
                        ? "Formal Serif (Merriweather)"
                        : "Developer Mono (JetBrains)"}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-zinc-550 transition-transform ${isCvFontOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isCvFontOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsCvFontOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-40 overflow-y-auto glass-panel rounded-lg p-1 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {(["sans", "serif", "mono"] as const).map((font) => (
                          <button
                            key={font}
                            type="button"
                            onClick={() => {
                              setCvOptions((prev) => ({ ...prev, fontFamily: font }));
                              setIsCvFontOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                              cvOptions.fontFamily === font
                                ? "bg-purple-650 text-white"
                                : "text-zinc-450 hover:text-zinc-200 hover:bg-purple-500/10"
                            }`}
                          >
                            {font === "sans"
                              ? "Modern Sans (Inter)"
                              : font === "serif"
                              ? "Formal Serif (Merriweather)"
                              : "Developer Mono (JetBrains)"}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Layout Spacing Selector */}
                <div className="space-y-1.5 relative">
                  <span className="font-bold text-zinc-400 block uppercase tracking-wider text-[9px]">Line Spacing</span>
                  <button
                    type="button"
                    onClick={() => setIsCvSpacingOpen(!isCvSpacingOpen)}
                    className="w-full px-2.5 py-1.5 bg-zinc-950 rounded-lg border border-purple-500/10 text-zinc-350 flex items-center justify-between transition-all select-none text-left"
                  >
                    <span className="capitalize">{cvOptions.spacing}</span>
                    <ChevronDown className={`w-3 h-3 text-zinc-550 transition-transform ${isCvSpacingOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isCvSpacingOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsCvSpacingOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-40 overflow-y-auto glass-panel rounded-lg p-1 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {(["compact", "normal", "spacious"] as const).map((space) => (
                          <button
                            key={space}
                            type="button"
                            onClick={() => {
                              setCvOptions((prev) => ({ ...prev, spacing: space }));
                              setIsCvSpacingOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                              cvOptions.spacing === space
                                ? "bg-purple-650 text-white"
                                : "text-zinc-455 hover:text-zinc-200 hover:bg-purple-500/10"
                            }`}
                          >
                            <span className="capitalize">{space}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {seekerCVContent ? (
              cvViewMode === "document" ? (
                <div className="flex-1 overflow-auto max-h-[460px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent rounded-2xl border border-purple-500/15">
                  <RenderStyledDocument text={seekerCVContent} options={cvOptions} />
                </div>
              ) : (
                <pre className="flex-1 p-6 bg-zinc-950/80 rounded-2xl border border-purple-500/10 text-xs sm:text-sm text-zinc-350 font-mono overflow-auto leading-relaxed max-h-[460px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {seekerCVContent}
                </pre>
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-zinc-500 space-y-4 border border-dashed border-purple-500/15 rounded-2xl bg-zinc-950/20">
                <div className="relative">
                  <div className="absolute inset-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
                  <FileText className="w-12 h-12 text-purple-500/40 relative z-10" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-sm font-bold text-zinc-300">No CV Drafted</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                    Configure your education variables on the left panel and click generate to build your CV structure.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === "letter" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cover Letter parameters */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-8 sm:p-10 space-y-6 border border-purple-500/10 shadow-xl bg-zinc-950/40">
            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-zinc-100 tracking-wide">Cover Letter Parameters</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Enter your target position, target company, and select a tone. PEET will generate a tailored, professional cover letter to match your smart profile.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={letterName}
                  onChange={(e) => setLetterName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={letterEmail}
                  onChange={(e) => setLetterEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  value={letterPhone}
                  onChange={(e) => setLetterPhone(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Target Position</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={letterJobTitle}
                  onChange={(e) => setLetterJobTitle(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Target Company</label>
                <input
                  type="text"
                  placeholder="e.g. Stripe"
                  value={letterCompany}
                  onChange={(e) => setLetterCompany(e.target.value)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 transition-all placeholder-zinc-650"
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">Letter Tone</label>
                <button
                  type="button"
                  onClick={() => setIsLetterToneOpen(!isLetterToneOpen)}
                  className="w-full px-5 py-3.5 bg-zinc-900/40 rounded-xl border border-purple-500/10 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/40 text-left flex items-center justify-between transition-all select-none cursor-pointer"
                >
                  <span>
                    {letterTone === "professional"
                      ? "Professional & Direct"
                      : letterTone === "enthusiastic"
                      ? "Enthusiastic & Passionate"
                      : letterTone === "creative"
                      ? "Creative & Story-driven"
                      : "Traditional & Formal"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isLetterToneOpen ? "rotate-180" : ""}`} />
                </button>
                {isLetterToneOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsLetterToneOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 z-40 max-h-60 overflow-y-auto glass-panel rounded-2xl p-2 border border-purple-500/20 shadow-2xl animate-scale-up scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      {[
                        { value: "professional", label: "Professional & Direct" },
                        { value: "enthusiastic", label: "Enthusiastic & Passionate" },
                        { value: "creative", label: "Creative & Story-driven" },
                        { value: "formal", label: "Traditional & Formal" }
                      ].map((tone) => (
                        <button
                          key={tone.value}
                          type="button"
                          onClick={() => {
                            setLetterTone(tone.value);
                            setIsLetterToneOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
                            letterTone === tone.value
                              ? "bg-purple-650 text-white"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-purple-500/10"
                          }`}
                        >
                          {tone.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleGenerateLetter}
                disabled={isGeneratingLetter}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-600/40 disabled:to-indigo-600/40 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingLetter ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Generate Cover Letter</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cover Letter Output panel */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 flex flex-col min-h-[550px] border border-purple-500/10 shadow-2xl bg-zinc-950/40">
            <div className="flex justify-between items-center mb-6 border-b border-purple-500/10 pb-4 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {/* macOS window control lights */}
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 border-l border-zinc-800">
                  Letter Styler
                </span>
              </div>
              
              {seekerCoverLetter && (
                <div className="flex items-center gap-3">
                  {/* View Mode Switcher */}
                  <div className="bg-zinc-900/80 p-1 rounded-xl border border-purple-500/10 flex gap-1 text-[10px] font-bold">
                    <button
                      onClick={() => setLetterViewMode("document")}
                      className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                        letterViewMode === "document" ? "bg-purple-650 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Document
                    </button>
                    <button
                      onClick={() => setLetterViewMode("markdown")}
                      className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                        letterViewMode === "markdown" ? "bg-purple-650 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Markdown
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={printLetter}
                      className="p-2.5 text-zinc-400 hover:text-purple-300 bg-zinc-900/60 hover:bg-purple-500/10 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 shadow-sm cursor-pointer"
                      title="Print / Export PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyLetterToClipboard(seekerCoverLetter)}
                      className="p-2.5 text-zinc-400 hover:text-purple-300 bg-zinc-900/60 hover:bg-purple-500/10 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 shadow-sm cursor-pointer"
                      title="Copy to Clipboard"
                    >
                      {letterCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => downloadTxt(seekerCoverLetter, `${seekerProfile.name.trim().replace(/\s+/g, "_")}_Cover_Letter.md`)}
                      className="p-2.5 text-zinc-400 hover:text-purple-300 bg-zinc-900/60 hover:bg-purple-500/10 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 shadow-sm cursor-pointer"
                      title="Download Markdown File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Style Customizer Toolbar */}
            {seekerCoverLetter && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 mb-5 bg-zinc-900/60 rounded-2xl border border-purple-500/10 text-xs">
                {/* Color Theme Selector */}
                <div className="space-y-1.5">
                  <span className="font-bold text-zinc-400 block uppercase tracking-wider text-[9px]">Theme Color</span>
                  <div className="flex gap-2">
                    {[
                      { id: "slate", bg: "bg-slate-700", label: "Slate" },
                      { id: "emerald", bg: "bg-emerald-600", label: "Emerald" },
                      { id: "royal", bg: "bg-blue-600", label: "Royal" },
                      { id: "purple", bg: "bg-purple-650", label: "Purple" },
                      { id: "monochrome", bg: "bg-zinc-950 border border-zinc-700", label: "Mono" }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setLetterOptions(prev => ({ ...prev, themeColor: theme.id as any }))}
                        className={`w-5 h-5 rounded-full ${theme.bg} cursor-pointer transition-all ${
                          letterOptions.themeColor === theme.id ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-black scale-110" : "opacity-85 hover:opacity-100"
                        }`}
                        title={theme.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Family Selector */}
                <div className="space-y-1.5 relative">
                  <span className="font-bold text-zinc-400 block uppercase tracking-wider text-[9px]">Font Style</span>
                  <button
                    type="button"
                    onClick={() => setIsLetterFontOpen(!isLetterFontOpen)}
                    className="w-full px-2.5 py-1.5 bg-zinc-950 rounded-lg border border-purple-500/10 text-zinc-350 flex items-center justify-between transition-all select-none text-left"
                  >
                    <span>
                      {letterOptions.fontFamily === "sans"
                        ? "Modern Sans (Inter)"
                        : letterOptions.fontFamily === "serif"
                        ? "Formal Serif (Merriweather)"
                        : "Developer Mono (JetBrains)"}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-zinc-550 transition-transform ${isLetterFontOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isLetterFontOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsLetterFontOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-40 overflow-y-auto glass-panel rounded-lg p-1 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {(["sans", "serif", "mono"] as const).map((font) => (
                          <button
                            key={font}
                            type="button"
                            onClick={() => {
                              setLetterOptions((prev) => ({ ...prev, fontFamily: font }));
                              setIsLetterFontOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                              letterOptions.fontFamily === font
                                ? "bg-purple-650 text-white"
                                : "text-zinc-450 hover:text-zinc-200 hover:bg-purple-500/10"
                            }`}
                          >
                            {font === "sans"
                              ? "Modern Sans (Inter)"
                              : font === "serif"
                              ? "Formal Serif (Merriweather)"
                              : "Developer Mono (JetBrains)"}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Layout Spacing Selector */}
                <div className="space-y-1.5 relative">
                  <span className="font-bold text-zinc-400 block uppercase tracking-wider text-[9px]">Line Spacing</span>
                  <button
                    type="button"
                    onClick={() => setIsLetterSpacingOpen(!isLetterSpacingOpen)}
                    className="w-full px-2.5 py-1.5 bg-zinc-950 rounded-lg border border-purple-500/10 text-zinc-350 flex items-center justify-between transition-all select-none text-left"
                  >
                    <span className="capitalize">{letterOptions.spacing}</span>
                    <ChevronDown className={`w-3 h-3 text-zinc-550 transition-transform ${isLetterSpacingOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isLetterSpacingOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsLetterSpacingOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1 z-40 max-h-40 overflow-y-auto glass-panel rounded-lg p-1 border border-purple-500/20 shadow-xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {(["compact", "normal", "spacious"] as const).map((space) => (
                          <button
                            key={space}
                            type="button"
                            onClick={() => {
                              setLetterOptions((prev) => ({ ...prev, spacing: space }));
                              setIsLetterSpacingOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                              letterOptions.spacing === space
                                ? "bg-purple-650 text-white"
                                : "text-zinc-455 hover:text-zinc-200 hover:bg-purple-500/10"
                            }`}
                          >
                            <span className="capitalize">{space}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {seekerCoverLetter ? (
              letterViewMode === "document" ? (
                <div className="flex-1 overflow-auto max-h-[460px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent rounded-2xl border border-purple-500/15">
                  <RenderStyledLetter text={seekerCoverLetter} options={letterOptions} />
                </div>
              ) : (
                <pre className="flex-1 p-6 bg-zinc-950/80 rounded-2xl border border-purple-500/10 text-xs sm:text-sm text-zinc-350 font-mono overflow-auto leading-relaxed max-h-[460px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {seekerCoverLetter}
                </pre>
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-zinc-500 space-y-4 border border-dashed border-purple-500/15 rounded-2xl bg-zinc-950/20">
                <div className="relative">
                  <div className="absolute inset-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
                  <Briefcase className="w-12 h-12 text-purple-500/40 relative z-10" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-sm font-bold text-zinc-300">No Cover Letter Drafted</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                    Enter target job specifications on the left panel and click generate to compile your cover letter.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
