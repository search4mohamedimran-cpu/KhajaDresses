import { Link } from "react-router";
import { ShoppingBag, Search, MessageSquare, ArrowRight } from "lucide-react";

export function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl mb-6 tracking-tight">
              Premium School Uniforms
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Quality uniforms for students. Trusted by schools across the nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/uniforms"
                className="bg-white text-black px-8 py-4 hover:bg-gray-200 transition-colors text-center"
              >
                Browse Collection
              </Link>
              <Link
                to="/search"
                className="border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-center"
              >
                Search Schools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-16 text-black">Why Choose Kaja Dresses?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-black p-8 hover:bg-black hover:text-white transition-all group">
              <div className="w-16 h-16 bg-black group-hover:bg-white flex items-center justify-center mb-6">
                <ShoppingBag className="text-white group-hover:text-black" size={32} />
              </div>
              <h3 className="text-2xl mb-4">Wide Selection</h3>
              <p className="text-gray-600 group-hover:text-gray-300">
                Extensive collection of uniforms for all school levels and types. From primary to high school.
              </p>
            </div>
            <div className="border border-black p-8 hover:bg-black hover:text-white transition-all group">
              <div className="w-16 h-16 bg-black group-hover:bg-white flex items-center justify-center mb-6">
                <Search className="text-white group-hover:text-black" size={32} />
              </div>
              <h3 className="text-2xl mb-4">Easy Search</h3>
              <p className="text-gray-600 group-hover:text-gray-300">
                Find uniforms by school name quickly. Check availability and specifications instantly.
              </p>
            </div>
            <div className="border border-black p-8 hover:bg-black hover:text-white transition-all group">
              <div className="w-16 h-16 bg-black group-hover:bg-white flex items-center justify-center mb-6">
                <MessageSquare className="text-white group-hover:text-black" size={32} />
              </div>
              <h3 className="text-2xl mb-4">Customer Support</h3>
              <p className="text-gray-600 group-hover:text-gray-300">
                Dedicated support team ready to help. Share your feedback and get quick responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-16 text-black">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Boys Uniforms", count: "250+ items" },
              { name: "Girls Uniforms", count: "300+ items" },
              { name: "Sports Wear", count: "150+ items" },
              { name: "Accessories", count: "100+ items" },
            ].map((category) => (
              <Link
                key={category.name}
                to="/uniforms"
                className="bg-white border-2 border-black p-8 hover:bg-black hover:text-white transition-all group"
              >
                <h3 className="text-xl mb-2">{category.name}</h3>
                <p className="text-gray-600 group-hover:text-gray-300">{category.count}</p>
                <ArrowRight className="mt-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create an account to enjoy faster checkout, order tracking, and exclusive offers.
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-black px-8 py-4 hover:bg-gray-200 transition-colors"
          >
            Login / Register
          </Link>
        </div>
      </section>
    </div>
  );
}
