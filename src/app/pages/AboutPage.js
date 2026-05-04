import { Award, Target, Users, Truck } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">About FitGear</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Your trusted partner in fitness excellence. We provide premium gym equipment 
            for home and professional training facilities.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center mb-12">
            At FitGear, we believe that everyone deserves access to high-quality fitness equipment. 
            Our mission is to transform your fitness journey by providing premium gear that combines 
            durability, innovation, and affordability.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600">
                  Every product is carefully selected and tested to meet the highest standards 
                  of quality and performance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
                <p className="text-gray-600">
                  Our team of fitness experts is here to help you choose the right equipment 
                  for your specific needs and goals.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Community Focused</h3>
                <p className="text-gray-600">
                  Join thousands of satisfied customers who have transformed their fitness 
                  journey with FitGear equipment.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick and reliable shipping to get your equipment to you as fast as possible, 
                  so you can start training sooner.
                </p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Founded in 2020, FitGear started with a simple vision: to make professional-grade 
                fitness equipment accessible to everyone. What began as a small warehouse operation 
                has grown into a trusted name in the fitness industry.
              </p>
              <p>
                We understand that investing in fitness equipment is a big decision. That's why we've 
                built our reputation on three core principles: quality, affordability, and customer 
                service. Every product in our catalog is handpicked by our team of fitness enthusiasts 
                and industry experts.
              </p>
              <p>
                Today, we serve thousands of customers across the country, from home gym enthusiasts 
                to professional training facilities. Our commitment remains the same: to provide the 
                best equipment and support to help you achieve your fitness goals.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">Q</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality First</h3>
                <p className="text-gray-600">
                  We never compromise on quality. Every product meets our rigorous standards.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">I</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We constantly seek out the latest innovations in fitness technology.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">C</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Care</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority. We're here to support your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Browse our collection of premium gym equipment today.
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}
