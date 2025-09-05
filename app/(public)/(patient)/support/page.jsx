'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { HeadphonesIcon, Mail, Phone, Clock, MessageSquare, FileText, Send, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import PatientNavbar from '@/components/patient-navbar';

const supportSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  priority: z.string().min(1, 'Please select a priority level'),
});

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      subject: 'Unable to book appointment',
      category: 'Appointments',
      status: 'open',
      priority: 'medium',
      created: '2025-09-01',
      lastUpdate: '2025-09-02',
      messages: 3
    },
    {
      id: 'TKT-002',
      subject: 'Password reset issue',
      category: 'Account',
      status: 'resolved',
      priority: 'high',
      created: '2025-08-28',
      lastUpdate: '2025-08-29',
      messages: 5
    }
  ]);

  const form = useForm({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      category: '',
      subject: '',
      message: '',
      priority: '',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new ticket to the list
      const newTicket = {
        id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: data.subject,
        category: data.category,
        status: 'open',
        priority: data.priority,
        created: new Date().toISOString().split('T')[0],
        lastUpdate: new Date().toISOString().split('T')[0],
        messages: 1
      };
      
      setTickets([newTicket, ...tickets]);
      form.reset();
      toast.success('Support ticket created successfully!');
    } catch (error) {
      toast.error('Failed to create support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientNavbar />
      
      <main className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">Get help with your account, appointments, and more</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Contact Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeadphonesIcon className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Phone Support</p>
                    <p className="text-sm text-blue-700">+1 (555) 123-HELP</p>
                    <p className="text-xs text-blue-600">24/7 Available</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Email Support</p>
                    <p className="text-sm text-green-700">support@nirmayapravasi.com</p>
                    <p className="text-xs text-green-600">Response within 24hrs</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Office Hours</p>
                    <p className="text-sm text-purple-700">Mon-Fri: 8AM - 8PM</p>
                    <p className="text-xs text-purple-600">Weekend: 9AM - 5PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-900">Medical Emergency</span>
                  </div>
                  <p className="text-sm text-red-700">For medical emergencies, call 911 immediately</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="new-ticket" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="new-ticket">New Ticket</TabsTrigger>
                <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              {/* New Ticket Tab */}
              <TabsContent value="new-ticket">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Create Support Ticket
                    </CardTitle>
                    <CardDescription>
                      Describe your issue and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="appointments">Appointments</SelectItem>
                                    <SelectItem value="account">Account Issues</SelectItem>
                                    <SelectItem value="billing">Billing & Payment</SelectItem>
                                    <SelectItem value="medical-records">Medical Records</SelectItem>
                                    <SelectItem value="technical">Technical Support</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
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
                                    <SelectItem value="low">Low - General inquiry</SelectItem>
                                    <SelectItem value="medium">Medium - Issue affecting service</SelectItem>
                                    <SelectItem value="high">High - Urgent assistance needed</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Brief description of your issue" />
                              </FormControl>
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
                                  {...field} 
                                  placeholder="Please provide detailed information about your issue..."
                                  className="min-h-[120px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          disabled={loading} 
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? 'Creating...' : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Create Ticket
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* My Tickets Tab */}
              <TabsContent value="my-tickets">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      My Support Tickets
                    </CardTitle>
                    <CardDescription>
                      Track the status of your support requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tickets.length > 0 ? (
                      <div className="space-y-4">
                        {tickets.map((ticket) => (
                          <Card key={ticket.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                                <div className="flex items-center gap-3 mb-2 md:mb-0">
                                  <span className="font-mono text-sm font-medium text-blue-600">
                                    {ticket.id}
                                  </span>
                                  <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                <div>
                                  <span className="block text-xs text-gray-500">Category</span>
                                  <span>{ticket.category}</span>
                                </div>
                                <div>
                                  <span className="block text-xs text-gray-500">Created</span>
                                  <span>{ticket.created}</span>
                                </div>
                                <div>
                                  <span className="block text-xs text-gray-500">Last Update</span>
                                  <span>{ticket.lastUpdate}</span>
                                </div>
                                <div>
                                  <span className="block text-xs text-gray-500">Messages</span>
                                  <span>{ticket.messages}</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                                {ticket.status === 'open' && (
                                  <Button variant="outline" size="sm">
                                    Add Reply
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                        <p className="text-gray-500">You haven't created any support tickets yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Frequently Asked Questions
                    </CardTitle>
                    <CardDescription>
                      Find quick answers to common questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          question: "How do I book an appointment?",
                          answer: "You can book an appointment by navigating to the Appointments page and clicking 'Book New Appointment'. Select your preferred doctor, date, and time slot."
                        },
                        {
                          question: "How can I access my medical records?",
                          answer: "Your medical records are available in the Records section. You can view, download, and share your documents from there."
                        },
                        {
                          question: "What should I do if I forgot my password?",
                          answer: "Click on 'Forgot Password' on the login page and follow the instructions to reset your password via email."
                        },
                        {
                          question: "How do I update my personal information?",
                          answer: "Go to your Profile page where you can edit your personal details, contact information, and medical information."
                        },
                        {
                          question: "Can I cancel or reschedule my appointment?",
                          answer: "Yes, you can cancel or reschedule appointments from the Appointments page. Please note cancellation policies may apply."
                        }
                      ].map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
