import Header from "../components/Header"
import Footer from "../components/Footer"
import { Leaf, Award, Users, Heart, Shield, Truck, Star, ArrowRight, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const AboutPage = () => {
  const navigate = useNavigate()
  const values = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "We source only the finest plants and botanicals from trusted growers worldwide.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Award,
      title: "Quality First",
      description: "Every plant undergoes careful inspection to ensure health, vitality, and beauty.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "We believe in building a community of plant enthusiasts who support each other.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Heart,
      title: "Sustainable Living",
      description: "Our approach considers the environment and promotes eco-friendly practices.",
      color: "from-red-500 to-orange-600",
    },
  ]

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & Plant Expert",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      bio: "With over 15 years in horticulture, Dr. Chen founded Plants Avenue to make plant care accessible to everyone.",
      expertise: ["Plant Biology", "Sustainable Farming", "Herbal Medicine"],
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Plant Care",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Michael brings 10+ years of experience in plant cultivation and sustainable growing practices.",
      expertise: ["Organic Cultivation", "Plant Nutrition", "Greenhouse Management"],
    },
    {
      name: "Emma Thompson",
      role: "Plant Care Consultant",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Emma helps customers find the right plants for their space with personalized guidance.",
      expertise: ["Customer Care", "Plant Selection", "Indoor Gardening"],
    },
  ]

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "10+", label: "Product Varieties" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Satisfaction Rate" },
  ]

  const milestones = [
    { year: "2018", title: "Founded", description: "Started as a small family greenhouse business" },
    { year: "2019", title: "First Expansion", description: "Opened our first retail location" },
    { year: "2021", title: "Online Launch", description: "Launched our e-commerce platform" },
    { year: "2023", title: "Wellness Focus", description: "Expanded into herbal wellness products" },
    { year: "2024", title: "Community Growth", description: "Reached 10,000+ satisfied customers" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="relative overflow-hidden">
          <div className="relative container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-plant-dark/10 to-plant-green/20 text-plant-green px-4 py-2 rounded-full text-sm font-medium mb-8">
                  <Leaf className="w-4 h-4" />
                  <span>Our Story Since 2018</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-plant-primary mb-8 leading-tight">
                  Our Story of
                  <span className="block bg-gradient-to-r from-plant-dark via-plant-green to-emerald-400 bg-clip-text text-transparent">
                    Bringing Nature Home
                  </span>
                </h1>
                <div className="space-y-6 text-lg text-plant-secondary leading-relaxed mb-10">
                  <p>
                    Founded in 2018, Plants Avenue began as a small family business with a simple mission: to bring the
                    beauty and benefits of plants to modern homes. What started in a small greenhouse has grown into a
                    trusted source for premium indoor and outdoor plants.
                  </p>
                  <p>
                    We believe that plants provide everything we need for a healthier, happier living space. Our
                    carefully curated collection represents years of research, traditional knowledge, and modern
                    horticultural science working in harmony.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate("/products")}
                    className="bg-gradient-to-r from-plant-dark via-plant-green to-emerald-400 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    Explore Our Products
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="border-2 border-plant-primary text-plant-primary px-8 py-4 rounded-2xl font-semibold hover:bg-plant-primary hover:text-white transition-all duration-200">
                    Meet Our Team
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop"
                    alt="Greenhouse plants"
                    className="rounded-3xl w-full h-96 lg:h-[480px] object-cover shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white rounded-xl border border-plant-primary/10 p-6 shadow-sm">
                  <div className="text-3xl lg:text-4xl font-bold text-plant-primary mb-1">{stat.number}</div>
                  <div className="text-plant-secondary font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-plant-primary mb-6">Our Mission & Vision</h2>
              <p className="text-xl text-plant-secondary max-w-3xl mx-auto">
                Driving positive change in how people connect with nature and wellness
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-3xl p-10 shadow-xl border border-plant-primary/10 hover:shadow-2xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-plant-dark via-plant-green to-emerald-400 rounded-2xl flex items-center justify-center mb-8">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-plant-primary mb-6">Our Mission</h3>
                <p className="text-plant-secondary leading-relaxed text-lg mb-6">
                  To empower individuals on their plant journey by providing access to the highest quality plants,
                  backed by expert knowledge and care guidance. We're committed to sustainability, transparency, and
                  making plant parenthood accessible to all.
                </p>
                <ul className="space-y-3">
                  {["Expert Guidance", "Quality Assurance", "Sustainable Practices"].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-plant-green" />
                      <span className="text-plant-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-plant-dark via-plant-green to-emerald-400 rounded-3xl p-10 shadow-xl text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                <p className="text-white/90 leading-relaxed text-lg mb-6">
                  A world where every home is filled with thriving plants, where people have the knowledge and access to
                  green companions that purify air and bring joy, and where sustainable practices protect our planet for
                  future generations.
                </p>
                <ul className="space-y-3">
                  {["Global Wellness", "Environmental Impact", "Community Building"].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-white" />
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-plant-primary mb-6">Our Values</h2>
              <p className="text-xl text-plant-secondary max-w-3xl mx-auto">
                These core principles guide everything we do, from sourcing plants to serving our customers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div key={index} className="group hover:transform hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-plant-primary/10 hover:shadow-2xl transition-all duration-300 h-full">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-plant-primary mb-4">{value.title}</h3>
                      <p className="text-plant-secondary leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-plant-primary mb-6">Meet Our Expert Team</h2>
              <p className="text-xl text-plant-secondary max-w-3xl mx-auto">
                Passionate experts dedicated to bringing you the best in plant care and wellness guidance
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl border border-plant-primary/10 hover:shadow-2xl hover:transform hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-plant-primary mb-2">{member.name}</h3>
                    <p className="text-plant-accent font-semibold mb-4">{member.role}</p>
                    <p className="text-plant-secondary leading-relaxed mb-6">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gradient-to-r from-plant-dark/10 to-plant-green/20 text-plant-dark text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-plant-primary mb-6">Why Choose Plants Avenue?</h2>
              <p className="text-xl text-plant-secondary max-w-3xl mx-auto">
                We go above and beyond to ensure you receive the healthiest plants and best care guidance
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {[
                {
                  icon: Shield,
                  title: "Health Guaranteed",
                  description:
                    "Every plant is carefully inspected for health and vitality before shipping. We stand behind our quality with a 30-day guarantee.",
                  features: ["Quality Inspection", "Health Guarantee", "Expert Packaging"],
                },
                {
                  icon: Truck,
                  title: "Sustainable Sourcing",
                  description:
                    "We work directly with eco-friendly nurseries and ethical growers worldwide to bring you the finest plants.",
                  features: ["Eco-Friendly Partners", "Ethical Sourcing", "Carbon Neutral Shipping"],
                },
                {
                  icon: Heart,
                  title: "Expert Care Support",
                  description:
                    "Our plant experts are here to guide you on your plant care journey with personalized advice and ongoing support.",
                  features: ["24/7 Support", "Care Guides", "Expert Consultations"],
                },
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-plant-primary/10 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-plant-dark via-plant-green to-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-plant-primary mb-4">{item.title}</h3>
                    <p className="text-plant-secondary leading-relaxed mb-6">{item.description}</p>
                    <ul className="space-y-2">
                      {item.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-gradient-to-r from-plant-dark to-plant-green" />
                          <span className="text-plant-secondary text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AboutPage
