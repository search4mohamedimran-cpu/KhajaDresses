import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, Search as SearchIcon, User } from "lucide-react";
import { useState } from "react";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/uniforms", label: "Uniforms" },
    { path: "/search", label: "Search" },
    { path: "/feedback", label: "Feedback" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl tracking-wider hover:opacity-80 transition-opacity">
              KAJA DRESSES
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`hover:text-gray-300 transition-colors ${
                    isActive(link.path) ? "border-b-2 border-white pb-1" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="flex items-center gap-2 border border-white px-4 py-2 hover:bg-white hover:text-black transition-all"
              >
                <User size={18} />
                Login
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`hover:text-gray-300 transition-colors py-2 ${
                      isActive(link.path) ? "border-l-4 border-white pl-4" : "pl-0"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 border border-white px-4 py-2 hover:bg-white hover:text-black transition-all w-fit"
                >
                  <User size={18} />
                  Login
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl mb-4 tracking-wider">KAJA DRESSES</h3>
              <p className="text-gray-400">
                Your trusted partner for quality school uniforms since 2010.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2 text-gray-400">
                <Link to="/uniforms" className="hover:text-white transition-colors">
                  Uniforms Collection
                </Link>
                <Link to="/search" className="hover:text-white transition-colors">
                  Search Schools
                </Link>
                <Link to="/feedback" className="hover:text-white transition-colors">
                  Feedback
                </Link>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Contact</h4>
              <div className="text-gray-400 flex flex-col gap-2">
                <p>Email: info@kajadresses.com</p>
                <p>Phone: +1 234 567 8900</p>
                <p>Address: 123 Fashion Street, City</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2026 Kaja Dresses. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
