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

  const [currentDate] = useState(new Date());

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        {/* Hero header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="container py-6 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Schedule Appointment</h1>
                <p className="text-blue-100 mt-1">
                  {format(currentDate, 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <main className="container py-6 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Steps indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">1</div>
                  <span className="text-xs mt-1 font-medium text-blue-600">Doctor</span>
                </div>
                <div className="flex-1 h-1 bg-blue-200 mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">2</div>
                  <span className="text-xs mt-1 text-gray-500">Date</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-medium">3</div>
                  <span className="text-xs mt-1 text-gray-500">Time</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-medium">4</div>
                  <span className="text-xs mt-1 text-gray-500">Confirm</span>
                </div>
              </div>
            </div>
            
            <Card className="border-2 shadow-sm">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                      {/* Doctor selection section */}
                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                          <User className="h-5 w-5 text-blue-600" />
                          Select a Doctor
                        </h2>
                        
                        <FormField
                          control={form.control}
                          name="doctorId"
                          rules={{ required: 'Please select a doctor' }}
                          render={({ field }) => (
                            <FormItem>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {doctors.map(doctor => (
                                  <div 
                                    key={doctor.id}
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                      field.value === doctor.id 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                    onClick={() => field.onChange(doctor.id)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {doctor.name.split(' ')[1]?.[0] || doctor.name[0]}
                                      </div>
                                      <div>
                                        <h3 className="font-medium">{doctor.name}</h3>
                                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Date selection section */}
                      <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          Select Date
                        </h2>
                        
                        <FormField
                          control={form.control}
                          name="appointmentDate"
                          rules={{ required: 'Please select a date' }}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <div className="bg-gray-50 p-4 rounded-lg border-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={`w-full pl-3 text-left font-normal border-2 ${
                                          !field.value ? "text-muted-foreground" : ""
                                        }`}
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
                                      className="rounded-md border-2"
                                    />
                                  </PopoverContent>
                                </Popover>
                                
                                {field.value && (
                                  <div className="mt-4 text-sm text-blue-600">
                                    Selected: <span className="font-medium">{format(field.value, 'EEEE, MMMM do, yyyy')}</span>
                                  </div>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Time selection section */}
                      <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                          <Clock className="h-5 w-5 text-blue-600" />
                          Select Time
                        </h2>
                        
                        <FormField
                          control={form.control}
                          name="appointmentTime"
                          rules={{ required: 'Please select a time' }}
                          render={({ field }) => (
                            <FormItem>
                              {selectedDate ? (
                                <div>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {availableTimes.map(time => (
                                      <div
                                        key={time}
                                        className={`border-2 rounded-md py-2 px-3 text-center cursor-pointer transition-all ${
                                          field.value === time 
                                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                            : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                        onClick={() => field.onChange(time)}
                                      >
                                        <span className="font-medium">{time}</span>
                                      </div>
                                    ))}
                                  </div>
                                  {field.value && (
                                    <p className="mt-3 text-sm text-blue-600">
                                      Selected time: <span className="font-medium">{field.value}</span>
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed text-center">
                                  <p className="text-gray-500">Please select a date first to view available time slots</p>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700" 
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Clock className="mr-2 h-4 w-4" />
                        )}
                        Schedule Appointment
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center mt-3">
                        By scheduling an appointment, you agree to our cancellation policy.
                        You can reschedule or cancel up to 24 hours before your appointment.
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}
