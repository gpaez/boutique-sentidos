"use client";
import Link from 'next/link';
import { ShoppingCart, Flower2, Sparkles, Cookie } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">
              BOUTIQUE <span className="text-amber-700">SENTIDOS</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-medium leading-none">
              Arte • Aroma • Sabor
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/?cat=flores" className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-700 transition">
              <Flower2 size={18} /> Flores
            </Link>
            <Link href="/?cat=perfumes" className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-700 transition">
              <Sparkles size={18} /> Perfumes
            </Link>
            <Link href="/?cat=dulces" className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-700 transition">
              <Cookie size={18} /> Dulces
            </Link>
          </div>

          <button className="relative p-2 hover:bg-amber-50 rounded-full transition group">
            <ShoppingCart className="text-stone-700 group-hover:text-amber-700" />
            <span className="absolute top-0 right-0 bg-amber-700 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}