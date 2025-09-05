'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  UserCog, 
  Stethoscope, 
  Heart, 
  Calendar, 
  FileText, 
  Phone, 
  ArrowRight, 
  CheckCircle, 
  MapPin,
  Languages,
  Globe,
  HeadphonesIcon
} from 'lucide-react';
import Navbar from '@/components/navbar';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/30"></div>
        
        <div className="container relative py-16 md:py-24 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="/nirmaya-pravasi-logo.png" 
                  alt="Nirmaya Pravasi" 
                  className="h-12 w-auto"
                  onError={(e) => e.target.style.display = 'none'} 
                />
                <div className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Government of Kerala Initiative
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-md">
                Nirmaya Pravasi
              </h1>
              
              <p className="text-xl md:text-2xl text-white mb-8 max-w-lg drop-shadow">
                Comprehensive healthcare management system for migrant workers in Kerala
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-700 hover:bg-blue-50 transition-all duration-300 hover:scale-105 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/20 transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className={`relative transition-all duration-700 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -right-4 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-4 left-20 w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
                
                <img 
                  src="/healthcare-illustration.png" 
                  alt="Healthcare Illustration" 
                  className="relative rounded-lg shadow-xl w-full h-auto transition-all duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400/EEE/31316A?text=Nirmaya+Pravasi";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 container px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ensuring accessible healthcare for migrant workers through digital innovation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-200 group">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-all duration-300">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <CardTitle className="text-xl">Electronic Health Records</CardTitle>
              <CardDescription className="text-gray-600">
                Secure digital storage of your complete medical history
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Access medical records anytime</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Share with healthcare providers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Multilingual support for documents</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-2 shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-200 group">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-all duration-300">
                <Calendar className="h-6 w-6 text-blue-700" />
              </div>
              <CardTitle className="text-xl">Appointment Scheduling</CardTitle>
              <CardDescription className="text-gray-600">
                Easy booking of medical appointments with specialists
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Online appointment booking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Reminders via SMS and email</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Find nearby healthcare facilities</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-2 shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-200 group">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-all duration-300">
                <Languages className="h-6 w-6 text-blue-700" />
              </div>
              <CardTitle className="text-xl">Multilingual Support</CardTitle>
              <CardDescription className="text-gray-600">
                Breaking language barriers in healthcare access
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Interface in multiple languages</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Translated medical instructions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Language assistance services</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to access healthcare services through Nirmaya Pravasi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md text-center relative transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-3">Register</h3>
              <p className="text-gray-600">
                Create your account with basic information and identity verification
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md text-center relative transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-3">Complete Profile</h3>
              <p className="text-gray-600">
                Add your medical history, allergies, and other health information
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-md text-center relative transition-all duration-300 hover:shadow-xl">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-3">Access Services</h3>
              <p className="text-gray-600">
                Book appointments, access records, and receive healthcare services
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 md:py-24 container px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Need Assistance?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our support team is available to help with any questions about the Nirmaya Pravasi platform.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Helpline</h3>
                  <p className="text-gray-600">1800-XXX-XXXX (Toll Free)</p>
                  <p className="text-gray-600">Available 24/7 in multiple languages</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Support Centers</h3>
                  <p className="text-gray-600">Visit any of our support centers across Kerala</p>
                  <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                    Find nearest center
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <Globe className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Language Support</h3>
                  <p className="text-gray-600">Assistance available in Hindi, Bengali, Tamil, Malayalam, and more</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl border-2 border-gray-100 p-8 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center">Contact Support</h3>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" 
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" 
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                <HeadphonesIcon className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                We'll respond to your inquiry within 24 hours
              </p>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Nirmaya Pravasi</h3>
              <p className="text-gray-400 mb-4">
                A Government of Kerala initiative for migrant healthcare management
              </p>
              <div className="flex items-center gap-2">
                <img 
                  src="/nirmaya-pravasi-logo.png" 
                  alt="Nirmaya Pravasi" 
                  className="h-8 w-auto"
                  onError={(e) => e.target.style.display = 'none'} 
                />
                <span className="text-sm text-gray-400">Government of Kerala</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/locations" className="text-gray-400 hover:text-white transition-colors">Locations</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/guidelines" className="text-gray-400 hover:text-white transition-colors">Guidelines</Link></li>
                <li><Link href="/emergency" className="text-gray-400 hover:text-white transition-colors">Emergency Contacts</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Secretariat, Thiruvananthapuram, Kerala, India - 695001</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span>1800-XXX-XXXX</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Nirmaya Pravasi. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/accessibility" className="text-gray-400 text-sm hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
