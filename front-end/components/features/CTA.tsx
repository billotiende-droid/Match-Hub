// src/components/features/CTA.tsx
export const WhyChooseUs = () => (
  <section className="py-24 bg-[#00b300]">
    <div className="container mx-auto px-6 text-center text-white">
      <h2 className="text-4xl font-bold mb-4">Why Choose Match Hub</h2>
      <p className="opacity-90 mb-16">Everything you need for the perfect football experience</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Find Turfs Near You', 'Easy Booking', 'Join Tournaments', 'Secure Payments'].map((title) => (
          <div key={title} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4" />
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm opacity-80">Browse and book verified turfs with detailed info.</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ReadyToPlay = () => (
  <section className="py-20 bg-gradient-to-b from-black to-[#4a0412] text-center text-white">
    <h2 className="text-4xl font-bold mb-4">Ready to Play?</h2>
    <p className="opacity-80 mb-8">Join thousands of players across Kenya. Book your turf today!</p>
    <div className="flex justify-center gap-4">
      <button className="bg-green-700 px-8 py-3 rounded-xl font-bold">Browse Turfs</button>
      <button className="bg-[#D31D3F] px-8 py-3 rounded-xl font-bold">Join Tournament</button>
    </div>
  </section>
);
