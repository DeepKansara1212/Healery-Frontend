import { useNavigate } from 'react-router-dom'

const Categories = () => {
  const navigate = useNavigate()
  const categories = [
    {
      id: 1,
      name: "Herbal Tablets",
      description: "Convenient and potent herbal supplements in tablet form",
      image: "/Herbal_Tablets.jpg",
      itemCount: "5+ varieties",
    },
    {
      id: 2,
      name: "Herbal Powder",
      description: "Pure herbal powders for maximum potency and versatility",
      image: "/Herbal_Powder.jpg",
      itemCount: "5+ varieties",
    },
  ]

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-plant-orange font-semibold text-sm tracking-wider uppercase mb-4">Herbal Categories</p>
          <h2 className="text-4xl font-bold text-plant-green mb-6 tracking-wide">Choose Your Perfect Herbal Product</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
            Discover our carefully curated collection of premium herbal products, each selected for purity, health benefits, and
            natural healing properties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer plant-card hover:shadow-plant-card-hover transition-all duration-300 overflow-hidden"
              onClick={() => navigate('/products')}
            >
              <div className="relative mb-6 overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg?height=300&width=400&query=beautiful plants"}
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-plant-green px-3 py-1 rounded-full text-xs font-semibold">
                  {category.itemCount}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-plant-green group-hover:text-plant-orange transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>

                <button className="text-plant-orange font-semibold text-sm hover:text-plant-orange-dark transition-colors duration-300 border-b-2 border-transparent hover:border-plant-orange pb-1 group-hover:translate-x-1 transform transition-transform duration-300">
                  Shop Now →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="max-w-md mx-auto space-y-6">
            <h3 className="text-2xl font-bold text-plant-green">Need Herbal Product Advice?</h3>
            <p className="text-gray-600 text-sm">
              Our herbal experts are here to help you choose the perfect herbal products for your wellness needs
            </p>
            <button 
              className="btn-plant-secondary"
              onClick={() => navigate('/contact')}
            >
              Contact Herbal Experts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories
