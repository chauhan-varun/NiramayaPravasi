'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format, addDays, isSameDay } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Loader2, 
  Bell, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus,
  Check,
  Trash2,
  Edit,
  ChevronDown,
  User,
  CheckCircle2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProtectedRoute from '@/components/protected-route';
import DoctorNavbar from '@/components/doctor-navbar';

// Form validation schema
const reminderFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, { message: 'Time is required.' }),
  patientId: z.string().optional(),
  priority: z.string().min(1, { message: 'Priority is required.' })
});

export default function DoctorReminders() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState(null);
  
  // Form initialization
  const form = useForm({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      time: '',
      patientId: '',
      priority: 'medium'
    }
  });
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      // Mock data for demonstration
      const mockReminders = [
        {
          id: 1,
          title: 'Follow up with patient',
          description: 'Check on Alice Smith\'s recovery progress after surgery',
          date: new Date(2023, 8, 24),
          time: '10:00 AM',
          patient: {
            id: '101',
            name: 'Alice Smith'
          },
          completed: false,
          priority: 'high'
        },
        {
          id: 2,
          title: 'Review lab results',
          description: 'Check Bob Johnson\'s blood test results',
          date: new Date(2023, 8, 25),
          time: '2:00 PM',
          patient: {
            id: '102',
            name: 'Bob Johnson'
          },
          completed: false,
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Conference call',
          description: 'Discuss case with specialist team',
          date: new Date(2023, 8, 26),
          time: '11:30 AM',
          patient: null,
          completed: false,
          priority: 'medium'
        },
        {
          id: 4,
          title: 'Prescription renewal',
          description: 'Renew medication for Carol Williams',
          date: new Date(2023, 8, 22),
          time: '9:00 AM',
          patient: {
            id: '103',
            name: 'Carol Williams'
          },
          completed: true,
          priority: 'low'
        },
        {
          id: 5,
          title: 'Staff meeting',
          description: 'Monthly staff meeting with clinic team',
          date: new Date(2023, 8, 28),
          time: '4:00 PM',
          patient: null,
          completed: false,
          priority: 'high'
        }
      ];
      
      const mockPatients = [
        { id: '101', name: 'Alice Smith' },
        { id: '102', name: 'Bob Johnson' },
        { id: '103', name: 'Carol Williams' },
        { id: '104', name: 'David Wilson' },
        { id: '105', name: 'Eva Brown' }
      ];
      
      setReminders(mockReminders);
      setPatients(mockPatients);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter reminders based on status and date
  const filteredReminders = reminders.filter(reminder => {
    // Filter by status
    if (filterStatus === 'completed' && !reminder.completed) return false;
    if (filterStatus === 'pending' && reminder.completed) return false;
    
    // Filter by date if selected
    if (filterDate && !isSameDay(reminder.date, filterDate)) return false;
    
    return true;
  });

  // Group reminders by date
  const groupedReminders = filteredReminders.reduce((groups, reminder) => {
    const dateString = format(reminder.date, 'yyyy-MM-dd');
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(reminder);
    return groups;
  }, {});

  // Get sorted date keys
  const sortedDateKeys = Object.keys(groupedReminders).sort((a, b) => {
    return new Date(a) - new Date(b);
  });
  
  const onSubmit = async (data) => {
    try {
      // In a real app, send to API
      // For demonstration, just add to local state
      
      const newReminder = {
        id: reminders.length + 1,
        title: data.title,
        description: data.description || '',
        date: data.date,
        time: data.time,
        priority: data.priority,
        completed: false,
        patient: data.patientId ? 
          patients.find(p => p.id === data.patientId) : null
      };
      
      setReminders([...reminders, newReminder]);
      setShowAddReminder(false);
      form.reset();
      
      toast.success('Reminder created successfully');
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to create reminder');
    }
  };
  
  const toggleReminderStatus = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? 
        { ...reminder, completed: !reminder.completed } : 
        reminder
    ));
  };
  
  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast.success('Reminder deleted successfully');
  };
  
  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="min-h-screen bg-background">
        <DoctorNavbar />
        
        <main className="container py-10">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Reminders</h1>
              <p className="text-muted-foreground mt-1">Manage your tasks and follow-ups</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {filterDate ? format(filterDate, 'PPP') : 'All dates'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    onSelect={(date) => setFilterDate(date)}
                    initialFocus
                  />
                  {filterDate && (
                    <div className="p-3 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-center"
                        onClick={() => setFilterDate(null)}
                      >
                        Clear date filter
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={showAddReminder} onOpenChange={setShowAddReminder}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Reminder</DialogTitle>
                    <DialogDescription>
                      Add a new reminder for tasks, follow-ups, or important events
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reminder Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter reminder title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Add more details about the reminder" 
                                className="min-h-24" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date</FormLabel>
                              <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <div
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer text-left"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Select a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </div>
                                </FormControl>
                              </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[
                                    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
                                    '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', 
                                    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', 
                                    '4:30 PM', '5:00 PM', '5:30 PM'
                                  ].map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="patientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Related Patient (Optional)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select patient" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="">None</SelectItem>
                                  {patients.map((patient) => (
                                    <SelectItem key={patient.id} value={patient.id}>
                                      {patient.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create Reminder</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {filteredReminders.length === 0 ? (
                <div className="text-center py-16 bg-muted/50 rounded-lg">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-medium mb-2">No reminders found</h2>
                  <p className="text-muted-foreground mb-6">
                    {filterDate || filterStatus !== 'all' ? 
                      'Try adjusting your filters' : 
                      'Add your first reminder to stay organized'}
                  </p>
                  <Button onClick={() => setShowAddReminder(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>
              ) : (
                sortedDateKeys.map(dateKey => {
                  const date = new Date(dateKey);
                  const isToday = isSameDay(date, new Date());
                  const isTomorrow = isSameDay(date, addDays(new Date(), 1));
                  const isPast = date < new Date() && !isToday;
                  const dateReminders = groupedReminders[dateKey];
                  
                  return (
                    <div key={dateKey}>
                      <h2 className="flex items-center text-lg font-semibold mb-4">
                        <span className={isPast ? 'text-muted-foreground' : ''}>
                          {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : format(date, 'EEEE, MMMM d, yyyy')}
                        </span>
                        {isToday && <Badge className="ml-2 bg-blue-100 text-blue-800">Today</Badge>}
                        {isPast && <Badge variant="outline" className="ml-2">Past</Badge>}
                      </h2>
                      
                      <div className="space-y-3">
                        {dateReminders.map(reminder => (
                          <Card key={reminder.id} className={`overflow-hidden ${reminder.completed ? 'bg-muted/50' : ''}`}>
                            <div className={`h-1 ${
                              reminder.priority === 'high' ? 'bg-red-500' : 
                              reminder.priority === 'medium' ? 'bg-amber-500' : 
                              'bg-green-500'
                            }`}></div>
                            <CardContent className="p-5">
                              <div className="flex items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`font-medium ${reminder.completed ? 'text-muted-foreground line-through' : ''}`}>
                                      {reminder.title}
                                    </h3>
                                    {getPriorityBadge(reminder.priority)}
                                  </div>
                                  
                                  {reminder.description && (
                                    <p className={`text-sm mb-3 ${reminder.completed ? 'text-muted-foreground' : ''}`}>
                                      {reminder.description}
                                    </p>
                                  )}
                                  
                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>{reminder.time}</span>
                                    </div>
                                    
                                    {reminder.patient && (
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        <span>{reminder.patient.name}</span>
                                      </div>
                                    )}
                                    
                                    {reminder.completed && (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        <span>Completed</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant={reminder.completed ? "outline" : "default"} 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => toggleReminderStatus(reminder.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" size="icon" className="h-8 w-8">
                                        <ChevronDown className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem className="flex gap-2">
                                        <Edit className="h-4 w-4" />
                                        <span>Edit</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="flex gap-2 text-red-600" 
                                        onClick={() => deleteReminder(reminder.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
