import Link from 'next/link';
import { ShoppingCart, Flower2, Sparkles, Cookie } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-serif font-bold text-boutique-dark">
            Boutique <span className="text-boutique-gold">Sentidos</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/?cat=flores" className="flex items-center gap-2 hover:text-boutique-gold transition">
              <Flower2 size={18} /> Flores
            </Link>
            <Link href="/?cat=perfumes" className="flex items-center gap-2 hover:text-boutique-gold transition">
              <Sparkles size={18} /> Perfumes
            </Link>
            <Link href="/?cat=dulces" className="flex items-center gap-2 hover:text-boutique-gold transition">
              <Cookie size={18} /> Dulces
            </Link>
          </div>

          <button className="relative p-2 hover:bg-gray-50 rounded-full transition">
            <ShoppingCart className="text-gray-700" />
            <span className="absolute top-0 right-0 bg-boutique-gold text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}