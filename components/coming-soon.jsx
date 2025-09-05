'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ComingSoon({ title, description, returnLink = '/' }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className={`text-center max-w-2xl mx-auto transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}>
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
          <Clock className="h-10 w-10 text-blue-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          {title}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          {description || "We're working hard to bring you this feature. Please check back soon!"}
        </p>
        
        <div className="relative mb-12">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-3/4 animate-pulse"></div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>Development</span>
            <span>Coming Soon</span>
          </div>
        </div>
        
        <Button asChild className="transition-all duration-300 hover:scale-105 group">
          <Link href={returnLink}>
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
