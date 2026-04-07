import { useState } from "react";
import { Link } from "react-router";
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react";

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app, this would call an API
    alert(isLogin ? "Login successful!" : "Registration successful!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white border-2 border-black p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={40} />
            </div>
            <h1 className="text-3xl mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? "Sign in to access your account"
                : "Register to start shopping"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block mb-2 text-sm">Full Name</label>
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
                    className="w-full border-2 border-black pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm">Email Address</label>
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
                  className="w-full border-2 border-black pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm">Password</label>
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
                  className="w-full border-2 border-black pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-black"
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

            {isLogin && (
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-black hover:underline"
              >
                {isLogin ? "Register" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="border-2 border-black py-3 hover:bg-gray-50 transition-colors">
              Google
            </button>
            <button className="border-2 border-black py-3 hover:bg-gray-50 transition-colors">
              Facebook
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-black hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
