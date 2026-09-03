import { Outlet, useLocation, useNavigate } from "react-router";
import { Menu, X, ShoppingBag, User, LogOut, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { AuthModal } from "./modals/AuthModal";
import { CartDrawer } from "./drawers/CartDrawer";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email?: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const loadUser = () => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch (e) {
        console.error(e);
      }
    } else {
      setCurrentUser(null);
    }
  };

  const updateCartCount = () => {
    const cartJson = localStorage.getItem("cart");
    if (cartJson) {
      try {
        const cart = JSON.parse(cartJson);
        if (Array.isArray(cart)) {
          const count = cart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
          setCartCount(count);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setCartCount(0);
  };

  useEffect(() => {
    loadUser();
    updateCartCount();

    const handleOpenCart = () => setIsCartDrawerOpen(true);
    const handleOpenAuth = () => setIsAuthModalOpen(true);

    window.addEventListener("storage", loadUser);
    window.addEventListener("userUpdated", loadUser);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("openCartDrawer", handleOpenCart);
    window.addEventListener("openAuthModal", handleOpenAuth);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userUpdated", loadUser);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("openCartDrawer", handleOpenCart);
      window.removeEventListener("openAuthModal", handleOpenAuth);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    window.dispatchEvent(new Event("userUpdated"));
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Dynamic Header */}
      <header className="bg-black text-white sticky top-0 z-50 border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & SPA Badge */}
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black text-xl border-2 border-black">
                K
              </div>
              <div>
                <span className="text-xl font-black tracking-wider block leading-none">KAJA DRESSES</span>
                <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={10} /> Official Store
                </span>
              </div>
            </button>

            {/* Desktop Navigation with Smooth Scroll / Section Triggers */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-wider">
              <button
                onClick={() => scrollToSection("hero")}
                className="hover:text-yellow-400 transition-colors py-1"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("uniforms")}
                className="hover:text-yellow-400 transition-colors py-1"
              >
                Uniforms
              </button>
              <button
                onClick={() => scrollToSection("search")}
                className="hover:text-yellow-400 transition-colors py-1"
              >
                Search
              </button>
              <button
                onClick={() => scrollToSection("feedback")}
                className="hover:text-yellow-400 transition-colors py-1"
              >
                Feedback
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-yellow-400 transition-colors py-1"
              >
                Contact
              </button>

              {/* Dynamic Cart Side-Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative bg-white text-black px-4 py-2 border-2 border-white hover:bg-yellow-400 hover:border-yellow-400 transition-all flex items-center gap-2 font-black text-xs"
              >
                <ShoppingBag size={16} />
                <span>Cart</span>
                <span className="bg-black text-white px-2 py-0.5 text-[10px] rounded-full font-black">
                  {cartCount}
                </span>
              </button>

              {/* User Profile or Auth Modal Trigger */}
              {currentUser ? (
                <div className="flex items-center gap-3 border-l border-gray-800 pl-4">
                  <span className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                    <User size={16} className="text-yellow-400" />
                    {currentUser.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs flex items-center gap-1 font-bold"
                    title="Logout"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="border-2 border-white px-4 py-2 text-xs font-black uppercase hover:bg-white hover:text-black transition-all flex items-center gap-1.5"
                >
                  <User size={16} />
                  Login / Register
                </button>
              )}
            </nav>

            {/* Mobile Actions & Hamburger */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2 bg-white text-black border border-white flex items-center gap-1 text-xs font-bold"
              >
                <ShoppingBag size={18} />
                <span className="bg-black text-white px-1.5 py-0.5 text-[9px] font-black rounded-full">
                  {cartCount}
                </span>
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 border border-gray-700 hover:bg-gray-900 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-800 space-y-3 font-bold text-sm uppercase">
              <button
                onClick={() => scrollToSection("hero")}
                className="block w-full text-left py-2 hover:text-yellow-400"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("uniforms")}
                className="block w-full text-left py-2 hover:text-yellow-400"
              >
                Uniforms Collection
              </button>
              <button
                onClick={() => scrollToSection("search")}
                className="block w-full text-left py-2 hover:text-yellow-400"
              >
                Search Schools
              </button>
              <button
                onClick={() => scrollToSection("feedback")}
                className="block w-full text-left py-2 hover:text-yellow-400"
              >
                Customer Feedback
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left py-2 hover:text-yellow-400"
              >
                Contact Us
              </button>

              <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                {currentUser ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-yellow-400 font-bold flex items-center gap-2">
                      <User size={16} /> {currentUser.name}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="px-3 py-1.5 text-xs text-red-500 border border-red-500 uppercase font-bold"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full bg-white text-black py-2 text-xs font-black uppercase text-center border-2 border-white"
                  >
                    Login / Register
                  </button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main SPA View */}
      <main className="flex-1">
        <Outlet context={{ openAuth: () => setIsAuthModalOpen(true), openCart: () => setIsCartDrawerOpen(true) }} />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t-4 border-yellow-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider mb-2">KAJA DRESSES</h3>
              <p className="text-xs text-yellow-400 font-bold uppercase mb-4">Quality School Uniforms & Accessories</p>
              <p className="text-gray-400 text-sm">
                Your trusted partner for quality school uniforms since 2010. Fast, reliable, and premium service.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase mb-4 text-white border-b border-gray-800 pb-2">Quick Navigation</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <button onClick={() => scrollToSection("uniforms")} className="text-left hover:text-white transition-colors">
                  Uniforms Collection
                </button>
                <button onClick={() => scrollToSection("search")} className="text-left hover:text-white transition-colors">
                  Search Schools
                </button>
                <button onClick={() => scrollToSection("feedback")} className="text-left hover:text-white transition-colors">
                  Customer Reviews
                </button>
                <button onClick={() => scrollToSection("contact")} className="text-left hover:text-white transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase mb-4 text-white border-b border-gray-800 pb-2">Store Information</h4>
              <div className="text-gray-400 text-sm space-y-1">
                <p>Email: info@kajadresses.com</p>
                <p>Phone: +91 1234567890</p>
                <p>Address: 257F, Opposite to Ananda & Ananda, Kamarajar Road, Madurai - 9.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-400">
            <p>&copy; 2026 Kaja Dresses. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Global Dynamic Overlays */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onOpenAuth={() => {
          setIsCartDrawerOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}
