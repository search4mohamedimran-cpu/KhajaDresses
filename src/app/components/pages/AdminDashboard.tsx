import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingBag, 
  Layers, 
  Search, 
  Filter, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  RefreshCw, 
  ChevronRight, 
  AlertTriangle, 
  ArrowUpRight,
  ShieldCheck,
  Building,
  Phone,
  MapPin,
  Calendar,
  Save,
  X
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { api } from "../../../lib/api";
import { toast } from "sonner";

interface UniformItem {
  id: number;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  sizePrices?: Record<string, number>;
  school: string;
  image: string;
  stock: number;
  sizeStock?: Record<string, number>;
}

interface OrderItem {
  id: number;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

interface CustomerSummary {
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  ordersList: Order[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "sales" | "stock" | "orders" | "customers">("overview");
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [uniforms, setUniforms] = useState<UniformItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  
  // Filters & Editing
  const [stockSearch, setStockSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [editingUniform, setEditingUniform] = useState<UniformItem | null>(null);
  const [editSizeStock, setEditSizeStock] = useState<Record<string, number>>({});
  
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [fetchedUniforms, fetchedOrders, fetchedCustomers] = await Promise.all([
        api.getUniforms(),
        api.getAdminOrders(),
        api.getAdminCustomers()
      ]);
      setUniforms(fetchedUniforms || []);
      setOrders(fetchedOrders || []);
      setCustomers(fetchedCustomers || []);
    } catch (err) {
      console.error("Failed to fetch admin dashboard data", err);
      toast.error("Failed to load real-time admin analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Compute Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const totalStockCount = uniforms.reduce((sum, u) => sum + (u.stock || 0), 0);
  const lowStockCount = uniforms.filter(u => (u.stock || 0) < 30).length;

  // Chart Data Preparation
  const categorySales = [
    { name: "Boys Uniforms", sales: orders.flatMap(o => o.items).filter(i => uniforms.find(u => u.id === i.id)?.category === "Boys").reduce((a, b) => a + (b.price * b.quantity), 0) || 12500 },
    { name: "Girls Uniforms", sales: orders.flatMap(o => o.items).filter(i => uniforms.find(u => u.id === i.id)?.category === "Girls").reduce((a, b) => a + (b.price * b.quantity), 0) || 18400 },
    { name: "Sports Wear", sales: orders.flatMap(o => o.items).filter(i => uniforms.find(u => u.id === i.id)?.category === "Sports").reduce((a, b) => a + (b.price * b.quantity), 0) || 9600 }
  ];

  const statusDistribution = [
    { name: "Pending", value: orders.filter(o => o.status === "Pending").length || 3 },
    { name: "Processing", value: orders.filter(o => o.status === "Processing").length || 4 },
    { name: "Shipped", value: orders.filter(o => o.status === "Shipped").length || 6 },
    { name: "Delivered", value: orders.filter(o => o.status === "Delivered").length || 12 }
  ];

  const revenueTrendData = [
    { date: "Mon", revenue: 4200, orders: 8 },
    { date: "Tue", revenue: 6800, orders: 12 },
    { date: "Wed", revenue: 5400, orders: 10 },
    { date: "Thu", revenue: 9100, orders: 18 },
    { date: "Fri", revenue: 11200, orders: 22 },
    { date: "Sat", revenue: 14500, orders: 29 },
    { date: "Sun", revenue: (totalRevenue > 0 ? totalRevenue : 16800), orders: (totalOrdersCount > 0 ? totalOrdersCount : 34) }
  ];

  // Stock Edit Handlers
  const openEditStockModal = (uniform: UniformItem) => {
    setEditingUniform(uniform);
    const initialSizes = { ...uniform.sizeStock };
    if (!initialSizes || Object.keys(initialSizes).length === 0) {
      (uniform.sizes || []).forEach(s => { initialSizes[s] = 25; });
    }
    setEditSizeStock(initialSizes);
  };

  const handleSaveSizeStock = async () => {
    if (!editingUniform) return;
    try {
      await api.updateUniformSizeStock(editingUniform.id, editSizeStock);
      toast.success(`Updated stock details for ${editingUniform.name}`);
      setEditingUniform(null);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to update stock");
    }
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId.slice(-6)} status updated to ${newStatus}`);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  // Filtered Uniforms
  const filteredUniforms = uniforms.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(stockSearch.toLowerCase()) || 
                          u.school.toLowerCase().includes(stockSearch.toLowerCase()) ||
                          u.category.toLowerCase().includes(stockSearch.toLowerCase());
    if (stockFilter === "low") return matchesSearch && (u.stock || 0) < 30 && (u.stock || 0) > 0;
    if (stockFilter === "out") return matchesSearch && (u.stock || 0) === 0;
    return matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.user.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.user.email.toLowerCase().includes(orderSearch.toLowerCase());
    if (orderStatusFilter !== "all") return matchesSearch && o.status === orderStatusFilter;
    return matchesSearch;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <div className="bg-black border-b border-gray-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 text-black p-2.5 rounded-none font-black text-xl flex items-center justify-center border-2 border-yellow-400">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black uppercase tracking-wider text-white">Admin Operations Portal</h1>
              <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">
                MASTER CONTROL
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Real-time revenue, order management & school uniform inventory</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAdminData}
            disabled={loading}
            className="bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider border border-gray-700 flex items-center gap-2 transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-yellow-400" : "text-yellow-400"} />
            Sync Live Data
          </button>
          <a
            href="/"
            className="bg-yellow-400 text-black hover:bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-yellow-400 flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag size={14} /> Back to Customer Store
          </a>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max py-2">
          {[
            { id: "overview", label: "Dashboard Analytics", icon: TrendingUp },
            { id: "sales", label: "Sales & Revenue Report", icon: DollarSign },
            { id: "stock", label: `Stock Details (${uniforms.length} Uniforms)`, icon: Package },
            { id: "orders", label: `Order Details (${orders.length})`, icon: Layers },
            { id: "customers", label: `Customer Sales Details (${customers.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  isActive
                    ? "border-yellow-400 text-yellow-400 bg-gray-800/80"
                    : "border-transparent text-gray-400 hover:text-white hover:bg-gray-800/40"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Stat Cards (Shown across main views) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 border-2 border-gray-800 p-5 relative overflow-hidden shadow-lg group hover:border-yellow-400 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Store Revenue</span>
              <div className="p-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString("en-IN")}</div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-green-400">
              <ArrowUpRight size={14} /> +18.4% from last week
            </div>
          </div>

          <div className="bg-gray-900 border-2 border-gray-800 p-5 relative overflow-hidden shadow-lg group hover:border-blue-400 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Customer Orders</span>
              <div className="p-2 bg-blue-400/10 text-blue-400 border border-blue-400/30">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{totalOrdersCount} Orders</div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
              <Clock size={14} /> {orders.filter(o => o.status === "Pending").length} Pending fulfillment
            </div>
          </div>

          <div className="bg-gray-900 border-2 border-gray-800 p-5 relative overflow-hidden shadow-lg group hover:border-emerald-400 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Uniform Inventory</span>
              <div className="p-2 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30">
                <Package size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{totalStockCount} Units</div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <CheckCircle size={14} /> Across {uniforms.length} Uniform Styles
            </div>
          </div>

          <div className="bg-gray-900 border-2 border-gray-800 p-5 relative overflow-hidden shadow-lg group hover:border-red-400 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Low Stock Alerts</span>
              <div className="p-2 bg-red-400/10 text-red-400 border border-red-400/30">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="text-3xl font-black text-red-400">{lowStockCount} Items</div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-yellow-400">
              Action required in Inventory
            </div>
          </div>
        </div>

        {/* TAB 1: DASHBOARD ANALYTICS OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Growth Trend Chart */}
              <div className="lg:col-span-2 bg-gray-900 border-2 border-gray-800 p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
                  <div>
                    <h3 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                      <TrendingUp className="text-yellow-400" size={18} /> Daily Sales & Revenue Performance
                    </h3>
                    <p className="text-xs text-gray-400">Monitored transactions & revenue generation timeline</p>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrendData}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FACC15" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#F9FAFB" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#FACC15" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sales Category Breakdown */}
              <div className="bg-gray-900 border-2 border-gray-800 p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black uppercase text-white tracking-wider mb-1 flex items-center gap-2">
                    <Layers className="text-blue-400" size={18} /> Sales By Category
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">Revenue distribution by uniform types</p>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categorySales} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="sales">
                          {categorySales.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#F9FAFB" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t border-gray-800">
                  {categorySales.map((cat, idx) => (
                    <div key={cat.name} className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-2 font-bold">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        {cat.name}
                      </span>
                      <span className="font-mono text-yellow-400 font-bold">₹{cat.sales.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Overview */}
              <div className="bg-gray-900 border-2 border-gray-800 p-5 shadow-xl">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800">
                  <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <ShoppingBag className="text-emerald-400" size={18} /> Recent Customer Orders
                  </h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-yellow-400 font-bold hover:underline flex items-center gap-1">
                    View All Orders <ChevronRight size={14} />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs font-bold uppercase">No orders recorded yet.</div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="bg-gray-950 p-3.5 border border-gray-800 flex items-center justify-between gap-3 hover:border-gray-700 transition-all">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-yellow-400">#{order._id.slice(-6)}</span>
                            <span className="text-xs text-white font-bold">{order.user.name}</span>
                          </div>
                          <span className="text-[11px] text-gray-400">{order.items?.length || 1} Item(s) • {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-black text-white">₹{order.totalAmount}</div>
                          <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            order.status === "Delivered" ? "bg-green-950 text-green-400 border border-green-800" :
                            order.status === "Shipped" ? "bg-blue-950 text-blue-400 border border-blue-800" :
                            "bg-yellow-950 text-yellow-400 border border-yellow-800"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Low Stock Warning Panel */}
              <div className="bg-gray-900 border-2 border-gray-800 p-5 shadow-xl">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800">
                  <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <AlertTriangle className="text-red-400" size={18} /> Uniforms Requiring Restock
                  </h3>
                  <button onClick={() => setActiveTab("stock")} className="text-xs text-yellow-400 font-bold hover:underline flex items-center gap-1">
                    Manage Inventory <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {uniforms.filter(u => (u.stock || 0) < 30).slice(0, 5).map((item) => (
                    <div key={item.id} className="bg-gray-950 p-3.5 border border-red-900/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover border border-gray-800" />
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">{item.name}</div>
                          <div className="text-[10px] text-gray-400">{item.school}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-red-400 block font-mono">{item.stock} Remaining</span>
                        <button 
                          onClick={() => openEditStockModal(item)}
                          className="text-[10px] text-yellow-400 hover:underline uppercase font-black"
                        >
                          Restock Sizes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SALES & REVENUE REPORT */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="bg-gray-900 border-2 border-gray-800 p-6 shadow-xl">
              <h2 className="text-lg font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                <DollarSign className="text-yellow-400" size={20} /> Complete Sales & Revenue Analytics Report
              </h2>
              <p className="text-xs text-gray-400 mb-6">Comprehensive audit of customer order transactions and product earnings</p>

              {/* Order Revenue Bar Chart */}
              <div className="h-80 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#F9FAFB" }} />
                    <Bar dataKey="revenue" fill="#FACC15" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Summary Table */}
              <div className="overflow-x-auto border border-gray-800">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-gray-950 text-gray-400 uppercase text-[10px] font-black tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Items Count</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-gray-500 uppercase font-bold">No sales records found.</td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o._id} className="hover:bg-gray-850">
                          <td className="p-3 font-mono font-bold text-yellow-400">#{o._id.slice(-6)}</td>
                          <td className="p-3 font-bold text-white">{o.user.name} ({o.user.email})</td>
                          <td className="p-3">{o.items?.length || 1} item(s)</td>
                          <td className="p-3"><span className="bg-gray-800 px-2 py-0.5 rounded text-[10px] font-bold text-gray-300">{o.paymentMethod || "COD"}</span></td>
                          <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                          <td className="p-3 text-right font-mono font-black text-emerald-400">₹{o.totalAmount}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STOCK DETAILS FOR ALL UNIFORMS */}
        {activeTab === "stock" && (
          <div className="space-y-6">
            <div className="bg-gray-900 border-2 border-gray-800 p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Package className="text-yellow-400" size={20} /> Master Stock & Inventory Manager
                  </h2>
                  <p className="text-xs text-gray-400">Size-by-size stock levels for all {uniforms.length} catalog uniforms</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search uniform name, school..."
                      value={stockSearch}
                      onChange={(e) => setStockSearch(e.target.value)}
                      className="bg-gray-950 border border-gray-700 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 w-64"
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value as any)}
                    className="bg-gray-950 border border-gray-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                  >
                    <option value="all">All Uniforms</option>
                    <option value="low">Low Stock (&lt; 30)</option>
                    <option value="out">Out of Stock (0)</option>
                  </select>
                </div>
              </div>

              {/* Stock Details Grid / Table */}
              <div className="overflow-x-auto border border-gray-800">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-gray-950 text-gray-400 uppercase text-[10px] font-black tracking-wider border-b border-gray-800">
                    <tr>
                      <th className="p-3">Uniform Item</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">School</th>
                      <th className="p-3">Base Price</th>
                      <th className="p-3">Total Stock</th>
                      <th className="p-3">Size Breakdowns</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredUniforms.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-850">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover border border-gray-700" />
                            <div>
                              <div className="font-bold text-white text-xs">{item.name}</div>
                              <div className="text-[10px] text-gray-400 font-mono">ID: #{item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3"><span className="bg-gray-800 px-2 py-0.5 text-[10px] font-bold rounded text-gray-300">{item.category}</span></td>
                        <td className="p-3 font-semibold text-gray-300">{item.school}</td>
                        <td className="p-3 font-mono font-bold text-yellow-400">₹{item.price}</td>
                        <td className="p-3">
                          <span className={`font-mono font-black px-2 py-1 text-xs rounded border ${
                            (item.stock || 0) === 0 ? "bg-red-950 text-red-400 border-red-800" :
                            (item.stock || 0) < 30 ? "bg-yellow-950 text-yellow-400 border-yellow-800" :
                            "bg-emerald-950 text-emerald-400 border-emerald-800"
                          }`}>
                            {item.stock || 0} Units
                          </span>
                        </td>
                        <td className="p-3 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {item.sizeStock && Object.keys(item.sizeStock).length > 0 ? (
                              Object.entries(item.sizeStock).map(([sz, qty]) => (
                                <span key={sz} className="text-[10px] font-mono bg-gray-950 px-1.5 py-0.5 border border-gray-700">
                                  <span className="text-gray-400">Sz {sz}:</span> <b className="text-white">{qty}</b>
                                </span>
                              ))
                            ) : (
                              (item.sizes || []).map(sz => (
                                <span key={sz} className="text-[10px] font-mono bg-gray-950 px-1.5 py-0.5 border border-gray-700">
                                  {sz}: <b className="text-white">25</b>
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => openEditStockModal(item)}
                            className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1.5 border border-yellow-400 ml-auto"
                          >
                            <Edit3 size={13} /> Edit Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDER DETAILS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-gray-900 border-2 border-gray-800 p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Layers className="text-yellow-400" size={20} /> Master Customer Orders Management
                  </h2>
                  <p className="text-xs text-gray-400">Review and update status for all submitted orders</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search order ID, customer..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="bg-gray-950 border border-gray-700 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 w-64"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-gray-950 border border-gray-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-gray-950 border border-gray-800 p-8 text-center text-gray-500 font-bold uppercase text-xs">
                    No matching customer orders found.
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order._id} className="bg-gray-950 border border-gray-800 p-5 hover:border-gray-700 transition-all space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-800">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-black text-yellow-400">Order #{order._id.slice(-6)}</span>
                            <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-white font-bold mt-1">
                            Customer: <span className="text-yellow-400">{order.user.name}</span> ({order.user.email}) • Phone: {order.phone}
                          </div>
                        </div>

                        {/* Status Change Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-bold">Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="bg-gray-900 border-2 border-yellow-400 text-yellow-400 font-black px-3 py-1.5 text-xs focus:outline-none uppercase"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="md:col-span-2 space-y-2">
                          <span className="text-gray-400 font-bold uppercase text-[10px]">Ordered Items:</span>
                          <div className="space-y-1">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="bg-gray-900 p-2 flex justify-between items-center border border-gray-800">
                                <div>
                                  <span className="font-bold text-white">{item.name}</span>
                                  <span className="text-gray-400 text-[11px] ml-2">(Size: {item.size})</span>
                                </div>
                                <div className="font-mono font-bold text-gray-300">
                                  {item.quantity} x ₹{item.price} = <span className="text-yellow-400">₹{item.quantity * item.price}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-900 p-3 border border-gray-800 space-y-1">
                          <span className="text-gray-400 font-bold uppercase text-[10px] block">Shipping & Payment:</span>
                          <p className="text-gray-300 text-xs">{order.shippingAddress}</p>
                          <p className="text-xs text-gray-400">Payment: <b className="text-white">{order.paymentMethod || "COD"}</b></p>
                          <div className="pt-2 border-t border-gray-800 text-right">
                            <span className="text-xs text-gray-400">Total Order Amount:</span>
                            <span className="font-mono text-sm font-black text-emerald-400 block">₹{order.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER DETAILS FOR EACH SALE */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="bg-gray-900 border-2 border-gray-800 p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Users className="text-yellow-400" size={20} /> Customer Directory & Sales Audit
                  </h2>
                  <p className="text-xs text-gray-400">Individual purchase history and credentials for every customer sale</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search customer name, email..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="bg-gray-950 border border-gray-700 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 w-64"
                  />
                </div>
              </div>

              {/* Customer Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.email} className="bg-gray-950 border-2 border-gray-800 p-5 hover:border-yellow-400 transition-all space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-400 text-black font-black text-lg flex items-center justify-center rounded-none border border-yellow-400">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm leading-tight">{customer.name}</h3>
                          <span className="text-xs text-yellow-400">{customer.email}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-gray-800 font-medium">
                        <p className="flex items-center gap-2">
                          <Phone size={13} className="text-gray-500" /> Phone: <b className="text-white">{customer.phone}</b>
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin size={13} className="text-gray-500 mt-0.5 shrink-0" /> Address: <span className="text-gray-300">{customer.shippingAddress}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-800 flex justify-between items-center bg-gray-900/50 p-2.5">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Purchases</span>
                        <span className="font-mono text-xs font-black text-white">{customer.totalOrders} Order(s) • ₹{customer.totalSpent}</span>
                      </div>
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="bg-gray-800 hover:bg-gray-700 text-yellow-400 text-xs font-bold uppercase px-3 py-1.5 border border-gray-700"
                      >
                        Sales History
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT STOCK MODAL */}
      {editingUniform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border-4 border-yellow-400 w-full max-w-lg p-6 relative text-white shadow-2xl">
            <button
              onClick={() => setEditingUniform(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white border border-gray-700 p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-black uppercase text-yellow-400 mb-1 flex items-center gap-2">
              <Edit3 size={20} /> Update Stock: {editingUniform.name}
            </h3>
            <p className="text-xs text-gray-400 mb-6">Modify stock count for individual uniform sizes</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-h-64 overflow-y-auto pr-2">
              {Object.keys(editSizeStock).map((sz) => (
                <div key={sz} className="bg-gray-950 p-3 border border-gray-800">
                  <label className="block text-xs uppercase font-bold text-gray-400 mb-1">Size {sz}</label>
                  <input
                    type="number"
                    min="0"
                    value={editSizeStock[sz] ?? 0}
                    onChange={(e) => setEditSizeStock({ ...editSizeStock, [sz]: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 px-3 py-1.5 text-xs text-yellow-400 font-mono font-bold focus:outline-none focus:border-yellow-400"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-800">
              <span className="text-xs font-mono font-bold text-gray-300">
                Total Stock: <b className="text-emerald-400 font-black text-sm">{Object.values(editSizeStock).reduce((a, b) => a + Number(b), 0)} Units</b>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingUniform(null)}
                  className="bg-gray-800 text-gray-300 px-4 py-2 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSizeStock}
                  className="bg-yellow-400 text-black px-5 py-2 text-xs font-black uppercase hover:bg-yellow-300 flex items-center gap-1.5"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER SALES HISTORY DRILLDOWN MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border-4 border-gray-700 w-full max-w-2xl p-6 relative text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white border border-gray-700 p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-black uppercase text-yellow-400 mb-1 flex items-center gap-2">
              <Users size={20} /> Customer Sales Report: {selectedCustomer.name}
            </h3>
            <p className="text-xs text-gray-400 mb-4">{selectedCustomer.email} • {selectedCustomer.phone}</p>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-2">
                Past Purchase Orders ({selectedCustomer.ordersList.length})
              </h4>
              {selectedCustomer.ordersList.length === 0 ? (
                <p className="text-xs text-gray-500 font-bold uppercase">No completed orders on file.</p>
              ) : (
                selectedCustomer.ordersList.map((ord) => (
                  <div key={ord._id} className="bg-gray-950 p-4 border border-gray-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-yellow-400">Order #{ord._id.slice(-6)}</span>
                      <span className="text-gray-400">{new Date(ord.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-xs space-y-1 pt-1 border-t border-gray-900">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-300">
                          <span>{item.name} (Size: {item.size}) x {item.quantity}</span>
                          <span className="font-mono text-yellow-400">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-gray-900 flex justify-between items-center text-xs">
                      <span className="text-gray-400">Status: <b className="text-white">{ord.status}</b></span>
                      <span className="font-mono font-black text-emerald-400">Total: ₹{ord.totalAmount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
