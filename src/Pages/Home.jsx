import Header from "../components/Header"
import HeroSlider from "../components/HeroSlider"
import Categories from "../components/Categories"
import WhyChooseUs from "../components/WhyChooseUs"
import FeaturedProducts from "../components/FeaturedProducts"
import VideoTestimonials from "../components/VideoTestimonials"
import Footer from "../components/Footer"
import WhatsAppButton from "../components/WhatsAppButton"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSlider />
        <Categories />
        <WhyChooseUs />
        <FeaturedProducts />
        <VideoTestimonials />
      </main>
      <Footer />
      <WhatsAppButton defaultDepartment="sales" position="bottom-right" />
    </div>
  )
}
