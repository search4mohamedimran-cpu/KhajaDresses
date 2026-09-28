import { useState, useEffect } from "react";
import { Package, X, Clock, MapPin, Phone, CreditCard, Loader2, ShoppingBag } from "lucide-react";
import { api } from "../../../lib/api";

interface OrderItem {
  id: number;
  name: string;
  category: string;
  price: number;
  size: string;
  quantity: number;
  school: string;
  image?: string;
}

interface Order {
  _id?: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  status: string;
  createdAt?: string;
}

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrdersModal({ isOpen, onClose }: OrdersModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const loadOrdersForCurrentUser = () => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
        if (user?.email) {
          fetchUserOrders(user.email);
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    } else {
      setCurrentUser(null);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    loadOrdersForCurrentUser();
    window.addEventListener("ordersUpdated", loadOrdersForCurrentUser);
    return () => {
      window.removeEventListener("ordersUpdated", loadOrdersForCurrentUser);
    };
  }, [isOpen]);

  const fetchUserOrders = async (email: string) => {
    setLoading(true);
    let combinedOrders: Order[] = [];

    // 1. Load local orders saved in localStorage
    try {
      const localOrdersJson = localStorage.getItem("local_orders");
      if (localOrdersJson) {
        const parsed = JSON.parse(localOrdersJson);
        if (Array.isArray(parsed)) {
          combinedOrders = parsed.filter(
            (o: Order) => o.user?.email?.toLowerCase() === email.toLowerCase()
          );
        }
      }
    } catch (e) {
      console.error("Error loading local orders:", e);
    }

    // 2. Fetch remote orders from backend database API
    try {
      const serverOrders = await api.getOrders(email);
      if (Array.isArray(serverOrders)) {
        const serverOrderIds = new Set(serverOrders.map((o: Order) => o._id));
        const uniqueLocalOrders = combinedOrders.filter((o) => !serverOrderIds.has(o._id));
        combinedOrders = [...serverOrders, ...uniqueLocalOrders];
      }
    } catch (error) {
      console.warn("Could not fetch orders from server API, utilizing local orders history:", error);
    } finally {
      // Sort orders by creation timestamp descending
      combinedOrders.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setOrders(combinedOrders);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-4 border-black w-full max-w-3xl max-h-[90vh] flex flex-col relative shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-black text-white flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-black flex items-center justify-center font-black">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider">My Orders History</h2>
              {currentUser && (
                <p className="text-xs text-yellow-400 font-semibold">
                  Purchases for: {currentUser.name} ({currentUser.email})
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-800 text-white hover:bg-yellow-400 hover:text-black transition-colors border border-gray-700"
            aria-label="Close orders modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-black mb-3" size={36} />
              <p className="text-xs uppercase font-bold text-gray-500">Loading your purchase history...</p>
            </div>
          ) : !currentUser ? (
            <div className="py-16 text-center border-2 border-black bg-white p-8">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-black uppercase mb-2">Not Logged In</h3>
              <p className="text-xs text-gray-500 font-semibold mb-4">
                Please sign in to view your uniform purchase history.
              </p>
              <button
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new Event("openAuthModal"));
                }}
                className="bg-black text-white px-6 py-3 font-black uppercase text-xs hover:bg-yellow-400 hover:text-black border-2 border-black transition-all"
              >
                Log In Now
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-gray-300 bg-white p-8">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-2xl font-black uppercase mb-2">No Orders Found</h3>
              <p className="text-xs text-gray-500 font-semibold mb-6">
                You haven't placed any uniform orders yet. Browse our collection to start shopping!
              </p>
              <button
                onClick={() => {
                  onClose();
                  const el = document.getElementById("uniforms");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-black text-white px-6 py-3 font-black uppercase text-xs hover:bg-yellow-400 hover:text-black border-2 border-black transition-all"
              >
                Browse Uniforms Collection
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div key={order._id || idx} className="bg-white border-2 border-black shadow-md p-6">
                  {/* Order Header Info */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-gray-200 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] bg-black text-white px-2.5 py-1 font-black uppercase tracking-wider">
                        Order #{order._id ? order._id.slice(-8).toUpperCase() : `ORD-${idx + 1}`}
                      </span>
                      <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-gray-500">
                        <Clock size={14} />
                        <span>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "Recently Placed"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs uppercase font-bold text-gray-400 block">Total Amount</span>
                      <span className="text-2xl font-black text-black">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-black uppercase text-gray-700 tracking-wider">Uniform Items Purchased:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-center gap-3 p-3 border border-gray-200 bg-gray-50 font-medium"
                        >
                          <div className="w-14 h-14 bg-white border border-black flex-shrink-0 overflow-hidden flex items-center justify-center">
                            <img
                              src={item.image || "/uniforms/boys_shirt.png"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-black truncate">{item.name}</h4>
                            <p className="text-[10px] text-gray-500">{item.school}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px]">
                              <span className="bg-black text-white px-1.5 py-0.5 font-bold">
                                Size: {item.size}
                              </span>
                              <span className="font-bold text-gray-700">Qty: {item.quantity}</span>
                              <span className="font-black text-black">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-xs font-semibold text-gray-600 bg-gray-50 p-4 border">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-black flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-black block text-[10px] uppercase">Shipping Address:</span>
                        <span>{order.shippingAddress}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone size={16} className="text-black flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-black block text-[10px] uppercase">Contact Phone:</span>
                        <span>{order.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CreditCard size={16} className="text-black flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-black block text-[10px] uppercase">Payment Status:</span>
                        <span className="text-green-700 font-bold">{order.paymentMethod || "COD"} (Recorded)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
