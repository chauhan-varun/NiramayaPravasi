'use client';

import { useState } from 'react';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, MessageSquare, PhoneCall, Mail, Send, Clock } from 'lucide-react';

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

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-gray-600">Get help with your healthcare needs</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="contact" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="contact">Contact Support</TabsTrigger>
                  <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="contact">
                  <Card>
                    <CardHeader>
                      <CardTitle>Send us a message</CardTitle>
                      <CardDescription>
                        Our support team will respond to your inquiry as soon as possible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brief description of your issue" {...field} />
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
                                    <SelectTrigger>
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
                                    className="min-h-32"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="mr-2 h-4 w-4" />
                            )}
                            Send Message
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tickets">
                  {supportTickets.length > 0 ? (
                    <div className="space-y-4">
                      {supportTickets.map((ticket) => (
                        <Card key={ticket.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                ticket.status === 'open' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {ticket.status === 'open' ? 'Open' : 'Closed'}
                              </span>
                            </div>
                            <CardDescription>
                              <div className="flex gap-4 text-xs">
                                <div>ID: {ticket.id}</div>
                                <div>Category: {ticket.category}</div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Last updated: {ticket.lastUpdated}</span>
                                </div>
                              </div>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {ticket.messages.map((msg, idx) => (
                                <div 
                                  key={idx} 
                                  className={`flex gap-3 ${
                                    msg.sender === 'You' ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  <div 
                                    className={`rounded-lg p-3 max-w-[80%] ${
                                      msg.sender === 'You' 
                                        ? 'bg-blue-50 text-blue-900' 
                                        : 'bg-gray-100'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-sm">{msg.sender}</span>
                                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                    </div>
                                    <p>{msg.message}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {ticket.status === 'open' && (
                              <div className="mt-4">
                                <div className="relative">
                                  <Input 
                                    placeholder="Type a reply..." 
                                    className="pr-24" 
                                  />
                                  <Button 
                                    size="sm" 
                                    className="absolute right-1 top-1 h-8"
                                  >
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <h3 className="mb-2 text-lg font-medium">No Support Tickets</h3>
                      <p className="text-gray-500 mb-4">You haven't created any support tickets yet.</p>
                      <Button onClick={() => setActiveTab('contact')}>
                        Contact Support
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Get in touch with our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <PhoneCall className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone Support</h3>
                        <p className="text-gray-600">+91 1800 123 4567</p>
                        <p className="text-sm text-gray-500">Monday-Friday: 9 AM - 6 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-gray-600">support@nirmayapravasi.com</p>
                        <p className="text-sm text-gray-500">We respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-gray-600">Available on our website</p>
                        <p className="text-sm text-gray-500">24/7 for urgent issues</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-sm font-medium">Emergency?</p>
                      <p className="text-sm text-gray-500">
                        For medical emergencies, please call our emergency hotline at 
                        <span className="font-medium text-red-500"> 1800 911 0911</span>
                      </p>
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
