
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Users, ClipboardList, BarChart3, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import DashboardCard from "@/components/ui/DashboardCard";
import LogEntry, { LogEntryData } from "@/components/ui/LogEntry";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data
const generateMockLogs = (): LogEntryData[] => {
  const departments = ["Turbine Hall", "Boiler Room", "Control Room", "Water Treatment", "Electrical Systems"];
  const shifts = ["Morning", "Afternoon", "Night"];
  const statuses = ["Pending", "Approved", "Flagged"];
  const engineers = ["John Smith", "Emma Davis", "Michael Chen", "Sophia Rodriguez", "Raj Patel"];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `log-${i + 1}`,
    date: new Date(2023, 6, 10 - i),
    shift: shifts[i % shifts.length] as any,
    engineer: engineers[i % engineers.length],
    status: statuses[i % statuses.length] as any,
    department: departments[i % departments.length],
    summary: `Regular shift update for ${departments[i % departments.length]}. All systems functioning within normal parameters with minor adjustments to pressure levels.`,
    notes: i % 3 === 0 ? "Note: Observed slight temperature fluctuations in secondary cooling system. Monitoring closely." : undefined,
  }));
};

const SupervisorDashboard = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntryData[]>(generateMockLogs());
  const [filter, setFilter] = useState("all");
  
  const approveLog = (id: string) => {
    setLogs(logs.map(log => 
      log.id === id ? { ...log, status: "Approved" } : log
    ));
    
    toast({
      title: "Log Entry Approved",
      description: "The log entry has been approved successfully.",
    });
  };
  
  const flagLog = (id: string) => {
    setLogs(logs.map(log => 
      log.id === id ? { ...log, status: "Flagged" } : log
    ));
    
    toast({
      title: "Log Entry Flagged",
      description: "The log entry has been flagged for further review.",
    });
  };
  
  const filteredLogs = filter === "all" 
    ? logs 
    : logs.filter(log => log.status.toLowerCase() === filter);
  
  // Analytics data
  const totalLogs = logs.length;
  const pendingLogs = logs.filter(log => log.status === "Pending").length;
  const approvedLogs = logs.filter(log => log.status === "Approved").length;
  const flaggedLogs = logs.filter(log => log.status === "Flagged").length;
  
  const pendingPercentage = (pendingLogs / totalLogs) * 100;
  const approvedPercentage = (approvedLogs / totalLogs) * 100;
  const flaggedPercentage = (flaggedLogs / totalLogs) * 100;

  return (
    <PageTransition>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">Supervisor Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and approve shift logs across your plant
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Select defaultValue="today" onValueChange={() => {}}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last-week">Last 7 Days</SelectItem>
                <SelectItem value="last-month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button className="button-hover-effect">
              Generate Report
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Team Overview"
            subtitle="Current shift status"
            icon={<Users className="h-5 w-5" />}
          >
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Active Engineers</span>
                  <span className="text-sm font-medium">12/15</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Logs Submitted Today</span>
                  <span className="text-sm font-medium">18/24</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Active Shifts</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span>Morning Shift</span>
                    </div>
                    <span className="text-muted-foreground">5 engineers</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <span>Afternoon Shift</span>
                    </div>
                    <span className="text-muted-foreground">4 engineers</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                      <span>Night Shift</span>
                    </div>
                    <span className="text-muted-foreground">3 engineers</span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Log Status"
            subtitle="Approval statistics"
            icon={<ClipboardList className="h-5 w-5" />}
          >
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium">Approved</span>
                  </div>
                  <span className="text-sm font-medium">{approvedLogs}/{totalLogs}</span>
                </div>
                <Progress value={approvedPercentage} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <span className="text-sm font-medium">{pendingLogs}/{totalLogs}</span>
                </div>
                <Progress value={pendingPercentage} className="h-2 bg-muted" indicatorClassName="bg-amber-500" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm font-medium">Flagged</span>
                  </div>
                  <span className="text-sm font-medium">{flaggedLogs}/{totalLogs}</span>
                </div>
                <Progress value={flaggedPercentage} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
              </div>
              
              <div className="pt-2 flex justify-between">
                <Button variant="ghost" size="sm" className="text-sm">
                  View All Stats
                </Button>
                <Badge variant="outline" className="text-xs">
                  Last Updated: {format(new Date(), "HH:mm")}
                </Badge>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Department Activity"
            subtitle="Logs by department"
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Turbine Hall</span>
                  <span className="text-sm font-medium">5 logs</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Boiler Room</span>
                  <span className="text-sm font-medium">4 logs</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Control Room</span>
                  <span className="text-sm font-medium">6 logs</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Water Treatment</span>
                  <span className="text-sm font-medium">3 logs</span>
                </div>
                <Progress value={38} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Electrical Systems</span>
                  <span className="text-sm font-medium">4 logs</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              
              <div className="pt-2">
                <Button variant="ghost" size="sm" className="text-sm">
                  View Detailed Breakdown
                </Button>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle>Log Entries Requiring Review</CardTitle>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <Select defaultValue={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Logs</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {filteredLogs.map((log) => (
                <LogEntry 
                  key={log.id} 
                  data={log} 
                  onApprove={approveLog}
                  onFlag={flagLog}
                />
              ))}
              
              {filteredLogs.length === 0 && (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-muted-foreground">No logs found</h3>
                  <p className="text-muted-foreground">Try changing your filter or date range</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Critical Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="resolved">Recently Resolved</TabsTrigger>
                </TabsList>
                
                <TabsContent value="current">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 border-l-4 border-red-500 pl-3 py-1">
                      <div>
                        <h4 className="font-medium">High Pressure Warning</h4>
                        <p className="text-sm text-muted-foreground">
                          Boiler Room • Reported 2 hours ago
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200">Critical</Badge>
                          <span className="text-xs text-muted-foreground">Assigned to: Michael Chen</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 border-l-4 border-amber-500 pl-3 py-1">
                      <div>
                        <h4 className="font-medium">Temperature Fluctuation</h4>
                        <p className="text-sm text-muted-foreground">
                          Turbine Hall • Reported 5 hours ago
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">Moderate</Badge>
                          <span className="text-xs text-muted-foreground">Assigned to: Emma Davis</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="resolved">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 border-l-4 border-green-500 pl-3 py-1">
                      <div>
                        <h4 className="font-medium">Control System Restart</h4>
                        <p className="text-sm text-muted-foreground">
                          Control Room • Resolved yesterday
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">Resolved</Badge>
                          <span className="text-xs text-muted-foreground">Resolved by: John Smith</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 border-l-4 border-green-500 pl-3 py-1">
                      <div>
                        <h4 className="font-medium">Water Level Alert</h4>
                        <p className="text-sm text-muted-foreground">
                          Water Treatment • Resolved 3 days ago
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">Resolved</Badge>
                          <span className="text-xs text-muted-foreground">Resolved by: Sophia Rodriguez</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      JS
                    </div>
                    <div>
                      <h4 className="font-medium">John Smith</h4>
                      <p className="text-sm text-muted-foreground">Shift Engineer • Morning</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">12 logs submitted</div>
                    <div className="text-xs text-green-600">100% on time</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      ED
                    </div>
                    <div>
                      <h4 className="font-medium">Emma Davis</h4>
                      <p className="text-sm text-muted-foreground">Shift Engineer • Afternoon</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">10 logs submitted</div>
                    <div className="text-xs text-green-600">90% on time</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      MC
                    </div>
                    <div>
                      <h4 className="font-medium">Michael Chen</h4>
                      <p className="text-sm text-muted-foreground">Shift Engineer • Night</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">8 logs submitted</div>
                    <div className="text-xs text-amber-600">75% on time</div>
                  </div>
                </div>
                
                <div className="pt-2 flex justify-center">
                  <Button variant="outline">View Full Team Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default SupervisorDashboard;
