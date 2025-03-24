
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Bell, Search, Clipboard, Filter, CheckCircle, AlertTriangle, XCircle, UserCheck } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import DashboardCard from "@/components/ui/DashboardCard";
import LogEntry, { LogEntryData } from "@/components/ui/LogEntry";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const generateMockLogs = (): LogEntryData[] => {
  const departments = ["Turbine Hall", "Boiler Room", "Control Room", "Water Treatment", "Electrical Systems"];
  const shifts = ["Morning", "Afternoon", "Night"];
  const statuses = ["Pending", "Approved", "Need Attention", "Critical"];
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

const generateNotifications = () => {
  return [
    {
      id: "notif-1",
      type: "attention",
      title: "Need Attention: Pressure Valve",
      description: "Boiler room pressure valve reading above normal range.",
      timestamp: new Date(2023, 6, 10, 9, 32),
      read: false,
      department: "Boiler Room"
    },
    {
      id: "notif-2",
      type: "critical",
      title: "Critical: Temperature Spike",
      description: "Turbine hall cooling system showing critical temperature readings.",
      timestamp: new Date(2023, 6, 10, 8, 17),
      read: false,
      department: "Turbine Hall"
    },
    {
      id: "notif-3",
      type: "resolved",
      title: "Issue Resolved: Water Level",
      description: "Water treatment system level issue has been resolved by Emma Davis.",
      timestamp: new Date(2023, 6, 9, 14, 45),
      read: true,
      department: "Water Treatment"
    },
    {
      id: "notif-4",
      type: "pending",
      title: "Pending Approval: Log Entry",
      description: "Normal conditions log submitted by Michael Chen needs your review.",
      timestamp: new Date(2023, 6, 9, 11, 20),
      read: true,
      department: "Control Room"
    },
  ];
};

const SupervisorDashboard = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntryData[]>(generateMockLogs());
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notifications, setNotifications] = useState(generateNotifications());
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [currentLogForAssignment, setCurrentLogForAssignment] = useState<string | null>(null);
  
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

  const assignLog = (id: string) => {
    setCurrentLogForAssignment(id);
    setShowAssignDialog(true);
  };

  const handleAssignment = (engineerId: string) => {
    if (currentLogForAssignment) {
      // In a real app, you would send this to your backend
      console.log(`Assigning log ${currentLogForAssignment} to engineer ${engineerId}`);
      
      toast({
        title: "Engineer Assigned",
        description: "The issue has been assigned to the selected engineer.",
      });
      
      setShowAssignDialog(false);
      setCurrentLogForAssignment(null);
    }
  };
  
  // Apply all filters together
  const filteredLogs = logs.filter(log => {
    // Status filter
    if (statusFilter !== 'all' && log.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    
    // Department filter
    if (departmentFilter !== 'all' && log.department !== departmentFilter) {
      return false;
    }
    
    // Date filter (simplified for demo)
    if (dateFilter === 'today') {
      const today = new Date();
      if (log.date.getDate() !== today.getDate() || 
          log.date.getMonth() !== today.getMonth() || 
          log.date.getFullYear() !== today.getFullYear()) {
        return false;
      }
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (log.date.getDate() !== yesterday.getDate() || 
          log.date.getMonth() !== yesterday.getMonth() || 
          log.date.getFullYear() !== yesterday.getFullYear()) {
        return false;
      }
    } else if (dateFilter === 'this-week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (log.date < sevenDaysAgo) {
        return false;
      }
    }
    
    // Search term (case insensitive)
    if (searchTerm && !log.summary.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !log.department.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.engineer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const unreadNotifications = notifications.filter(notif => !notif.read).length;
  
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been marked as read.",
    });
  };

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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex justify-between items-center">
                    <span>Notifications</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs"
                    >
                      Mark all as read
                    </Button>
                  </DialogTitle>
                  <DialogDescription>
                    Recent alerts and messages requiring your attention
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto space-y-3 py-4">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-3 rounded-lg border ${notif.read ? 'bg-white' : 'bg-blue-50'}`}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 mr-3 rounded-full ${
                            notif.type === 'critical' ? 'bg-red-100' : 
                            notif.type === 'attention' ? 'bg-amber-100' : 
                            notif.type === 'resolved' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {notif.type === 'critical' ? <XCircle className="h-5 w-5 text-red-500" /> : 
                             notif.type === 'attention' ? <AlertTriangle className="h-5 w-5 text-amber-500" /> :
                             notif.type === 'resolved' ? <CheckCircle className="h-5 w-5 text-green-500" /> :
                             <Bell className="h-5 w-5 text-blue-500" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{notif.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{notif.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                {format(notif.timestamp, "MMM d, h:mm a")} • {notif.department}
                              </span>
                              {(notif.type === 'attention' || notif.type === 'critical') && (
                                <Button size="sm" variant="outline" className="text-xs h-7">
                                  <UserCheck className="h-3 w-3 mr-1" /> Assign
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No new notifications</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Select defaultValue="today" onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button className="button-hover-effect">
              Generate Report
            </Button>
          </div>
        </motion.div>
        
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Log Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by engineer, department or content..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Turbine Hall">Turbine Hall</SelectItem>
                      <SelectItem value="Boiler Room">Boiler Room</SelectItem>
                      <SelectItem value="Control Room">Control Room</SelectItem>
                      <SelectItem value="Water Treatment">Water Treatment</SelectItem>
                      <SelectItem value="Electrical Systems">Electrical Systems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="need attention">Need Attention</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle>Log Entries Requiring Review</CardTitle>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredLogs.length} of {logs.length} entries
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{log.department}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(log.date, "MMMM d, yyyy")} • {log.shift} Shift • {log.engineer}
                      </p>
                      <p className="my-2">{log.summary}</p>
                      {log.notes && (
                        <p className="text-sm italic text-muted-foreground">{log.notes}</p>
                      )}
                    </div>
                    <Badge 
                      variant={
                        log.status === "Approved" 
                          ? "outline" 
                          : log.status === "Pending" 
                            ? "secondary"
                            : log.status === "Need Attention"
                              ? "warning"
                              : "destructive"
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => assignLog(log.id)}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => flagLog(log.id)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Flag
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => approveLog(log.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredLogs.length === 0 && (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-muted-foreground">No logs found</h3>
                  <p className="text-muted-foreground">Try changing your filter or search term</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div>
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
        </div>
        
        {/* Engineer Assignment Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign to Engineer</DialogTitle>
              <DialogDescription>
                Select an engineer to resolve this issue.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <div 
                className="flex items-center p-3 rounded-lg border hover:bg-slate-50 cursor-pointer"
                onClick={() => handleAssignment("eng-1")}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  JS
                </div>
                <div>
                  <h4 className="font-medium">John Smith</h4>
                  <p className="text-xs text-muted-foreground">Morning Shift</p>
                </div>
              </div>
              
              <div 
                className="flex items-center p-3 rounded-lg border hover:bg-slate-50 cursor-pointer"
                onClick={() => handleAssignment("eng-2")}  
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                  ED
                </div>
                <div>
                  <h4 className="font-medium">Emma Davis</h4>
                  <p className="text-xs text-muted-foreground">Afternoon Shift</p>
                </div>
              </div>
              
              <div 
                className="flex items-center p-3 rounded-lg border hover:bg-slate-50 cursor-pointer"
                onClick={() => handleAssignment("eng-3")}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  MC
                </div>
                <div>
                  <h4 className="font-medium">Michael Chen</h4>
                  <p className="text-xs text-muted-foreground">Night Shift</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default SupervisorDashboard;
