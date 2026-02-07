"use client";
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  Flower2, Sparkles, Cookie, ShoppingCart, 
  ArrowRight, ShoppingBag, X, MapPin, Truck, Plus, Minus, Trash2 
} from 'lucide-react';


interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'envio' | 'retiro'>('retiro');
  const [mounted, setMounted] = useState(false);

  // 1. Manejo de Hidratación y Persistencia
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('boutique_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error cargando carrito", e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('boutique_cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  // 2. Escucha de Firestore en tiempo real
  useEffect(() => {
    const q = activeCategory === 'todos' 
      ? query(collection(db, "products"))
      : query(collection(db, "products"), where("category", "==", activeCategory));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }, (error) => {
      console.error("Error en Firestore:", error);
    });

    return () => unsubscribe();
  }, [activeCategory]);

  // 3. Funciones del Carrito
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 4. WhatsApp Checkout
  const handleCheckout = () => {
    const phone = "54911XXXXXXXX"; // Cambia por tu número real
    let message = `*Nueva Orden - Boutique Sentidos*\n`;
    message += `--------------------------\n`;
    cart.forEach((item) => {
      message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `--------------------------\n`;
    message += `*Total:* $${total.toLocaleString()}\n`;
    message += `*Entrega:* ${deliveryType === 'envio' ? '🚚 Domicilio' : '🏪 Retiro en Salón'}\n\n`;
    message += `_Por favor, confírmenme para coordinar el pago._`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* NAVBAR */}
      <nav className="border-b border-stone-200 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif font-bold tracking-tight text-stone-900 leading-tight">
              BOUTIQUE <span className="text-amber-700">SENTIDOS</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-medium">Arte • Aroma • Sabor</p>
          </div>
          
          <button onClick={() => setIsCartOpen(true)} className="p-3 hover:bg-amber-50 rounded-full transition-all relative group">
            <ShoppingCart size={24} className="text-stone-700 group-hover:text-amber-700" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-amber-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-in fade-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* FILTROS */}
      <section className="px-6 py-12 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-8 leading-tight">Un deleite para tus sentidos</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { id: 'todos', name: 'Todo', icon: <ShoppingBag size={18} /> },
            { id: 'flores', name: 'Flores', icon: <Flower2 size={18} /> },
            { id: 'perfumes', name: 'Perfumes', icon: <Sparkles size={18} /> },
            { id: 'dulces', name: 'Dulces', icon: <Cookie size={18} /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${
                activeCategory === cat.id ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* GRID PRODUCTOS */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-[2.5rem] p-5 border border-stone-100 hover:shadow-2xl transition-all duration-500">
              <div className="aspect-square bg-stone-50 rounded-[2rem] mb-6 overflow-hidden relative border border-stone-50 flex items-center justify-center">
                 <span className="text-5xl opacity-40 group-hover:scale-125 transition-transform duration-700">
                    {product.category === 'flores' ? '🌸' : product.category === 'perfumes' ? '✨' : '🍬'}
                 </span>
              </div>
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif text-stone-800">{product.name}</h3>
                  <span className="text-lg font-light text-amber-800">${product.price.toLocaleString()}</span>
                </div>
                <p className="text-stone-400 text-sm line-clamp-2 mb-6 h-10">{product.description}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-stone-900 text-white py-4 rounded-2xl hover:bg-amber-700 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  Agregar al carrito <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DRAWER DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
              <h2 className="text-2xl font-serif text-stone-800">Tu Pedido</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-900">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-stone-200">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 italic">
                  <ShoppingBag size={48} className="mb-4 opacity-10" />
                  <p>El carrito está vacío</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="bg-stone-50 p-4 rounded-3xl border border-stone-100 space-y-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-stone-800">{item.name}</p>
                        <p className="text-[10px] text-amber-700 font-bold tracking-widest uppercase">{item.category}</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-2 py-1 shadow-inner">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-amber-700 transition-colors"><Minus size={14}/></button>
                        <span className="w-4 text-center font-medium text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-amber-700 transition-colors"><Plus size={14}/></button>
                      </div>
                      <p className="font-serif font-bold text-stone-900">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-stone-200 pt-6 mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 rounded-2xl">
                  <button onClick={() => setDeliveryType('retiro')} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${deliveryType === 'retiro' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}><MapPin size={14} /> RETIRO</button>
                  <button onClick={() => setDeliveryType('envio')} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${deliveryType === 'envio' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}><Truck size={14} /> ENVÍO</button>
                </div>

                <div className="flex justify-between text-2xl font-serif px-2">
                  <span>Total</span>
                  <span className="text-amber-800 font-bold">${total.toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-stone-900 text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-amber-700 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                  Confirmar por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
} 