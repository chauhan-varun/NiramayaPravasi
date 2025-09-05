'use client';

import Navbar from '@/components/navbar';
import ComingSoon from '@/components/coming-soon';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero section with blue gradient */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 md:py-16">
        <div className="container px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Nirmaya Pravasi</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Learn more about our initiative for migrant healthcare management in Kerala
          </p>
        </div>
      </section>
      
      <ComingSoon 
        title="About Page Coming Soon" 
        description="We're currently working on creating comprehensive information about the Nirmaya Pravasi initiative, its mission, vision, and impact on migrant healthcare in Kerala."
      />
    </div>
  );
}
