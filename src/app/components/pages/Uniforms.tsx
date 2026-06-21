import { useState } from "react";
import { Filter, ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";

interface Uniform {
  id: number;
  name: string;
  category: string;
  price: number; // default base price
  sizes: string[];
  sizePrices?: Record<string, number>;
  school: string;
  image: string;
}

const mockUniforms: Uniform[] = [
  {
    id: 1,
    name: "Boys White Shirt - Full Sleeve",
    category: "Boys",
    price: 350,
    sizes: ["32", "34", "36", "38", "40", "42", "44"],
    sizePrices: {
      "32": 350,
      "34": 370,
      "36": 390,
      "38": 410,
      "40": 430,
      "42": 460,
      "44": 470
    },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png"
  },
  {
    id: 2,
    name: "Girls White Shirt - Short Sleeve",
    category: "Girls",
    price: 230,
    sizes: ["20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: {
      "20": 230,
      "22": 240,
      "24": 250,
      "26": 260,
      "28": 270,
      "30": 280,
      "32": 280,
      "34": 280,
      "36": 290,
      "38": 290,
      "40": 290
    },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png"
  },
  {
    id: 3,
    name: "Classic School Blazer - Navy",
    category: "Boys",
    price: 1199,
    sizes: ["28", "30", "32", "34"],
    sizePrices: {
      "28": 1199,
      "30": 1249,
      "32": 1299,
      "34": 1349
    },
    school: "All Schools",
    image: "/uniforms/school_blazer.png"
  },
  {
    id: 4,
    name: "Girls Navy Pleated Skirt",
    category: "Girls",
    price: 320,
    sizes: ["24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: {
      "24": 320,
      "26": 330,
      "28": 340,
      "30": 360,
      "32": 380,
      "34": 400,
      "36": 420,
      "38": 440,
      "40": 460
    },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png"
  },
  {
    id: 5,
    name: "Sports Uniform Set - Pro",
    category: "Sports",
    price: 480,
    sizes: ["20", "22", "24", "26", "28"],
    sizePrices: {
      "20": 480,
      "22": 500,
      "24": 520,
      "26": 540,
      "28": 560
    },
    school: "St. Mary's School",
    image: "/uniforms/sports_uniform.png"
  },
  {
    id: 6,
    name: "Sports T-Shirt - Performance",
    category: "Sports",
    price: 230,
    sizes: ["20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: {
      "20": 230,
      "22": 240,
      "24": 250,
      "26": 260,
      "28": 270,
      "30": 280,
      "32": 280,
      "34": 280,
      "36": 290,
      "38": 290,
      "40": 290
    },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png"
  },
  {
    id: 7,
    name: "Salwar Kameez / Chudi Set",
    category: "Girls",
    price: 780,
    sizes: ["24", "26", "28", "30", "32", "34", "36", "38", "XL"],
    sizePrices: {
      "24": 780,
      "26": 810,
      "28": 840,
      "30": 870,
      "32": 910,
      "34": 940,
      "36": 990,
      "38": 1020,
      "XL": 1080
    },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png"
  },
  {
    id: 8,
    name: "School Pinafore Dress",
    category: "Girls",
    price: 320,
    sizes: ["24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: {
      "24": 320,
      "26": 330,
      "28": 340,
      "30": 360,
      "32": 380,
      "34": 400,
      "36": 420,
      "38": 440,
      "40": 460
    },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png"
  },
  {
    id: 9,
    name: "Khaki School Uniform Shirt",
    category: "Boys",
    price: 380,
    sizes: ["34", "36", "38", "40", "42", "44", "46"],
    sizePrices: {
      "34": 380,
      "36": 400,
      "38": 410,
      "40": 430,
      "42": 440,
      "44": 470,
      "46": 500
    },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png"
  },
  {
    id: 10,
    name: "School Frock (Frog)",
    category: "Girls",
    price: 320,
    sizes: ["24", "26", "28", "30", "32", "34", "36", "38", "40"],
    sizePrices: {
      "24": 320,
      "26": 330,
      "28": 340,
      "30": 360,
      "32": 380,
      "34": 400,
      "36": 420,
      "38": 440,
      "40": 460
    },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png"
  },
  {
    id: 11,
    name: "Classic School Trouser",
    category: "Boys",
    price: 250,
    sizes: ["20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40", "42", "44"],
    sizePrices: {
      "20": 250,
      "22": 260,
      "24": 270,
      "26": 280,
      "28": 290,
      "30": 310,
      "32": 330,
      "34": 350,
      "36": 370,
      "38": 390,
      "40": 410,
      "42": 430,
      "44": 450
    },
    school: "All Schools",
    image: "/uniforms/school_blazer.png"
  },
  {
    id: 12,
    name: "School Belt - Premium Leather",
    category: "Accessories",
    price: 299,
    sizes: ["28-32", "32-36"],
    sizePrices: {
      "28-32": 299,
      "32-36": 320
    },
    school: "All Schools",
    image: "/uniforms/school_blazer.png"
  },
  {
    id: 13,
    name: "Striped School Tie",
    category: "Accessories",
    price: 199,
    sizes: ["One Size"],
    sizePrices: {
      "One Size": 199
    },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png"
  }
];

export function Uniforms() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [selectedProductSizes, setSelectedProductSizes] = useState<Record<number, string>>({});

  const categories = ["All", "Boys", "Girls", "Sports", "Accessories"];

  // Dynamically compute unique sizes from the products catalog
  const sizes = [
    "All",
    ...Array.from(new Set(mockUniforms.flatMap((u) => u.sizes))).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    })
  ];

  const toggleLike = (id: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Removed from favorites");
      } else {
        next.add(id);
        toast.success("Added to favorites");
      }
      return next;
    });
  };

  const getSelectedSize = (uniform: Uniform) => {
    return selectedProductSizes[uniform.id] || uniform.sizes[0];
  };

  const handleAddToCart = (uniform: Uniform) => {
    const size = getSelectedSize(uniform);
    const price = uniform.sizePrices?.[size] ?? uniform.price;
    toast.success(`${uniform.name} (Size: ${size}, Price: ₹${price}) added to cart!`);
  };

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
            Browse our extensive collection of school uniforms and accessories with size-based pricing.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 bg-gray-50 border-2 border-black p-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={20} />
            <h2 className="text-xl uppercase tracking-widest font-bold">Filter By</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Filter */}
            <div>
              <label className="block mb-3 text-xs uppercase font-bold text-gray-500">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 border-2 transition-all duration-300 font-medium ${
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
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 border-2 text-sm transition-all duration-300 font-medium ${
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
          {filteredUniforms.map((uniform) => {
            const currentSize = getSelectedSize(uniform);
            const currentPrice = uniform.sizePrices?.[currentSize] ?? uniform.price;

            return (
              <div
                key={uniform.id}
                className="border-2 border-black bg-white group overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-50 flex items-center justify-center border-b-2 border-black overflow-hidden relative">
                    <img 
                      src={uniform.image} 
                      alt={uniform.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => toggleLike(uniform.id)}
                        className={`bg-white border-2 border-black p-3 transition-colors shadow-lg ${
                          likedItems.has(uniform.id) ? "bg-black text-white" : "hover:bg-black hover:text-white"
                        }`}
                      >
                        <Heart size={20} fill={likedItems.has(uniform.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-4 flex justify-between items-start">
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
                      <div className="flex flex-col">
                        <span className="text-3xl font-black">₹{currentPrice}</span>
                        <span className="text-xs text-gray-400 font-semibold">Size: {currentSize} price</span>
                      </div>
                    </div>

                    {/* Sizes Selector */}
                    <div className="mb-6">
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Select Size</p>
                      <div className="flex flex-wrap gap-2">
                        {uniform.sizes.map((size) => {
                          const isSelected = currentSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => setSelectedProductSizes(prev => ({ ...prev, [uniform.id]: size }))}
                              className={`border-2 px-3 py-1 text-[10px] font-black transition-all ${
                                isSelected
                                  ? "border-black bg-black text-white"
                                  : "border-gray-200 text-gray-400 hover:border-black hover:text-black"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {/* Add to Cart */}
                  <button 
                    onClick={() => handleAddToCart(uniform)}
                    className="w-full bg-black text-white py-4 hover:bg-white hover:text-black border-2 border-black transition-all duration-300 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
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
