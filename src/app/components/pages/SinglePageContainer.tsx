import React, { useState } from "react";
import { Home } from "./Home";
import { Uniforms } from "./Uniforms";
import { Search } from "./Search";
import { Feedback } from "./Feedback";
import { Contact } from "./Contact";
import { ShoppingBag, Search as SearchIcon, Star, Phone, Sparkles, Layers } from "lucide-react";

interface SinglePageContainerProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
}

export function SinglePageContainer({ onOpenAuth, onOpenCart }: SinglePageContainerProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Sticky Quick-Access Control Bar for SPA Navigation */}
      <div className="sticky top-16 z-40 bg-black/95 text-white border-b border-gray-800 backdrop-blur-md px-4 py-3 shadow-md">
        <div className="container mx-auto flex items-center justify-between overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 flex-shrink-0">
            <Sparkles size={14} className="text-yellow-400" />
            <span>Navigate:</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => scrollToSection("hero")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-900 hover:bg-white hover:text-black border border-gray-700 transition-all"
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection("uniforms")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-900 hover:bg-white hover:text-black border border-gray-700 transition-all flex items-center gap-1.5"
            >
              <ShoppingBag size={12} /> Uniforms Catalog
            </button>
            <button
              onClick={() => scrollToSection("search")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-900 hover:bg-white hover:text-black border border-gray-700 transition-all flex items-center gap-1.5"
            >
              <SearchIcon size={12} /> Find School
            </button>
            <button
              onClick={() => scrollToSection("feedback")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-900 hover:bg-white hover:text-black border border-gray-700 transition-all flex items-center gap-1.5"
            >
              <Star size={12} /> Reviews
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-900 hover:bg-white hover:text-black border border-gray-700 transition-all flex items-center gap-1.5"
            >
              <Phone size={12} /> Contact Us
            </button>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onOpenCart}
              className="bg-white text-black px-3 py-1.5 text-xs font-black uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              Open Cart Drawer
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Hero & Highlights */}
      <section id="hero" className="scroll-mt-32">
        <Home />
      </section>

      <div className="h-1 bg-gradient-to-r from-black via-gray-400 to-black my-4 opacity-20" />

      {/* Section 2: Interactive Uniforms Catalog */}
      <section id="uniforms" className="scroll-mt-32">
        <div className="container mx-auto px-4 pt-8">
          <div className="bg-black text-white p-6 border-l-8 border-yellow-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
                Official Collection
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight">Complete Uniform Collection</h2>
              <p className="text-gray-400 text-xs mt-1">Select sizes, inspect stock, and add items directly to your live cart drawer.</p>
            </div>
            <button
              onClick={onOpenCart}
              className="bg-white text-black px-6 py-3 font-black uppercase text-xs hover:bg-yellow-400 transition-colors flex items-center gap-2"
            >
              <ShoppingBag size={16} /> View Cart & Checkout
            </button>
          </div>
        </div>
        <Uniforms />
      </section>

      <div className="h-1 bg-gradient-to-r from-black via-gray-400 to-black my-4 opacity-20" />

      {/* Section 3: Dynamic School Search */}
      <section id="search" className="scroll-mt-32">
        <div className="container mx-auto px-4 pt-8">
          <div className="bg-black text-white p-6 border-l-8 border-blue-500">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              Instant Live Search
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight">School Finder & Uniform Matcher</h2>
            <p className="text-gray-400 text-xs mt-1">Quickly search your school name or area to match required uniforms instantly.</p>
          </div>
        </div>
        <Search />
      </section>

      <div className="h-1 bg-gradient-to-r from-black via-gray-400 to-black my-4 opacity-20" />

      {/* Section 4: Customer Reviews */}
      <section id="feedback" className="scroll-mt-32">
        <div className="container mx-auto px-4 pt-8">
          <div className="bg-black text-white p-6 border-l-8 border-green-500">
              <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
                Customer Reviews
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight">Live Customer Reviews & Feedback</h2>
              <p className="text-gray-400 text-xs mt-1">Share your feedback and read genuine customer experiences.</p>
          </div>
        </div>
        <Feedback />
      </section>

      <div className="h-1 bg-gradient-to-r from-black via-gray-400 to-black my-4 opacity-20" />

      {/* Section 5: Contact & Location */}
      <section id="contact" className="scroll-mt-32">
        <div className="container mx-auto px-4 pt-8">
          <div className="bg-black text-white p-6 border-l-8 border-purple-500">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
              Direct Contact & Support
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight">Get in Touch With Kaja Dresses</h2>
            <p className="text-gray-400 text-xs mt-1">Have custom uniform requirements or inquiries? Send us a message.</p>
          </div>
        </div>
        <Contact />
      </section>
    </div>
  );
}
