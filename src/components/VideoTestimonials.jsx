"use client"

import { useState } from "react"
import { Play } from "lucide-react"

const videoTestimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Wellness Enthusiast",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
    quote: "Healeri's products have completely transformed my wellness routine!",
    rating: 5,
  },
  {
    id: 2,
    name: "Amit Patel",
    role: "Fitness Coach",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    quote: "The quality and authenticity of these herbal products is unmatched.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sohna Verma",
    role: "Yoga Instructor",
    videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
    quote: "My students absolutely love the natural energy boost from these products.",
    rating: 5,
  },
  {
    id: 4,
    name: "Rohit Singh",
    role: "Health Consultant",
    videoUrl: "https://www.youtube.com/embed/OPf0YbXqDm0",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop",
    quote: "I recommend Healeri to all my clients seeking authentic wellness solutions.",
    rating: 5,
  },
]

export default function VideoTestimonials() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-orange-500"></div>
            <span className="text-orange-600 font-bold text-sm tracking-widest uppercase">Video Testimonials</span>
            <div className="w-8 h-px bg-orange-500"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Hear From Our Happy Customers</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Watch real testimonials from people who have experienced the transformative power of Healeri's herbal
            products
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {videoTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="group cursor-pointer" onClick={() => setSelectedVideo(testimonial)}>
              <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src={testimonial.thumbnail || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex items-center justify-center transition-all duration-300">
                  <div className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </div>

              {/* Testimonial Info */}
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 font-medium text-sm italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Video Player */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl">
              {/* Video Container */}
              <div className="relative bg-black aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`${selectedVideo.videoUrl}?autoplay=1`}
                  title={selectedVideo.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Testimonial Details */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedVideo.name}</h3>
                    <p className="text-gray-600 font-medium">{selectedVideo.role}</p>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-light"
                  >
                    ✕
                  </button>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(selectedVideo.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 text-lg leading-relaxed italic">"{selectedVideo.quote}"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
