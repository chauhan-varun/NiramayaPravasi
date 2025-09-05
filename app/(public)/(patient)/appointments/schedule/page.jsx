'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Search, MapPin, Phone, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import PatientNavbar from '@/components/patient-navbar';

const appointmentSchema = z.object({
  doctor: z.string().min(1, 'Please select a doctor'),
  specialty: z.string().min(1, 'Please select a specialty'),
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  reason: z.string().min(10, 'Please provide a reason for your visit (at least 10 characters)'),
  notes: z.string().optional(),
});

export default function ScheduleAppointmentPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctor: '',
      specialty: '',
      date: '',
      timeSlot: '',
      reason: '',
      notes: '',
    }
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    setSpecialties([
      { id: 'cardiology', name: 'Cardiology' },
      { id: 'general', name: 'General Medicine' },
      { id: 'dermatology', name: 'Dermatology' },
      { id: 'orthopedics', name: 'Orthopedics' },
      { id: 'neurology', name: 'Neurology' },
      { id: 'pediatrics', name: 'Pediatrics' },
    ]);

    setDoctors([
      {
        id: 'dr-johnson',
        name: 'Dr. Sarah Johnson',
        specialty: 'cardiology',
        rating: 4.8,
        experience: '15 years',
        location: 'Heart Care Clinic',
        phone: '+15551234567',
        nextAvailable: '2025-09-08',
        image: null
      },
      {
        id: 'dr-chen',
        name: 'Dr. Michael Chen',
        specialty: 'general',
        rating: 4.9,
        experience: '12 years',
        location: 'Primary Care Center',
        phone: '+15559876543',
        nextAvailable: '2025-09-09',
        image: null
      },
      {
        id: 'dr-davis',
        name: 'Dr. Emily Davis',
        specialty: 'dermatology',
        rating: 4.7,
        experience: '10 years',
        location: 'Skin Health Clinic',
        phone: '+15554567890',
        nextAvailable: '2025-09-10',
        image: null
      },
      {
        id: 'dr-wilson',
        name: 'Dr. Robert Wilson',
        specialty: 'orthopedics',
        rating: 4.6,
        experience: '18 years',
        location: 'Bone & Joint Center',
        phone: '+15553210987',
        nextAvailable: '2025-09-11',
        image: null
      }
    ]);
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const selectedSpecialty = form.watch('specialty');
    return !selectedSpecialty || doctor.specialty === selectedSpecialty;
  });

  const generateTimeSlots = (date) => {
    const slots = [];
    const startTime = 9; // 9 AM
    const endTime = 17; // 5 PM
    
    for (let hour = startTime; hour < endTime; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    
    return slots.map(time => {
      const [hour, minute] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hour), parseInt(minute));
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return {
        value: time,
        label: formattedTime,
        available: Math.random() > 0.3 // Random availability for demo
      };
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Appointment scheduled successfully!');
      setStep(4); // Success step
    } catch (error) {
      toast.error('Failed to schedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor);
    form.setValue('doctor', doctorId);
    form.setValue('specialty', doctor.specialty);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    form.setValue('date', date);
    setAvailableSlots(generateTimeSlots(date));
    setStep(3);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    form.setValue('timeSlot', timeSlot);
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        <main className="container mx-auto py-8 px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Scheduled!</h1>
              <p className="text-gray-600 mb-6">
                Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-gray-900 mb-3">Appointment Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span className="font-medium">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{form.getValues('date')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{form.getValues('timeSlot')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{selectedDoctor?.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Link href="/appointments">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View My Appointments
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientNavbar />
      
      <main className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Appointment</h1>
          <p className="text-gray-600">Book your appointment with our healthcare providers</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                <div className={`ml-2 mr-4 text-sm font-medium ${
                  step >= stepNumber ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {stepNumber === 1 && 'Select Doctor'}
                  {stepNumber === 2 && 'Choose Date'}
                  {stepNumber === 3 && 'Confirm Details'}
                </div>
                {stepNumber < 3 && (
                  <div className={`h-0.5 w-16 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Specialty & Doctor</CardTitle>
                <CardDescription>Choose a medical specialty and preferred doctor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label htmlFor="specialty" className="text-sm font-medium text-gray-700 mb-2 block">
                    Medical Specialty (Optional)
                  </Label>
                  <Select onValueChange={(value) => form.setValue('specialty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All specialties</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleDoctorSelect(doctor.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-sm text-gray-600">{specialties.find(s => s.id === doctor.specialty)?.name}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">★</span>
                            <span>{doctor.rating} • {doctor.experience} experience</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Next available: {doctor.nextAvailable}</span>
                          </div>
                        </div>
                        
                        <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                          Select Doctor
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Choose Date */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>Choose your preferred appointment date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">
                    Appointment Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    disabled={!form.watch('date')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Confirm Details */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Confirm Appointment Details</CardTitle>
                <CardDescription>Review and confirm your appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Time Slot Selection */}
                    <FormField
                      control={form.control}
                      name="timeSlot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Time Slots</FormLabel>
                          <div className="grid grid-cols-3 gap-2">
                            {availableSlots.map((slot) => (
                              <Button
                                key={slot.value}
                                type="button"
                                variant={field.value === slot.value ? "default" : "outline"}
                                disabled={!slot.available}
                                onClick={() => handleTimeSlotSelect(slot.value)}
                                className={`text-sm ${!slot.available ? 'opacity-50' : ''}`}
                              >
                                {slot.label}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Visit</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Please describe the reason for your appointment..."
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Any additional information you'd like to share..."
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Appointment Summary</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Doctor:</span>
                          <span className="font-medium">{selectedDoctor?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">{form.watch('date')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">{form.watch('timeSlot')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium">{selectedDoctor?.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loading ? 'Scheduling...' : 'Schedule Appointment'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
