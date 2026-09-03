import { ShoppingBag, Search, MessageSquare, ArrowRight } from "lucide-react";

export function Home() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openAuthModal = () => {
    window.dispatchEvent(new Event("openAuthModal"));
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 md:py-32 border-b-4 border-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-black tracking-widest text-yellow-400 border border-yellow-400 px-3 py-1 inline-block mb-4">
              Premium School Apparel
            </span>
            <h1 className="text-5xl md:text-6xl mb-6 tracking-tight font-black uppercase">
              Premium School Uniforms
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light leading-relaxed">
              Quality uniforms for students. Premium fabrics, tailored fit, and hassle-free online ordering.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection("uniforms")}
                className="bg-white text-black px-8 py-4 font-black uppercase tracking-wider hover:bg-yellow-400 transition-all text-center border-2 border-white"
              >
                Browse Collection
              </button>
              <button
                onClick={() => scrollToSection("search")}
                className="border-2 border-white text-white px-8 py-4 font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all text-center"
              >
                Search Schools
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-16 font-black uppercase tracking-tight text-black">
            Why Choose Kaja Dresses?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button
              onClick={() => scrollToSection("uniforms")}
              className="text-left border-2 border-black p-8 hover:bg-black hover:text-white transition-all group"
            >
              <div className="w-16 h-16 bg-black group-hover:bg-white flex items-center justify-center mb-6">
                <ShoppingBag className="text-white group-hover:text-black" size={32} />
              </div>
              <h3 className="text-2xl mb-4 font-black uppercase">Wide Selection</h3>
              <p className="text-gray-600 group-hover:text-gray-300 font-medium">
                Extensive collection of uniforms for all school levels and types. From primary to high school.
              </p>
            </button>

            <button
              onClick={() => scrollToSection("search")}
              className="text-left border-2 border-black p-8 hover:bg-black hover:text-white transition-all group"
            >
              <div className="w-16 h-16 bg-black group-hover:bg-white flex items-center justify-center mb-6">
                <Search className="text-white group-hover:text-black" size={32} />
              </div>
              <h3 className="text-2xl mb-4 font-black uppercase">Easy Search</h3>
              <p className="text-gray-600 group-hover:text-gray-300 font-medium">
                Find uniforms by school name quickly. Check availability and specifications instantly.
              </p>
            </button>

            <button
              onClick={() => scrollToSection("feedback")}
              className="text-left border-2 border-black p-8 hover:bg-black hover:text-white transition-all group"
            >
              <div className="w-16 h-16 bg-black group-hover:bg-white flex items-center justify-center mb-6">
                <MessageSquare className="text-white group-hover:text-black" size={32} />
              </div>
              <h3 className="text-2xl mb-4 font-black uppercase">Customer Reviews</h3>
              <p className="text-gray-600 group-hover:text-gray-300 font-medium">
                Real-time feedback and ratings from parents and students. Read and share experiences.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50 border-t-2 border-b-2 border-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-16 font-black uppercase tracking-tight text-black">
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Boys Uniforms", count: "250+ items", category: "Boys" },
              { name: "Girls Uniforms", count: "300+ items", category: "Girls" },
              { name: "Sports Wear", count: "150+ items", category: "Sports" },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => scrollToSection("uniforms")}
                className="text-left bg-white border-2 border-black p-8 hover:bg-black hover:text-white transition-all group"
              >
                <h3 className="text-xl mb-2 font-black uppercase">{category.name}</h3>
                <p className="text-gray-600 group-hover:text-gray-300 font-semibold">{category.count}</p>
                <ArrowRight className="mt-4 group-hover:translate-x-2 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-6 font-black uppercase tracking-tight">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">
            Create an account to enjoy faster checkout, order tracking, and exclusive offers.
          </p>
          <button
            onClick={openAuthModal}
            className="inline-block bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-yellow-400 transition-colors border-2 border-white"
          >
            Login / Register
          </button>
        </div>
      </section>
    </div>
  );
}
