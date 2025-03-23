
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { format, subDays } from "date-fns";
import { 
  Search, FileText, Download, Filter, Calendar, CheckSquare, 
  BarChart2, PieChart, TrendingUp, FileBarChart, 
} from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import DashboardCard from "@/components/ui/DashboardCard";
import { LogEntryData } from "@/components/ui/LogEntry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const generateMockLogs = (): LogEntryData[] => {
  const departments = ["Turbine Hall", "Boiler Room", "Control Room", "Water Treatment", "Electrical Systems"];
  const shifts = ["Morning", "Afternoon", "Night"];
  const statuses = ["Pending", "Approved", "Flagged"];
  const engineers = ["John Smith", "Emma Davis", "Michael Chen", "Sophia Rodriguez", "Raj Patel"];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: `log-${i + 1}`,
    date: subDays(new Date(), i % 14),
    shift: shifts[i % shifts.length] as any,
    engineer: engineers[i % engineers.length],
    status: statuses[i % statuses.length] as any,
    department: departments[i % departments.length],
    summary: `Regular shift update for ${departments[i % departments.length]}. All systems functioning within normal parameters with minor adjustments to pressure levels.`,
    notes: i % 3 === 0 ? "Note: Observed slight temperature fluctuations in secondary cooling system. Monitoring closely." : undefined,
  }));
};

const ComplianceDashboard = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntryData[]>(generateMockLogs());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [filters, setFilters] = useState({
    department: "all",
    shift: "all",
    status: "all",
  });
  
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Search Results",
      description: `Found ${filteredLogs.length} logs matching your criteria.`,
    });
  };
  
  const handleExport = (format: string) => {
    toast({
      title: "Export Initiated",
      description: `Exporting ${filteredLogs.length} logs as ${format.toUpperCase()}.`,
    });
  };
  
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDate(undefined);
    setFilters({
      department: "all",
      shift: "all",
      status: "all",
    });
    
    toast({
      title: "Filters Reset",
      description: "All search filters have been cleared.",
    });
  };
  
  // Apply filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.engineer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = filters.department === "all" || log.department === filters.department;
    const matchesShift = filters.shift === "all" || log.shift === filters.shift;
    const matchesStatus = filters.status === "all" || log.status === filters.status;
    const matchesDate = !selectedDate || format(log.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    
    return matchesSearch && matchesDepartment && matchesShift && matchesStatus && matchesDate;
  });
  
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
            <h1 className="text-3xl font-bold mb-1">Compliance Dashboard</h1>
            <p className="text-muted-foreground">
              Search, audit, and report on operational logs
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileBarChart className="mr-2 h-4 w-4" />
              Compliance Report
            </Button>
            <Button className="w-full sm:w-auto button-hover-effect">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>Search & Filter Logs</CardTitle>
              <CardDescription>
                Find specific logs by keyword, date, department, or other criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs by keyword, engineer name, or department..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="button-hover-effect">
                    Search
                  </Button>
                </form>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Department</label>
                    <Select 
                      value={filters.department} 
                      onValueChange={(value) => setFilters({...filters, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
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
                    <label className="text-sm font-medium mb-1 block">Shift</label>
                    <Select 
                      value={filters.shift} 
                      onValueChange={(value) => setFilters({...filters, shift: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Shifts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Shifts</SelectItem>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select 
                      value={filters.status} 
                      onValueChange={(value) => setFilters({...filters, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Flagged">Flagged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <Button variant="ghost" onClick={handleResetFilters} className="text-sm">
                    Reset Filters
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {filteredLogs.length} logs found
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <DashboardCard
            title="Compliance Overview"
            subtitle="Key compliance metrics"
            icon={<CheckSquare className="h-5 w-5" />}
            className="col-span-1 lg:col-span-2"
          >
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">92%</div>
                <div className="text-sm text-green-800">Compliance Rate</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">247</div>
                <div className="text-sm text-blue-800">Logs Reviewed</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">18</div>
                <div className="text-sm text-amber-800">Pending Review</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">5</div>
                <div className="text-sm text-red-800">Compliance Issues</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Safety Protocol Adherence</div>
                <div className="text-sm font-medium">96%</div>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: "96%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Documentation Completeness</div>
                <div className="text-sm font-medium">88%</div>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "88%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Incident Reporting Timeliness</div>
                <div className="text-sm font-medium">94%</div>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "94%" }}></div>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Audit Schedule"
            subtitle="Upcoming compliance reviews"
            icon={<Calendar className="h-5 w-5" />}
            className="col-span-1 lg:col-span-2"
          >
            <div className="mt-4 space-y-4">
              <div className="border rounded-md p-3 bg-blue-50 border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-blue-900">Quarterly Safety Audit</h4>
                    <p className="text-sm text-blue-700">Environmental Health & Safety</p>
                  </div>
                  <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
                    {format(addDays(new Date(), 5), "MMM d")}
                  </Badge>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200 flex justify-between items-center">
                  <span className="text-xs text-blue-600">Status: <span className="font-medium">Preparation</span></span>
                  <Button variant="ghost" size="sm" className="h-7 text-blue-700 hover:text-blue-900 hover:bg-blue-100">
                    View Details
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3 bg-amber-50 border-amber-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-amber-900">ISO 9001 Certification</h4>
                    <p className="text-sm text-amber-700">Quality Management Systems</p>
                  </div>
                  <Badge variant="outline" className="bg-white border-amber-200 text-amber-700">
                    {format(addDays(new Date(), 12), "MMM d")}
                  </Badge>
                </div>
                <div className="mt-2 pt-2 border-t border-amber-200 flex justify-between items-center">
                  <span className="text-xs text-amber-600">Status: <span className="font-medium">Documentation</span></span>
                  <Button variant="ghost" size="sm" className="h-7 text-amber-700 hover:text-amber-900 hover:bg-amber-100">
                    View Details
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3 bg-green-50 border-green-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-green-900">Environmental Compliance</h4>
                    <p className="text-sm text-green-700">EPA Regulatory Review</p>
                  </div>
                  <Badge variant="outline" className="bg-white border-green-200 text-green-700">
                    {format(addDays(new Date(), 21), "MMM d")}
                  </Badge>
                </div>
                <div className="mt-2 pt-2 border-t border-green-200 flex justify-between items-center">
                  <span className="text-xs text-green-600">Status: <span className="font-medium">Scheduled</span></span>
                  <Button variant="ghost" size="sm" className="h-7 text-green-700 hover:text-green-900 hover:bg-green-100">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Displaying {filteredLogs.length} matching log entries
              </CardDescription>
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <Select defaultValue="table" onValueChange={() => {}}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="View as" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="newest" onValueChange={() => {}}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="shift">Shift</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox id="select-all" />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Engineer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Checkbox id={`select-${log.id}`} />
                      </TableCell>
                      <TableCell>{format(log.date, "MMM d, yyyy")}</TableCell>
                      <TableCell>{log.shift}</TableCell>
                      <TableCell>{log.department}</TableCell>
                      <TableCell>{log.engineer}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            log.status === "Approved" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : log.status === "Flagged" 
                                ? "bg-red-50 text-red-700 border-red-200" 
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        <div className="text-muted-foreground">No logs found matching your search criteria</div>
                        <Button variant="outline" onClick={handleResetFilters} className="mt-2">
                          Reset Filters
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 sm:mb-0">
              <span>Showing 1-{Math.min(10, filteredLogs.length)} of {filteredLogs.length} entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => handleExport("csv")}>
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport("pdf")}>
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport("excel")}>
                Export Excel
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

// Helper function for generating future dates
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default ComplianceDashboard;
