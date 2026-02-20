// src/components/features/HowItWorks.tsx
const steps = [
  { id: 1, title: 'Search for a Turf', description: 'Use our search to find turfs near your location or filter by price, rating, and amenities.' },
  { id: 2, title: 'Check Availability', description: 'View available time slots in real-time and choose the one that fits your schedule.' },
  { id: 3, title: 'Book & Pay', description: 'Complete your booking with a secure payment and receive instant confirmation.' },
  { id: 4, title: 'Play & Enjoy', description: 'Show up at your booked time and enjoy the game with your team!' },
];

export const HowItWorks = () => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold mb-4 dark:text-white">How It Works</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-16">Book your perfect turf in just four simple steps</p>
      
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* The connecting line (desktop only) */}
        <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-red-100 -z-10" />
        
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#D31D3F] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-white dark:border-gray-700">
              {step.id}
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">{step.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
