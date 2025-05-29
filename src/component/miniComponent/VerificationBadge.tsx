import { BadgeCheck } from "lucide-react";
import { type FC } from "react";

interface VerificationBadgeProps {
  size?: "sm" | "md" | "lg"; // Different size options
  className?: string;
}

const VerificationBadge: FC<VerificationBadgeProps> = ({ 
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  return (
    <span title="Verified User" className={className}>
      <BadgeCheck className={`${sizeClasses[size]} fill-blue-500 stroke-white`} />
    </span>
  );
};

export default VerificationBadge;