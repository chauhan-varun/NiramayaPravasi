'use client';

import Navbar from '@/components/navbar';
import ComingSoon from '@/components/coming-soon';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero section with blue gradient */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 md:py-16">
        <div className="container px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Comprehensive healthcare services for migrant workers in Kerala
          </p>
        </div>
      </section>
      
      <ComingSoon 
        title="Services Page Coming Soon" 
        description="We're currently working on detailing all the healthcare services offered through the Nirmaya Pravasi platform. Check back soon for a complete list of medical and support services available to migrant workers."
      />
    </div>
  );
}
