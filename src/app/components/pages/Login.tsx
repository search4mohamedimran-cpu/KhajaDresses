import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck, ShoppingBag, Sparkles, Key } from "lucide-react";
import { api } from "../../../lib/api";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleRoleSwitch = (newRole: "customer" | "admin") => {
    setRole(newRole);
    setMessage({ type: "", text: "" });
    if (newRole === "admin") {
      setFormData({
        email: "admin@khajadresses.com",
        password: "admin123",
        name: "Store Administrator",
      });
      setIsLogin(true);
    } else {
      setFormData({ email: "", password: "", name: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = { ...formData, role };
      const result = isLogin 
        ? await api.login(payload)
        : await api.register(payload);

      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        window.dispatchEvent(new Event("userUpdated"));
        toast.success(role === "admin" ? "Admin Access Granted!" : "Welcome back!");
        setMessage({ type: "success", text: role === "admin" ? "Admin Portal Access Granted! Redirecting..." : "Login successful!" });
        
        setTimeout(() => {
          if (result.user?.role === "admin" || role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        setMessage({ type: "error", text: result.message || "An error occurred during authentication" });
      }
    } catch (error) {
      console.warn("MERN server offline, using local fallback state", error);
      // Fallback for offline demo state
      const fallbackUser = {
        name: role === "admin" ? "Store Administrator" : (formData.name || formData.email.split("@")[0] || "Customer"),
        email: formData.email,
        role,
      };
      localStorage.setItem("token", `token-${Date.now()}`);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      window.dispatchEvent(new Event("userUpdated"));
      toast.success(role === "admin" ? "Signed in as Administrator!" : "Signed in successfully!");
      
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    setTimeout(() => {
      const mockUser = {
        name: `${provider} User`,
        email: `${provider.toLowerCase()}user@example.com`,
        role: "customer"
      };
      const mockToken = `mock-${provider.toLowerCase()}-token-${Date.now()}`;
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      window.dispatchEvent(new Event("userUpdated"));
      setMessage({ type: "success", text: `Successfully logged in with ${provider}!` });
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-lg">
        {/* Role Tab Navigation Header */}
        <div className="flex border-4 border-black mb-6 bg-black p-1 shadow-lg">
          <button
            type="button"
            onClick={() => handleRoleSwitch("customer")}
            className={`flex-1 py-3 px-4 font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
              role === "customer"
                ? "bg-white text-black border-2 border-black shadow"
                : "text-white hover:text-yellow-400"
            }`}
          >
            <ShoppingBag size={18} />
            Customer Login
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch("admin")}
            className={`flex-1 py-3 px-4 font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
              role === "admin"
                ? "bg-yellow-400 text-black border-2 border-black shadow"
                : "text-white hover:text-yellow-400"
            }`}
          >
            <ShieldCheck size={18} />
            Admin Portal Login
          </button>
        </div>

        {/* Card Body */}
        <div className={`bg-white border-4 border-black p-8 shadow-2xl relative ${role === "admin" ? "ring-4 ring-yellow-400/50" : ""}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 flex items-center justify-center mx-auto mb-4 border-4 border-black shadow-md ${
              role === "admin" ? "bg-yellow-400 text-black" : "bg-black text-white"
            }`}>
              {role === "admin" ? <ShieldCheck size={44} /> : <User size={40} />}
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-1">
              {role === "admin" ? "Admin Security Portal" : (isLogin ? "Customer Sign In" : "Create Account")}
            </h1>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
              {role === "admin"
                ? "Access sales analytics, stock controls & customer order reports"
                : (isLogin ? "Sign in to access your profile & school uniform orders" : "Register to start ordering school uniforms")}
            </p>
          </div>

          {/* Admin Preset Banner */}
          {role === "admin" && (
            <div className="bg-yellow-50 border-2 border-yellow-500 p-3.5 mb-6 text-xs text-black font-semibold flex items-start gap-3">
              <Key className="text-yellow-700 shrink-0 mt-0.5" size={18} />
              <div>
                <span className="font-black uppercase text-yellow-900 block">Demo Admin Credentials Pre-Loaded:</span>
                <p className="text-yellow-800 text-[11px]">Email: <b>admin@khajadresses.com</b> | Password: <b>admin123</b></p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {message.text && (
              <div className={`p-4 border-2 font-bold text-xs ${message.type === 'success' ? 'border-green-600 bg-green-50 text-green-700' : 'border-red-600 bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            {!isLogin && role === "customer" && (
              <div>
                <label className="block mb-1 text-xs uppercase font-black text-gray-700">Full Name</label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    disabled={loading}
                    className="w-full border-2 border-black pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black font-medium disabled:bg-gray-100"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1 text-xs uppercase font-black text-gray-700">
                {role === "admin" ? "Admin Email Address" : "Email Address"}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full border-2 border-black pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black font-medium disabled:bg-gray-100"
                  placeholder={role === "admin" ? "admin@khajadresses.com" : "you@example.com"}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs uppercase font-black text-gray-700">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full border-2 border-black pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-black font-medium disabled:bg-gray-100"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-black uppercase text-xs tracking-wider border-2 border-black transition-all flex items-center justify-center gap-2 ${
                role === "admin" 
                  ? "bg-yellow-400 text-black hover:bg-black hover:text-white" 
                  : "bg-black text-white hover:bg-white hover:text-black"
              } disabled:bg-gray-400`}
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {role === "admin" 
                ? "Authenticate as Administrator" 
                : (isLogin ? "Sign In to Store" : "Create Customer Account")}
            </button>
          </form>

          {/* Toggle for registration (Customer only) */}
          {role === "customer" && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                {isLogin ? "Don't have a customer account? " : "Already registered? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-black font-bold uppercase hover:underline text-xs ml-1"
                >
                  {isLogin ? "Register Now" : "Sign In"}
                </button>
              </p>
            </div>
          )}

          {/* Divider */}
          {role === "customer" && (
            <>
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold">
                  <span className="bg-white px-3 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSocialLogin("Google")}
                  className="border-2 border-black py-2.5 text-xs font-black uppercase hover:bg-gray-100 transition-colors"
                >
                  Google
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSocialLogin("Facebook")}
                  className="border-2 border-black py-2.5 text-xs font-black uppercase hover:bg-gray-100 transition-colors"
                >
                  Facebook
                </button>
              </div>
            </>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs font-bold uppercase text-gray-600 hover:text-black hover:underline">
            ← Back to Customer Home
          </Link>
        </div>
      </div>
    </div>
  );
}

