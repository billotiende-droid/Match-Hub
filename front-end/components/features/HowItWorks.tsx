// src/components/features/HowItWorks.tsx
const steps = [
  { id: 1, title: 'Search for a Turf', description: 'Use our search to find turfs near your location or filter by price, rating, and amenities.' },
  { id: 2, title: 'Check Availability', description: 'View available time slots in real-time and choose the one that fits your schedule.' },
  { id: 3, title: 'Book & Pay', description: 'Complete your booking with a secure payment and receive instant confirmation.' },
  { id: 4, title: 'Play & Enjoy', description: 'Show up at your booked time and enjoy the game with your team!' },
];

export const HowItWorks = () => (
  <section className="py-20 bg-[var(--surface-muted)] relative overflow-hidden">
    <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_bottom,rgba(148,163,184,.18)_1px,transparent_1px)] [background-size:100%_58px]" />
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-5xl font-black mb-4 text-gray-900 relative z-10">How It Works</h2>
      <p className="text-gray-600 mb-14 relative z-10">Book your perfect turf in just four simple steps</p>
      
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 z-10">
        <div className="hidden md:block absolute top-6 left-[8%] right-[8%] h-[2px] bg-[var(--color-primary)]/45" />
        
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className="w-14 h-14 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-5 shadow-lg border-4 border-[var(--surface-muted)]">
              {step.id}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">{step.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[270px]">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
