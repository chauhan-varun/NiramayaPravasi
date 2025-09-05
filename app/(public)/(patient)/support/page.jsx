'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Loader2, MessageSquare, PhoneCall, Mail, Send, Clock, Search, 
  Filter, X, AlertCircle, CheckCircle, HelpCircle, FileText, 
  Phone, CircleHelp, Heart, User
} from 'lucide-react';

const contactFormSchema = z.object({
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export default function PatientSupport() {
  const [activeTab, setActiveTab] = useState('contact');
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: '',
      category: '',
      message: ''
    }
  });
  
  // Mock support tickets
  const supportTickets = [
    {
      id: 'TKT-1234',
      subject: 'Issue with appointment booking',
      status: 'open',
      createdAt: '2023-09-15',
      lastUpdated: '2023-09-16',
      category: 'Appointments',
      messages: [
        {
          sender: 'You',
          message: 'I\'m unable to book an appointment with Dr. Sharma for next week.',
          timestamp: '2023-09-15 14:30'
        },
        {
          sender: 'Support Team',
          message: 'Thank you for reaching out. We are looking into this issue and will get back to you shortly.',
          timestamp: '2023-09-16 10:15'
        }
      ]
    },
    {
      id: 'TKT-1122',
      subject: 'Medical records access problem',
      status: 'closed',
      createdAt: '2023-09-01',
      lastUpdated: '2023-09-03',
      category: 'Records',
      messages: [
        {
          sender: 'You',
          message: 'I can\'t access my recent test reports.',
          timestamp: '2023-09-01 09:45'
        },
        {
          sender: 'Support Team',
          message: 'We have fixed the issue. You should now be able to access your reports.',
          timestamp: '2023-09-03 11:20'
        }
      ]
    }
  ];
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Mock API call - in a real app this would be a fetch call
      console.log('Submitting support request:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Your message has been sent successfully. We will get back to you soon.');
      form.reset();
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const [currentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Filter support tickets based on search and status filter
  const filteredTickets = supportTickets.filter(ticket => {
    // Status filter
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
    
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.category.toLowerCase().includes(searchLower) ||
        ticket.messages.some(msg => msg.message.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    if (status === 'open') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Open
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 gap-1">
          <CheckCircle className="w-3 h-3" />
          Closed
        </Badge>
      );
    }
  };
  
  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        {/* Hero header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="container py-8 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Support Center</h1>
                <p className="text-blue-100 mt-1">
                  {format(currentDate, 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  onClick={() => setActiveTab('contact')}
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                <Button 
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => setActiveTab('tickets')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Tickets
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <main className="container py-6 px-4 sm:px-6">
          {/* Common help topics */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Common Help Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-blue-50 border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-blue-800">Account Help</h3>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-100 hover:bg-green-100 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-800">Booking Issues</h3>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-purple-800">Medical Records</h3>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-100 hover:bg-orange-100 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-medium text-orange-800">Emergency Help</h3>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="contact" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-white p-1">
                  <TabsTrigger value="contact" className="rounded-md px-5 py-2">Contact Support</TabsTrigger>
                  <TabsTrigger value="tickets" className="rounded-md px-5 py-2">Support Tickets</TabsTrigger>
                </TabsList>
                
                {/* Contact form tab */}
                <TabsContent value="contact">
                  <Card className="border-2">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/30 border-b">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <CardTitle>Send us a message</CardTitle>
                      </div>
                      <CardDescription>
                        Our support team will respond to your inquiry as soon as possible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Brief description of your issue" 
                                    {...field} 
                                    className="border-2 focus-visible:ring-blue-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="border-2">
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="appointments">Appointments</SelectItem>
                                    <SelectItem value="records">Medical Records</SelectItem>
                                    <SelectItem value="account">Account Issues</SelectItem>
                                    <SelectItem value="billing">Billing & Payments</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Please describe your issue in detail" 
                                    className="min-h-32 border-2 focus-visible:ring-blue-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="text-xs text-gray-500 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                            <p>
                              Our support team typically responds within 24 hours. For urgent medical concerns,
                              please call our support line directly at <span className="font-medium">+91 1800 123 4567</span>.
                            </p>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t flex justify-end py-4">
                      <Button 
                        onClick={form.handleSubmit(onSubmit)} 
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        Send Message
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* FAQ Section */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CircleHelp className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-medium">Frequently Asked Questions</h2>
                    </div>
                    
                    <div className="space-y-3">
                      <Card>
                        <CardContent className="p-4">
                          <div>
                            <h3 className="font-medium">How do I reschedule my appointment?</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              You can reschedule an appointment through the Appointments page up to 24 hours before your scheduled time without any penalty.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div>
                            <h3 className="font-medium">How can I access my medical records?</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              All your medical records are available in the Records section. You can view and download your reports, prescriptions, and other medical documents.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Support tickets tab */}
                <TabsContent value="tickets">
                  {/* Search and filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start sm:items-center">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        type="search" 
                        placeholder="Search tickets..." 
                        className="pl-9 pr-4 border-2" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2 self-start">
                      <Button
                        variant={filterStatus === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('all')}
                      >
                        All
                      </Button>
                      <Button
                        variant={filterStatus === 'open' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('open')}
                        className={filterStatus === 'open' ? '' : 'text-green-600'}
                      >
                        Open
                      </Button>
                      <Button
                        variant={filterStatus === 'closed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('closed')}
                        className={filterStatus === 'closed' ? '' : 'text-gray-600'}
                      >
                        Closed
                      </Button>
                    </div>
                  </div>
                  
                  {filteredTickets.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTickets.map((ticket) => (
                        <Card key={ticket.id} className="border-2">
                          <CardHeader className="pb-3 border-b">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  ticket.status === 'open' ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                  {ticket.status === 'open' ? (
                                    <MessageSquare className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <CheckCircle className="h-5 w-5 text-gray-600" />
                                  )}
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                  <CardDescription>
                                    <div className="flex items-center gap-3 text-xs">
                                      <span className="font-medium">ID: {ticket.id}</span>
                                      <span>{ticket.category}</span>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>Updated: {ticket.lastUpdated}</span>
                                      </div>
                                    </div>
                                  </CardDescription>
                                </div>
                              </div>
                              <StatusBadge status={ticket.status} />
                            </div>
                          </CardHeader>
                          
                          <CardContent className="py-4">
                            <div className="space-y-4">
                              {ticket.messages.map((msg, idx) => (
                                <div 
                                  key={idx} 
                                  className={`flex gap-3 ${
                                    msg.sender === 'You' ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  {msg.sender !== 'You' && (
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                                        SP
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  
                                  <div 
                                    className={`rounded-lg p-3 max-w-[85%] ${
                                      msg.sender === 'You' 
                                        ? 'bg-blue-50 text-blue-900 rounded-tr-none' 
                                        : 'bg-gray-100 rounded-tl-none'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-sm">{msg.sender}</span>
                                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                    </div>
                                    <p className="text-sm">{msg.message}</p>
                                  </div>
                                  
                                  {msg.sender === 'You' && (
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-green-600 text-white text-xs">
                                        YOU
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            {ticket.status === 'open' && (
                              <div className="mt-6">
                                <div className="relative">
                                  <Textarea 
                                    placeholder="Type your reply here..." 
                                    className="min-h-20 pr-24 border-2 focus-visible:ring-blue-500" 
                                  />
                                  <Button 
                                    size="sm" 
                                    className="absolute right-2 bottom-2"
                                  >
                                    <Send className="h-4 w-4 mr-1" />
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                          
                          <CardFooter className="bg-gray-50 border-t py-3 flex justify-between">
                            <div className="text-xs text-gray-500">
                              Created on {ticket.createdAt}
                            </div>
                            {ticket.status === 'open' ? (
                              <Button variant="outline" size="sm">
                                Close Ticket
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                Reopen Ticket
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border-2 border-dashed p-8 text-center">
                      <div className="inline-flex h-12 w-12 rounded-full bg-blue-100 p-2 mb-3">
                        <MessageSquare className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Support Tickets Found</h3>
                      <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        {searchQuery || filterStatus !== 'all' ? 
                          'No tickets match your search criteria.' : 
                          'You haven\'t created any support tickets yet.'
                        }
                      </p>
                      <div className="flex justify-center gap-3">
                        {(searchQuery || filterStatus !== 'all') && (
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setSearchQuery('');
                              setFilterStatus('all');
                            }}
                          >
                            Clear Filters
                          </Button>
                        )}
                        <Button 
                          onClick={() => setActiveTab('contact')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Support information sidebar */}
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PhoneCall className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Get in touch with our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Phone className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone Support</h3>
                        <p className="text-blue-600 font-medium">+91 1800 123 4567</p>
                        <p className="text-xs text-gray-500 mt-1">Monday-Friday: 9 AM - 6 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Mail className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-green-600 font-medium">support@nirmayapravasi.com</p>
                        <p className="text-xs text-gray-500 mt-1">We respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-purple-600 font-medium">Available on our website</p>
                        <p className="text-xs text-gray-500 mt-1">24/7 for urgent issues</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-red-50 border-t">
                  <div className="flex items-start gap-2">
                    <div className="bg-red-100 p-1 rounded-full mt-0.5">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-red-800">Medical Emergency?</p>
                      <p className="text-xs text-red-700">
                        Call our emergency hotline at <span className="font-bold">1800 911 0911</span>
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Support hours card */}
              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Support Hours</CardTitle>
                </CardHeader>
                <CardContent className="pt-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                    <div className="pt-2 text-xs text-gray-500">
                      All times are in Indian Standard Time (IST)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}
