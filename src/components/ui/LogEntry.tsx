
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, FileText, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export interface LogEntryData {
  id: string;
  date: Date;
  shift: "Morning" | "Afternoon" | "Night";
  engineer: string;
  status: "Pending" | "Approved" | "Flagged";
  department: string;
  notes?: string;
  summary: string;
}

interface LogEntryProps {
  data: LogEntryData;
  onApprove?: (id: string) => void;
  onFlag?: (id: string) => void;
}

export const LogEntry = ({ data, onApprove, onFlag }: LogEntryProps) => {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Approved: "bg-green-100 text-green-800 border-green-200",
    Flagged: "bg-red-100 text-red-800 border-red-200",
  };

  const shiftColors = {
    Morning: "bg-blue-100 text-blue-800 border-blue-200",
    Afternoon: "bg-purple-100 text-purple-800 border-purple-200",
    Night: "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "border rounded-lg overflow-hidden mb-3 bg-white subtle-shadow",
        expanded ? "shadow-md" : "shadow-sm"
      )}
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <div className="font-medium">{format(data.date, "PPP")}</div>
            <div className="text-sm text-muted-foreground flex items-center space-x-2">
              <span>{data.engineer}</span>
              <span>•</span>
              <span>{data.department}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={cn("capitalize", shiftColors[data.shift])}>
            {data.shift}
          </Badge>
          <Badge variant="outline" className={cn("capitalize", statusColors[data.status])}>
            {data.status}
          </Badge>
          <ChevronDown 
            className={cn(
              "transition-transform duration-200 h-5 w-5 text-muted-foreground",
              expanded ? "transform rotate-180" : ""
            )} 
          />
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t p-4"
        >
          <div className="prose prose-sm max-w-none">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Summary</h4>
            <p className="mb-4">{data.summary}</p>
            
            {data.notes && (
              <>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</h4>
                <p className="mb-4">{data.notes}</p>
              </>
            )}

            {(onApprove || onFlag) && data.status === "Pending" && (
              <div className="flex justify-end mt-4 space-x-2">
                {onFlag && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="px-3 py-1 rounded-md text-sm border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                    onClick={() => onFlag(data.id)}
                  >
                    Flag for Review
                  </motion.button>
                )}
                {onApprove && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="px-3 py-1 rounded-md text-sm bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors flex items-center"
                    onClick={() => onApprove(data.id)}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LogEntry;
