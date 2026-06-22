import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, ChevronRight, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../lib/api";

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  size: string;
  quantity: number;
  school: string;
  image: string;
}

export function Cart() {
  const [searchParams] = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Load cart and user data on mount
  useEffect(() => {
    const loadCartAndUser = () => {
      // Cart items
      const cartJson = localStorage.getItem("cart");
      if (cartJson) {
        try {
          const parsed = JSON.parse(cartJson);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        } catch (e) {
          console.error("Failed to parse cart items:", e);
        }
      }

      // User session
      const userJson = localStorage.getItem("user");
      if (userJson) {
        try {
          setCurrentUser(JSON.parse(userJson));
        } catch (e) {
          console.error("Failed to parse user session:", e);
        }
      }
    };

    loadCartAndUser();
  }, []);

  const updateQuantity = (id: number, size: string, delta: number) => {
    setCartItems((prevItems) => {
      const updated = prevItems.map((item) => {
        if (item.id === id && item.size === size) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
      return updated;
    });
  };

  const handleUncart = (id: number, size: string, name: string) => {
    setCartItems((prevItems) => {
      const filtered = prevItems.filter((item) => !(item.id === id && item.size === size));
      localStorage.setItem("cart", JSON.stringify(filtered));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.info(`Removed ${name} (Size: ${size}) from cart`);
      return filtered;
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 0 : 0; // free shipping
  const grandTotal = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please login to complete your order");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!shippingAddress.trim() || !phone.trim()) {
      toast.error("Please fill out shipping details");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        user: {
          name: currentUser.name,
          email: currentUser.email
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          school: item.school
        })),
        totalAmount: grandTotal,
        shippingAddress,
        phone,
        paymentMethod
      };

      const result = await api.placeOrder(orderPayload);
      if (result.orderId) {
        toast.success("Order placed successfully!");
        setOrderSuccess({
          orderId: result.orderId,
          total: grandTotal,
          address: shippingAddress,
          phone
        });

        // Clear cart
        localStorage.removeItem("cart");
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(result.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout submission error:", error);
      toast.error("Failed to connect to backend server. Ensure server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-[calc(100vh-16rem)] bg-white py-16 px-4">
        <div className="container mx-auto max-w-xl text-center">
          <div className="border-4 border-black p-8 md:p-12 bg-white inline-block w-full">
            <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500 w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4 text-black">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-8 font-medium">
              Thank you for shopping with Kaja Dresses. Your order details have been recorded in our MongoDB database.
            </p>

            <div className="border-2 border-black p-6 bg-gray-50 text-left space-y-4 mb-8">
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold text-gray-500 uppercase text-xs">Order ID</span>
                <span className="font-bold text-sm tracking-widest">{orderSuccess.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold text-gray-500 uppercase text-xs">Total Amount</span>
                <span className="font-black text-lg">₹{orderSuccess.total}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold text-gray-500 uppercase text-xs">Shipping Address</span>
                <span className="font-semibold text-sm max-w-[200px] text-right truncate" title={orderSuccess.address}>
                  {orderSuccess.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-500 uppercase text-xs">Contact Phone</span>
                <span className="font-semibold text-sm">{orderSuccess.phone}</span>
              </div>
            </div>

            <Link
              to="/uniforms"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 border-2 border-black font-black uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2 text-black">Cart Collection</h1>
          <p className="text-gray-600 text-lg">
            Review your selected school dresses and uniforms.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="border-4 border-dashed border-black p-16 text-center bg-gray-50">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold uppercase mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              You haven't added any uniforms to your cart collection yet. Browse our selection to get started.
            </p>
            <Link
              to="/uniforms"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 border-2 border-black font-black uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-all duration-300"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          /* Cart List & Checkout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border-2 border-black divide-y-2 divide-black">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="p-6 bg-white flex flex-col sm:flex-row gap-6 justify-between items-center">
                    {/* Item details */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                      <div className="w-20 h-20 border-2 border-black flex-shrink-0 bg-gray-50 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black border border-black px-2 py-0.5 uppercase bg-gray-50 text-gray-700">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold mt-1 text-black">{item.name}</h3>
                        <p className="text-xs text-gray-400 font-semibold mb-2">School: {item.school}</p>
                        <span className="inline-block border-2 border-black px-2 py-0.5 text-xs font-black bg-black text-white">
                          Size: {item.size}
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls and price */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Plus/Minus quantity */}
                      <div className="flex items-center border-2 border-black">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          className="p-2 hover:bg-gray-100 transition-colors border-r border-black"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 font-black text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="p-2 hover:bg-gray-100 transition-colors border-l border-black"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right sm:min-w-[100px]">
                        <p className="text-xl font-black">₹{item.price * item.quantity}</p>
                        <p className="text-xs text-gray-400">₹{item.price} each</p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleUncart(item.id, item.size, item.name)}
                        className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping button */}
              <Link to="/uniforms" className="inline-flex items-center gap-2 hover:underline font-bold text-sm text-black">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>

            {/* Checkout Form & Summary */}
            <div className="lg:col-span-1 border-2 border-black p-8 bg-gray-50 flex flex-col gap-6">
              <h2 className="text-2xl font-bold uppercase tracking-wider border-b-2 border-black pb-4 text-black">
                Order Summary
              </h2>

              <div className="space-y-4 font-semibold text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 uppercase text-xs font-black">Free</span>
                </div>
                <div className="border-t-2 border-black border-dashed pt-4 flex justify-between text-black">
                  <span className="text-base uppercase font-black">Total</span>
                  <span className="text-2xl font-black">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="border-t-2 border-black pt-6">
                <h3 className="text-lg font-bold uppercase mb-4 text-black">Shipping Details</h3>
                
                {!currentUser ? (
                  /* Warning to log in */
                  <div className="border-2 border-red-500 bg-red-50 p-4 text-center">
                    <p className="text-red-700 text-xs font-semibold mb-4 leading-relaxed">
                      You must be logged in to proceed with checking out and recording details to MongoDB.
                    </p>
                    <Link
                      to="/login"
                      className="inline-block w-full bg-red-600 text-white font-black uppercase text-[10px] tracking-wider py-3 border-2 border-red-600 hover:bg-white hover:text-red-600 transition-colors"
                    >
                      Login / Register
                    </Link>
                  </div>
                ) : (
                  /* Address / Checkout Fields */
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div className="text-xs bg-gray-150 p-3 border border-gray-300 mb-2">
                      <p className="font-bold text-gray-700">Ordering as:</p>
                      <p className="text-gray-500">{currentUser.name} ({currentUser.email})</p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5">Shipping Address *</label>
                      <textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                        disabled={loading}
                        rows={3}
                        className="w-full border-2 border-black p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white resize-none disabled:opacity-50"
                        placeholder="257F, Opp. to Ananda & Ananda, kamarajar Road, Madurai"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full border-2 border-black p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white disabled:opacity-50"
                        placeholder="+91 1234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5">Payment Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("COD")}
                          disabled={loading}
                          className={`border-2 py-3 text-[10px] font-black uppercase tracking-wider transition-all ${
                            paymentMethod === "COD"
                              ? "border-black bg-black text-white"
                              : "border-gray-300 text-gray-400 bg-white hover:border-black hover:text-black"
                          }`}
                        >
                          Cash on Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("CARD")}
                          disabled={loading}
                          className={`border-2 py-3 text-[10px] font-black uppercase tracking-wider transition-all ${
                            paymentMethod === "CARD"
                              ? "border-black bg-black text-white"
                              : "border-gray-300 text-gray-400 bg-white hover:border-black hover:text-black"
                          }`}
                        >
                          Credit Card (COD Simulator)
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || cartItems.length === 0}
                      className="w-full bg-black text-white py-4 hover:bg-white hover:text-black border-2 border-black transition-all duration-300 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-gray-400"
                    >
                      {loading ? "Processing..." : "Place Order (Confirm Buy)"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
