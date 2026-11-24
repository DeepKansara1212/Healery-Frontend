"use client"

import { useState } from "react"
import { Leaf, Award, Truck, Users, Sparkles, Shield, Heart, Star } from "lucide-react"

const WhyChooseUs = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  const features = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "All our products are made from pure, organic ingredients sourced directly from nature's bounty",
      color: "primary",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Rigorous testing and quality control ensure you receive only the finest herbal products",
      color: "secondary",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and secure shipping to bring natural wellness directly to your doorstep",
      color: "accent",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Our team of herbal specialists is here to guide you on your wellness journey",
      color: "primary",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 bg-primary/10 px-6 py-3 rounded-full mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">Why Choose Us</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Your Wellness, Our Promise</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're committed to providing you with the highest quality herbal products and exceptional service for your
            natural wellness journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group text-center"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`bg-card hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 rounded-2xl p-8 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                    hoveredFeature === index ? "scale-105 shadow-2xl" : ""
                  }`}
                >
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="relative">
                      <div className="absolute -top-10 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                        <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center animate-bounce">
                          <Sparkles className="w-3 h-3 text-secondary-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </p>

                  <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
            <Heart className="w-5 h-5" />
            <span>Experience the Natural Wellness Difference</span>
            <Star className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
