'use client';

import Navbar from '@/components/navbar';
import ComingSoon from '@/components/coming-soon';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero section with blue gradient */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 md:py-16">
        <div className="container px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Get in touch with the Nirmaya Pravasi team for support and inquiries
          </p>
        </div>
      </section>
      
      <ComingSoon 
        title="Contact Page Coming Soon" 
        description="Our dedicated contact page with support channels, contact form, and help resources is under development. In the meantime, you can reach out to us through the support section in the patient portal."
      />
    </div>
  );
}
