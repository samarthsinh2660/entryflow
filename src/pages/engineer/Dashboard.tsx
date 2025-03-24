
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Clipboard, AlertCircle, ChevronRight, Plus, Send, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/layout/PageTransition";
import DashboardCard from "@/components/ui/DashboardCard";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  department: z.string({
    required_error: "Please select a department",
  }),
  shift: z.string({
    required_error: "Please select a shift",
  }),
  status: z.string({
    required_error: "Please select a status",
  }),
  equipmentStatus: z.string({
    required_error: "Equipment status is required",
  }),
  operationalNotes: z.string().min(10, {
    message: "Operational notes should be at least 10 characters",
  }),
  safetyObservations: z.string().optional(),
  incidentsReported: z.boolean().default(false),
  incidentDetails: z.string().optional(),
  parameters: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ).default([]),
});

const EngineerDashboard = () => {
  const { toast } = useToast();
  const [recentLogs, setRecentLogs] = useState([
    {
      id: 1,
      date: "2023-07-12",
      department: "Turbine Hall",
      shift: "Morning",
      status: "Pending Approval",
    },
    {
      id: 2,
      date: "2023-07-11",
      department: "Boiler Room",
      shift: "Night",
      status: "Pending Approval",
    },
    {
      id: 3,
      date: "2023-07-10",
      department: "Control Room",
      shift: "Afternoon",
      status: "Pending Approval",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [parameters, setParameters] = useState<{ name: string; value: string }[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      shift: "",
      status: "",
      equipmentStatus: "",
      operationalNotes: "",
      safetyObservations: "",
      incidentsReported: false,
      incidentDetails: "",
      parameters: [],
    },
  });

  const addParameter = () => {
    setParameters([...parameters, { name: "", value: "" }]);
  };

  const removeParameter = (index: number) => {
    const newParameters = [...parameters];
    newParameters.splice(index, 1);
    setParameters(newParameters);
  };

  const updateParameter = (index: number, field: 'name' | 'value', value: string) => {
    const newParameters = [...parameters];
    newParameters[index][field] = value;
    setParameters(newParameters);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Add parameters to form values
    values.parameters = parameters;
    console.log(values);
    
    // Add to recent logs
    const newLog = {
      id: recentLogs.length + 1,
      date: format(new Date(), "yyyy-MM-dd"),
      department: values.department,
      shift: values.shift,
      status: "Pending Approval", // Always set to "Pending Approval"
    };
    
    setRecentLogs([newLog, ...recentLogs]);
    setIsDialogOpen(false);
    setParameters([]);
    
    toast({
      title: "Log Entry Submitted",
      description: "Your log entry has been submitted and is pending approval.",
    });
    
    form.reset();
  };

  const incidentsReported = form.watch("incidentsReported");

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
            <h1 className="text-3xl font-bold mb-1">Engineer Dashboard</h1>
            <p className="text-muted-foreground">
              Track and document operational activities
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 button-hover-effect">
                <Plus className="mr-2 h-4 w-4" />
                New Log Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Log Entry</DialogTitle>
                <DialogDescription>
                  Record your operational activities, observations, and any incidents that occurred during your shift.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Turbine Hall">Turbine Hall</SelectItem>
                              <SelectItem value="Boiler Room">Boiler Room</SelectItem>
                              <SelectItem value="Control Room">Control Room</SelectItem>
                              <SelectItem value="Water Treatment">Water Treatment</SelectItem>
                              <SelectItem value="Electrical Systems">Electrical Systems</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shift"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shift <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select shift" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Morning">Morning (6am - 2pm)</SelectItem>
                              <SelectItem value="Afternoon">Afternoon (2pm - 10pm)</SelectItem>
                              <SelectItem value="Night">Night (10pm - 6am)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Need Attention">Need Attention</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Note: All entries require supervisor approval regardless of status.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="equipmentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Status <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select equipment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Operational">All Systems Operational</SelectItem>
                            <SelectItem value="Minor Issues">Operational with Minor Issues</SelectItem>
                            <SelectItem value="Major Issues">Major Issues Detected</SelectItem>
                            <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                            <SelectItem value="Offline">System Offline</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="operationalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operational Notes <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the operational conditions and activities during your shift..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include key readings, changes in parameters, and actions taken.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="safetyObservations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Safety Observations</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Note any safety concerns or observations..." 
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Document potential hazards, near misses, or safety improvements.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Optional Parameters Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Optional Parameters</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addParameter}>
                        <Plus className="h-4 w-4 mr-1" /> Add Parameter
                      </Button>
                    </div>
                    
                    {parameters.length > 0 ? (
                      <div className="space-y-3">
                        {parameters.map((param, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1">
                              <label className="text-sm font-medium">Parameter Name</label>
                              <Input 
                                value={param.name} 
                                onChange={(e) => updateParameter(index, 'name', e.target.value)}
                                placeholder="e.g., Temperature, Pressure"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-sm font-medium">Value</label>
                              <Input 
                                value={param.value} 
                                onChange={(e) => updateParameter(index, 'value', e.target.value)}
                                placeholder="e.g., 350°C, 2.5 MPa"
                              />
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="mt-6"
                              onClick={() => removeParameter(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No parameters added. Click the button above to add key-value pairs for additional measurements or observations.
                      </p>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="incidentsReported"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 mt-1 rounded-sm border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Incidents Reported</FormLabel>
                          <FormDescription>
                            Check this box if any incidents occurred during your shift.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {incidentsReported && (
                    <FormField
                      control={form.control}
                      name="incidentDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Incident Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide details about the incident..." 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Include what happened, when, who was involved, and actions taken.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <DialogFooter>
                    <Button type="submit" className="button-hover-effect">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Log Entry
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DashboardCard
            title="Current Shift"
            subtitle="Overview of your active shift"
            icon={<Clock className="h-5 w-5" />}
          >
            <div className="flex items-center mt-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Active • Morning Shift</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Start Time</span>
                <span className="font-medium">06:00 AM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">End Time</span>
                <span className="font-medium">02:00 PM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Hours Remaining</span>
                <span className="font-medium">3h 45m</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Logs Submitted</span>
                <span className="font-medium">2 of 3</span>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Notifications"
            subtitle="Updates and alerts"
            icon={<AlertCircle className="h-5 w-5" />}
          >
            <div className="space-y-3 mt-2">
              <div className="flex items-start p-2 rounded-md bg-yellow-50 border border-yellow-100">
                <div className="flex-shrink-0 mr-2 mt-0.5">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Maintenance Scheduled</p>
                  <p className="text-xs text-yellow-700">Turbine #3 will undergo routine maintenance tomorrow.</p>
                </div>
              </div>
              
              <div className="flex items-start p-2 rounded-md bg-blue-50 border border-blue-100">
                <div className="flex-shrink-0 mr-2 mt-0.5">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Supervisor Message</p>
                  <p className="text-xs text-blue-700">Please check water treatment parameters hourly.</p>
                </div>
              </div>
              
              <div className="flex items-start p-2 rounded-md bg-red-50 border border-red-100">
                <div className="flex-shrink-0 mr-2 mt-0.5">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-red-800 font-medium">Assignment: Fix Control Panel</p>
                  <p className="text-xs text-red-700">You have been assigned to resolve an issue with the control panel.</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Recent Logs</TabsTrigger>
            <TabsTrigger value="pending">Pending Actions</TabsTrigger>
            <TabsTrigger value="templates">Log Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Log Entries</CardTitle>
                <CardDescription>
                  View and manage your recent shift log entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{log.department}</h4>
                          <p className="text-sm text-muted-foreground">{log.date} • {log.shift} Shift</p>
                        </div>
                        <Badge 
                          variant="secondary"
                        >
                          {log.status}
                        </Badge>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">
                  View All Logs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>
                  Tasks and actions that require your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-md">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Complete Equipment Inspection</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Monthly inspection for Pump Station #2 is due by today
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm">Complete Now</Button>
                          <Button variant="ghost" size="sm">Remind Later</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-md">
                        <Clipboard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Submit End-of-Shift Report</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Complete your shift summary before handover
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm">Start Report</Button>
                          <Button variant="ghost" size="sm">View Template</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Log Templates</CardTitle>
                <CardDescription>
                  Standardized templates for common log entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h4 className="font-medium">Equipment Inspection</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Standard checklist for routine equipment inspections
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Use Template
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h4 className="font-medium">Shift Handover</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Comprehensive shift transition report template
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Use Template
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h4 className="font-medium">Incident Report</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Detailed form for documenting workplace incidents
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Use Template
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h4 className="font-medium">Safety Observation</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Template for recording safety concerns and observations
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default EngineerDashboard;
