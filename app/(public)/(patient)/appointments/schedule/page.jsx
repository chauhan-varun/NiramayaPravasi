'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ScheduleAppointment() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const form = useForm({
    defaultValues: {
      doctorId: '',
      appointmentDate: '',
      appointmentTime: ''
    }
  });

  // Mock doctor data
  const doctors = [
    { id: '1', name: 'Dr. Sharma', specialty: 'General Physician' },
    { id: '2', name: 'Dr. Patel', specialty: 'Dentist' },
    { id: '3', name: 'Dr. Gupta', specialty: 'Cardiologist' },
    { id: '4', name: 'Dr. Singh', specialty: 'Orthopedic' },
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    form.setValue('appointmentDate', date);
    
    // Generate mock available times based on the selected date
    // In a real app, this would be fetched from the backend
    const times = [];
    const dayOfWeek = date.getDay();
    
    // Weekdays have more slots than weekends
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      times.push('9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM');
    } else {
      times.push('10:00 AM', '11:00 AM', '12:00 PM');
    }
    
    setAvailableTimes(times);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Convert data to the format expected by the API
      const formattedData = {
        doctorId: data.doctorId,
        appointmentDate: format(data.appointmentDate, 'yyyy-MM-dd'),
        appointmentTime: data.appointmentTime
      };
      
      // Mock API call - in a real app this would be a fetch call
      console.log('Scheduling appointment:', formattedData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Appointment scheduled successfully!');
      router.push('/appointments');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error('Failed to schedule appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        <main className="container py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Schedule Appointment</h1>
              <p className="text-gray-600">Book a new appointment with a doctor</p>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="doctorId"
                    rules={{ required: 'Please select a doctor' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Doctor</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {doctors.map(doctor => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                {doctor.name} - {doctor.specialty}
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
                    name="appointmentDate"
                    rules={{ required: 'Please select a date' }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Appointment Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => handleDateSelect(date)}
                              disabled={(date) => 
                                date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                                date > new Date(new Date().setDate(new Date().getDate() + 30))
                              }
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
                    name="appointmentTime"
                    rules={{ required: 'Please select a time' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Time</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!selectedDate}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTimes.length > 0 ? (
                              availableTimes.map(time => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                Select a date first
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    Schedule Appointment
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}
