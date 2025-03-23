
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: "default" | "outline" | "transparent";
  className?: string;
  children: ReactNode;
}

export const DashboardCard = ({
  title,
  subtitle,
  icon,
  variant = "default",
  className,
  children,
}: DashboardCardProps) => {
  const variants = {
    default: "bg-white rounded-xl subtle-shadow",
    outline: "bg-white/50 border border-border rounded-xl",
    transparent: "bg-transparent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "overflow-hidden",
        variants[variant],
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium leading-6">{title}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground rounded-full p-2 bg-muted/50">
              {icon}
            </div>
          )}
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
