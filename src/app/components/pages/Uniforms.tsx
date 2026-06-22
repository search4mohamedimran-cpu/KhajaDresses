import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
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
    school: "St. Mary's High School",
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
  // Reclassified Accessories into Boys & Girls
  {
    id: 12,
    name: "Boys School Belt - Premium Leather",
    category: "Boys",
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
    name: "Girls School Belt - Premium Leather",
    category: "Girls",
    price: 299,
    sizes: ["24-28", "28-32"],
    sizePrices: {
      "24-28": 299,
      "28-32": 320
    },
    school: "All Schools",
    image: "/uniforms/school_blazer.png"
  },
  {
    id: 14,
    name: "Boys Striped School Tie",
    category: "Boys",
    price: 199,
    sizes: ["One Size"],
    sizePrices: {
      "One Size": 199
    },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png"
  },
  {
    id: 15,
    name: "Girls Striped School Tie",
    category: "Girls",
    price: 199,
    sizes: ["One Size"],
    sizePrices: {
      "One Size": 199
    },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png"
  },
  // New Variety Items (Boys)
  {
    id: 16,
    name: "Boys Cotton Socks (Pack of 3)",
    category: "Boys",
    price: 180,
    sizes: ["S", "M", "L"],
    sizePrices: {
      "S": 180,
      "M": 190,
      "L": 200
    },
    school: "All Schools",
    image: "/uniforms/boys_shirt.png"
  },
  {
    id: 17,
    name: "Boys Formal Black Shoes",
    category: "Boys",
    price: 650,
    sizes: ["3", "4", "5", "6", "7", "8"],
    sizePrices: {
      "3": 650,
      "4": 670,
      "5": 690,
      "6": 710,
      "7": 730,
      "8": 750
    },
    school: "All Schools",
    image: "/uniforms/school_blazer.png"
  },
  {
    id: 18,
    name: "Boys Woolen Winter Sweater",
    category: "Boys",
    price: 550,
    sizes: ["30", "32", "34", "36", "38"],
    sizePrices: {
      "30": 550,
      "32": 580,
      "34": 610,
      "36": 640,
      "38": 670
    },
    school: "All Schools",
    image: "/uniforms/school_blazer.png"
  },
  // New Variety Items (Girls)
  {
    id: 19,
    name: "Girls Cotton Socks (Pack of 3)",
    category: "Girls",
    price: 180,
    sizes: ["S", "M", "L"],
    sizePrices: {
      "S": 180,
      "M": 190,
      "L": 200
    },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png"
  },
  {
    id: 20,
    name: "Girls Formal Black Shoes",
    category: "Girls",
    price: 600,
    sizes: ["2", "3", "4", "5", "6", "7"],
    sizePrices: {
      "2": 600,
      "3": 620,
      "4": 640,
      "5": 660,
      "6": 680,
      "7": 700
    },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png"
  },
  {
    id: 21,
    name: "Girls Premium Winter Cardigan",
    category: "Girls",
    price: 580,
    sizes: ["28", "30", "32", "34", "36"],
    sizePrices: {
      "28": 580,
      "30": 610,
      "32": 640,
      "34": 670,
      "36": 700
    },
    school: "All Schools",
    image: "/uniforms/girls_skirt.png"
  },
  // New Variety Items (Sports)
  {
    id: 22,
    name: "Sports Track Pants - Premium",
    category: "Sports",
    price: 399,
    sizes: ["24", "26", "28", "30", "32", "34"],
    sizePrices: {
      "24": 399,
      "26": 420,
      "28": 440,
      "30": 460,
      "32": 480,
      "34": 500
    },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png"
  },
  {
    id: 23,
    name: "Sports Windbreaker Jacket",
    category: "Sports",
    price: 799,
    sizes: ["S", "M", "L", "XL"],
    sizePrices: {
      "S": 799,
      "M": 849,
      "L": 899,
      "XL": 949
    },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png"
  },
  {
    id: 24,
    name: "Sports Socks - Cushioned (Pair)",
    category: "Sports",
    price: 80,
    sizes: ["One Size"],
    sizePrices: {
      "One Size": 80
    },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png"
  },
  {
    id: 25,
    name: "House T-Shirt - Red / Blue / Green / Yellow",
    category: "Sports",
    price: 199,
    sizes: ["22", "24", "26", "28", "30", "32", "34"],
    sizePrices: {
      "22": 199,
      "24": 210,
      "26": 220,
      "28": 230,
      "30": 240,
      "32": 250,
      "34": 260
    },
    school: "All Schools",
    image: "/uniforms/sports_uniform.png"
  },
  // Specific School Specific Uniforms
  {
    id: 26,
    name: "Kamarajar School Special Blazer",
    category: "Boys",
    price: 1299,
    sizes: ["30", "32", "34", "36"],
    sizePrices: {
      "30": 1299,
      "32": 1349,
      "34": 1399,
      "36": 1449
    },
    school: "Kamarajar Matriculation Higher Secondary School",
    image: "/uniforms/school_blazer.png"
  },
  {
    id: 27,
    name: "Mahatma School Sports Uniform Set",
    category: "Sports",
    price: 520,
    sizes: ["22", "24", "26", "28", "30"],
    sizePrices: {
      "22": 520,
      "24": 540,
      "26": 560,
      "28": 580,
      "30": 600
    },
    school: "Mahatma Montessori Matriculation School",
    image: "/uniforms/sports_uniform.png"
  },
  {
    id: 28,
    name: "TVS Academy Uniform Tie",
    category: "Boys",
    price: 220,
    sizes: ["One Size"],
    sizePrices: {
      "One Size": 220
    },
    school: "TVS Academy",
    image: "/uniforms/boys_shirt.png"
  },
  {
    id: 29,
    name: "St. Joseph's Premium Salwar Kameez",
    category: "Girls",
    price: 850,
    sizes: ["26", "28", "30", "32", "34", "36", "38"],
    sizePrices: {
      "26": 850,
      "28": 890,
      "30": 930,
      "32": 970,
      "34": 1010,
      "36": 1050,
      "38": 1090
    },
    school: "St. Joseph's Girls Higher Secondary School",
    image: "/uniforms/girls_skirt.png"
  },
  {
    id: 30,
    name: "O.C.P.M. School Salwar Set",
    category: "Girls",
    price: 850,
    sizes: ["26", "28", "30", "32", "34", "36", "38"],
    sizePrices: {
      "26": 850,
      "28": 890,
      "30": 930,
      "32": 970,
      "34": 1010,
      "36": 1050,
      "38": 1090
    },
    school: "O.C.P.M. Girls Higher Secondary School",
    image: "/uniforms/girls_skirt.png"
  }
];

const schools = [
  "All Schools",
  "St. Mary's High School",
  "Greenwood Academy",
  "Riverside Public School",
  "Oakwood International",
  "Sunrise Elementary",
  "Royal Grammar School",
  "Kamarajar Matriculation Higher Secondary School",
  "Mahatma Montessori Matriculation School",
  "TVS Academy",
  "St. Joseph's Girls Higher Secondary School",
  "O.C.P.M. Girls Higher Secondary School",
  "Vikas Vidyalaya Matriculation School"
];

export function Uniforms() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return location.state?.category || "All";
  });
  
  const [selectedSchool, setSelectedSchool] = useState(() => {
    return location.state?.school || "All Schools";
  });

  const [selectedSize, setSelectedSize] = useState("All");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [selectedProductSizes, setSelectedProductSizes] = useState<Record<number, string>>({});

  const categories = ["All", "Boys", "Girls", "Sports"];

  // Sync category and school filters with route navigation state
  useEffect(() => {
    if (location.state) {
      if (location.state.category !== undefined) {
        setSelectedCategory(location.state.category);
      }
      if (location.state.school !== undefined) {
        setSelectedSchool(location.state.school);
      }
    }
  }, [location.state]);

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

  const handleAddToCart = (uniform: Uniform, silent = false) => {
    const size = getSelectedSize(uniform);
    const price = uniform.sizePrices?.[size] ?? uniform.price;

    const cartJson = localStorage.getItem("cart");
    let cart = [];
    if (cartJson) {
      try {
        cart = JSON.parse(cartJson);
      } catch (e) {
        cart = [];
      }
    }
    if (!Array.isArray(cart)) cart = [];

    const existingItemIndex = cart.findIndex((item: any) => item.id === uniform.id && item.size === size);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: uniform.id,
        name: uniform.name,
        category: uniform.category,
        price,
        size,
        quantity: 1,
        school: uniform.school,
        image: uniform.image
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    if (!silent) {
      toast.success(`${uniform.name} (Size: ${size}) added to cart!`);
    }
  };

  const handleBuyNow = (uniform: Uniform) => {
    handleAddToCart(uniform, true);
    navigate("/cart?checkout=true");
  };

  const filteredUniforms = mockUniforms.filter((uniform) => {
    const categoryMatch =
      selectedCategory === "All" || uniform.category === selectedCategory;
    const sizeMatch =
      selectedSize === "All" || uniform.sizes.includes(selectedSize);
    
    // Items match if selectedSchool is "All Schools", or if the uniform is general ("All Schools"), 
    // or if the uniform is designated specifically for the selected school.
    const schoolMatch =
      selectedSchool === "All Schools" ||
      uniform.school === "All Schools" ||
      uniform.school === selectedSchool;

    return categoryMatch && sizeMatch && schoolMatch;
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

            {/* School Filter */}
            <div>
              <label className="block mb-3 text-xs uppercase font-bold text-gray-500">School / Institution</label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full border-2 border-black p-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black font-semibold"
              >
                {schools.map((schoolName) => (
                  <option key={schoolName} value={schoolName}>
                    {schoolName}
                  </option>
                ))}
              </select>
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
                    {/* Favorite Button (Visible on mobile/desktop with fixed styling) */}
                    <div className="absolute top-4 right-4 z-10">
                      <button 
                        onClick={() => toggleLike(uniform.id)}
                        className={`border-2 border-black p-3 transition-colors shadow-lg ${
                          likedItems.has(uniform.id) 
                            ? "bg-black text-white" 
                            : "bg-white text-black hover:bg-black hover:text-white"
                        }`}
                      >
                        <Heart 
                          size={20} 
                          className={likedItems.has(uniform.id) ? "text-red-500 fill-red-500" : ""}
                        />
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

                <div className="p-6 pt-0 flex flex-col gap-2">
                  <button 
                    onClick={() => handleAddToCart(uniform)}
                    className="w-full bg-white text-black py-3 hover:bg-black hover:text-white border-2 border-black transition-all duration-300 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]"
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => handleBuyNow(uniform)}
                    className="w-full bg-black text-white py-3 hover:bg-white hover:text-black border-2 border-black transition-all duration-300 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]"
                  >
                    Buy Now
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
