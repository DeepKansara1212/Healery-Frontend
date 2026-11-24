import ContactPage from "../contact/page"
import Header from "../components/Header"
import Footer from "../components/Footer"
import WhatsAppInlineButton from "../components/WhatsAppInlineButton"
import WhatsAppStatusBadge from "../components/WhatsAppStatusBadge"

const Contact = () => {
  return (
    <>
      <Header />
      <ContactPage />
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Support</h2>
          <p className="text-gray-600 mb-8">Need immediate assistance? Chat with us on WhatsApp</p>
          <div className="flex flex-col items-center gap-4">
            <WhatsAppStatusBadge departmentId="support" showLabel={true} />
            <WhatsAppInlineButton
              departmentId="support"
              message="Hi! I need help with my inquiry."
              variant="primary"
              size="lg"
              showIcon={true}
              showLabel={true}
              showStatus={true}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Contact
