
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
