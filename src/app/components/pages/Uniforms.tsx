import { useState } from "react";
import { Filter, ShoppingCart, Heart } from "lucide-react";

interface Uniform {
  id: number;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  school: string;
  image: string;
}

const mockUniforms: Uniform[] = [
  {
    id: 1,
    name: "Boys White Shirt - Full Sleeve",
    category: "Boys",
    price: 25,
    sizes: ["S", "M", "L", "XL"],
    school: "All Schools",
    image: "/uniforms/boys_shirt.png",
  },
  {
    id: 2,
    name: "Girls White Shirt - Short Sleeve",
    category: "Girls",
    price: 22,
    sizes: ["S", "M", "L", "XL"],
    school: "All Schools",
    image: "/uniforms/boys_shirt.png", // Reusing for demo
  },
  {
    id: 3,
    name: "Classic School Blazer - Navy",
    category: "Boys",
    price: 65,
    sizes: ["28", "30", "32", "34"],
    school: "All Schools",
    image: "/uniforms/school_blazer.png",
  },
  {
    id: 4,
    name: "Girls Navy Pleated Skirt",
    category: "Girls",
    price: 28,
    sizes: ["S", "M", "L", "XL"],
    school: "All Schools",
    image: "/uniforms/girls_skirt.png",
  },
  {
    id: 5,
    name: "Sports Uniform Set - Pro",
    category: "Sports",
    price: 45,
    sizes: ["S", "M", "L", "XL"],
    school: "St. Mary's School",
    image: "/uniforms/sports_uniform.png",
  },
  {
    id: 6,
    name: "Sports T-Shirt - Performance",
    category: "Sports",
    price: 18,
    sizes: ["S", "M", "L", "XL"],
    school: "All Schools",
    image: "/uniforms/sports_uniform.png", // Reusing for demo
  },
  {
    id: 7,
    name: "School Belt - Premium Leather",
    category: "Accessories",
    price: 15,
    sizes: ["28-32", "32-36"],
    school: "All Schools",
    image: "/uniforms/school_blazer.png", // Using blazer as proxy for high-quality accessory feel
  },
  {
    id: 8,
    name: "Striped School Tie",
    category: "Accessories",
    price: 12,
    sizes: ["One Size"],
    school: "All Schools",
    image: "/uniforms/boys_shirt.png", // Using shirt as background for tie
  },
];

export function Uniforms() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");

  const categories = ["All", "Boys", "Girls", "Sports", "Accessories"];
  const sizes = ["All", "S", "M", "L", "XL", "XXL"];

  const filteredUniforms = mockUniforms.filter((uniform) => {
    const categoryMatch =
      selectedCategory === "All" || uniform.category === selectedCategory;
    const sizeMatch =
      selectedSize === "All" || uniform.sizes.includes(selectedSize);
    return categoryMatch && sizeMatch;
  });

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 font-light tracking-tight">Uniforms Collection</h1>
          <p className="text-gray-600 text-lg">
            Browse our extensive collection of school uniforms and accessories
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 bg-gray-50 border-2 border-black p-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={20} />
            <h2 className="text-xl uppercase tracking-widest font-bold">Filter By</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Filter */}
            <div>
              <label className="block mb-3 text-xs uppercase font-bold text-gray-500">Category</label>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 border-2 transition-all duration-300 font-medium ${
                      selectedCategory === category
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block mb-3 text-xs uppercase font-bold text-gray-500">Size</label>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 border-2 transition-all duration-300 font-medium ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredUniforms.map((uniform) => (
            <div
              key={uniform.id}
              className="border-2 border-black bg-white group overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-50 flex items-center justify-center border-b-2 border-black overflow-hidden relative">
                <img 
                  src={uniform.image} 
                  alt={uniform.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-white border-2 border-black p-3 hover:bg-black hover:text-white transition-colors shadow-lg">
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-[10px] border-2 border-black px-3 py-1 uppercase font-black tracking-tighter">
                    {uniform.category}
                  </span>
                </div>
                <h3 className="text-xl mb-2 font-bold group-hover:underline transition-all">
                  {uniform.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 bg-black rounded-full" /> {uniform.school}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black">${uniform.price}</span>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {uniform.sizes.map((size) => (
                      <span
                        key={size}
                        className="border-2 border-gray-100 px-3 py-1 text-[10px] font-bold text-gray-400 group-hover:border-black group-hover:text-black transition-colors"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Add to Cart */}
                <button className="w-full bg-black text-white py-4 hover:bg-white hover:text-black border-2 border-black transition-all duration-300 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* No Results */}
        {filteredUniforms.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 mb-4">No uniforms found</p>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
