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
    image: "shirt",
  },
  {
    id: 2,
    name: "Girls White Shirt - Short Sleeve",
    category: "Girls",
    price: 22,
    sizes: ["S", "M", "L", "XL"],
    school: "All Schools",
    image: "shirt",
  },
  {
    id: 3,
    name: "Boys Navy Trousers",
    category: "Boys",
    price: 30,
    sizes: ["28", "30", "32", "34"],
    school: "All Schools",
    image: "trousers",
  },
  {
    id: 4,
    name: "Girls Navy Skirt",
    category: "Girls",
    price: 28,
    sizes: ["S", "M", "L", "XL"],
    school: "All Schools",
    image: "skirt",
  },
  {
    id: 5,
    name: "School Tie - Striped",
    category: "Accessories",
    price: 12,
    sizes: ["One Size"],
    school: "St. Mary's School",
    image: "tie",
  },
  {
    id: 6,
    name: "Sports T-Shirt - White",
    category: "Sports",
    price: 18,
    sizes: ["S", "M", "L", "XL", "XXL"],
    school: "All Schools",
    image: "sports",
  },
  {
    id: 7,
    name: "Sports Shorts - Black",
    category: "Sports",
    price: 20,
    sizes: ["S", "M", "L", "XL"],
    school: "All Schools",
    image: "sports",
  },
  {
    id: 8,
    name: "School Belt - Black",
    category: "Accessories",
    price: 15,
    sizes: ["28-32", "32-36", "36-40"],
    school: "All Schools",
    image: "belt",
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
          <h1 className="text-4xl md:text-5xl mb-4">Uniforms Collection</h1>
          <p className="text-gray-600 text-lg">
            Browse our extensive collection of school uniforms and accessories
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-gray-50 border-2 border-black p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h2 className="text-xl">Filter By</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 border-2 transition-all ${
                      selectedCategory === category
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 transition-all ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-gray-100"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUniforms.map((uniform) => (
            <div
              key={uniform.id}
              className="border-2 border-black bg-white hover:shadow-xl transition-shadow group"
            >
              {/* Image Placeholder */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center border-b-2 border-black">
                <div className="text-6xl text-gray-300">👔</div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs border border-black px-2 py-1">
                    {uniform.category}
                  </span>
                </div>
                <h3 className="text-lg mb-2 group-hover:underline">
                  {uniform.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{uniform.school}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">${uniform.price}</span>
                  <button className="p-2 hover:bg-gray-100 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>

                {/* Sizes */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Available Sizes:</p>
                  <div className="flex flex-wrap gap-2">
                    {uniform.sizes.map((size) => (
                      <span
                        key={size}
                        className="border border-gray-300 px-2 py-1 text-xs"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Add to Cart */}
                <button className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
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
