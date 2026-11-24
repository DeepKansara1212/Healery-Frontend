import React, { useState, useEffect, useRef } from 'react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Customer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: `Healer's herbal oils and scrubs have transformed our spa experience. Our clients love the natural scents and soothing effects. We trust Healeri for pure, effective products!`,
  },
  {
    name: 'Amit Patel',
    role: 'Store Owner',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: `Our customers keep coming back for Healeri's herbal teas and supplements. The quality is unmatched and the results speak for themselves. Highly recommended for anyone seeking natural wellness!`,
  },
  {
    name: 'Sohna Verma',
    role: 'Wellness Coach',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 5,
    text: `I recommend Healeri's herbal remedies to my patients for stress relief and immunity. The ingredients are authentic and the blends are thoughtfully crafted.`,
  },
  {
    name: 'Rohit Singh',
    role: 'Customer',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 5,
    text: `Healeri's essential oils and balm are a staple in our yoga sessions. They help our members relax and enhance their practice naturally.`,
  },
  {
    name: 'Meera Joshi',
    role: 'Clinic Owner',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: `From herbal face packs to immunity boosters, Healeri's herbal products work very well for my family. We feel healthier and happier every day!`,
  },
];

const Testimonials = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  // Create infinite testimonials array (duplicate for seamless loop)
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Continuous scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame (adjust for speed)
    const cardWidth = 400; // approximate card width + gap

    const scroll = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        
        // Reset position when we've scrolled through one complete set
        if (scrollPosition >= testimonials.length * cardWidth) {
          scrollPosition = 0;
        }
        
        scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      }
      
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused]);

  return (
    <section className="bg-white px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-emerald-500"></div>
            <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">Testimonials</span>
            <div className="w-8 h-px bg-emerald-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">Discover how Healeri's herbal products have brought natural wellness and happiness to homes, clinics, and studios.</p>
        </div>

        <div 
          className="relative group overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={scrollRef}
            className="flex gap-6"
            style={{
              width: `${infiniteTestimonials.length * 400}px`, // Total width for all cards
            }}
          >
            {infiniteTestimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-96 bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-80 flex flex-col"
              >
                {/* Quote Icon */}
                <div className="flex justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
                
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <blockquote className="text-gray-800 text-sm text-center italic mb-6 leading-relaxed flex-grow overflow-hidden">
                  "{testimonial.text}"
                </blockquote>
                
                {/* Author Info */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100 shadow-md" 
                  />
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-gray-600 text-xs font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials