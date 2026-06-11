import React from "react";
import {
  Briefcase,
  Code,
  Brain,
  Palette,
  TrendingUp,
  Tv,
  GraduationCap,
  Laptop,
  BookOpen,
  Sparkles
} from "lucide-react";

interface OpportunityIconProps {
  logo: string;
  className?: string;
}

export const OpportunityIcon: React.FC<OpportunityIconProps> = ({ logo, className = "w-4 h-4" }) => {
  const name = (logo || "").toLowerCase();
  
  switch (name) {
    case "briefcase":
    case "job":
      return <Briefcase className={className} />;
    case "code":
    case "react":
    case "developer":
      return <Code className={className} />;
    case "brain":
    case "ai":
      return <Brain className={className} />;
    case "palette":
    case "design":
      return <Palette className={className} />;
    case "trending-up":
    case "marketing":
      return <TrendingUp className={className} />;
    case "tv":
    case "video":
    case "youtube":
      return <Tv className={className} />;
    case "graduation-cap":
    case "education":
    case "course":
      return <GraduationCap className={className} />;
    case "laptop":
    case "training":
    case "bootcamp":
      return <Laptop className={className} />;
    case "book-open":
      return <BookOpen className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    default:
      // Fallback: If it's a raw emoji symbol (length <= 2), display it as a text span.
      if (logo && logo.length <= 2) {
        return <span className="text-sm shrink-0 leading-none">{logo}</span>;
      }
      return <Briefcase className={className} />;
  }
};
