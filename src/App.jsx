import { useEffect, useMemo, useState } from 'react';
import AdminDemoPanel from './components/AdminDemoPanel';
import CartDrawer from './components/CartDrawer';
import CatalogSection from './components/CatalogSection';
import CombosShowcase from './components/CombosShowcase';
import DeliveryZoneBar from './components/DeliveryZoneBar';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import Navbar from './components/Navbar';
import { INITIAL_CATALOG } from './data/catalog';
import { getTomorrowDateISO } from './data/deliveryZones';
import { BUSINESS_INFO } from './data/translations';

const CURRENT_YEAR = new Date().getFullYear();
const STORAGE_KEY = 'bhajicart_demo_orders_v1';

const SEED_DEMO_ORDERS = [
  {
    id: 'BC-1001',
    createdAt: '08:15 PM',
    customerName: 'Demo Customer A',
    customerPhone: '90000 11111',
    zoneId: 'central-hub',
    zoneName: 'Central Zone (Sectors 1–10)',
    address: 'Sample Residency, Sector 4, Demo City',
    deliveryDate: getTomorrowDateISO(),
    slot: '4:00 PM – 5:00 PM (Home Delivery)',
    prepNote: 'Please cut bhendi medium size',
    items: [
      { id: 'bhendi', srNo: 3, nameEn: 'Bhendi (Okra)', packSize: '250gms', cutStyle: 'Medium Sabzi Cut', qty: 2, price: 40 },
      { id: 'peeled-lasun', srNo: 22, nameEn: 'Peeled Lasun (Peeled Garlic)', packSize: '100gms', cutStyle: 'Whole Peeled Cloves', qty: 1, price: 40 },
      { id: 'sambar-mix', srNo: 29, nameEn: 'Sambar Mix', packSize: '200gms', cutStyle: 'Traditional Sambar Cut', qty: 2, price: 60 },
    ],
    subtotal: 240,
    deliveryFee: 0,
    total: 240,
    status: 'Scheduled for 5 AM Purchase (Demo)',
  },
  {
    id: 'BC-1002',
    createdAt: '09:05 PM',
    customerName: 'Demo Customer B',
    customerPhone: '90000 22222',
    zoneId: 'east-metro',
    zoneName: 'Lakeview & East Metro',
    address: 'Wing B, Lakeview Demo Towers, Sample City',
    deliveryDate: getTomorrowDateISO(),
    slot: '4:00 PM – 5:00 PM (Home Delivery)',
    prepNote: '',
    items: [
      { id: 'pulav-mix', srNo: 28, nameEn: 'Pulav Mix', packSize: '200gms', cutStyle: 'Standard Pulav Cut', qty: 2, price: 50 },
      { id: 'palak', srNo: 16, nameEn: 'Palak (Spinach)', packSize: '100gms', cutStyle: 'Whole Picked Leaves', qty: 2, price: 30 },
      { id: 'grated-coconut', srNo: 27, nameEn: 'Grated Coconut', packSize: '250gms', cutStyle: 'Fine Grated', qty: 1, price: 90 },
      { id: 'flower-cauliflower', srNo: 9, nameEn: 'Flower (Cauliflower)', packSize: '250gms', cutStyle: 'Medium Florets', qty: 2, price: 35 },
    ],
    subtotal: 320,
    deliveryFee: 0,
    total: 320,
    status: 'Scheduled for 5 AM Purchase (Demo)',
  },
];

export default function App() {
  const [lang, setLang] = useState('en');
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [selectedZoneId, setSelectedZoneId] = useState('central-hub');
  const [cartMap, setCartMap] = useState({});
  const [selectedCuts, setSelectedCuts] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_DEMO_ORDERS;
    } catch {
      return SEED_DEMO_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore storage errors
    }
  }, [orders]);

  const cartItems = useMemo(() => {
    return Object.entries(cartMap)
      .filter(([, entry]) => entry.qty > 0)
      .map(([id, entry]) => {
        const liveItem = catalog.find((c) => c.id === id) || entry.item;
        return {
          item: liveItem,
          qty: entry.qty,
          cutStyle: selectedCuts[id] || liveItem.cutOptions[0],
        };
      });
  }, [cartMap, catalog, selectedCuts]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, entry) => sum + entry.qty, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0),
    [cartItems]
  );

  const handleAddItem = (item) => {
    setCartMap((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: {
          item,
          qty: (existing?.qty || 0) + 1,
        },
      };
    });
  };

  const handleUpdateQty = (itemId, nextQty) => {
    setCartMap((prev) => {
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      const existing = prev[itemId];
      if (!existing) return prev;
      return {
        ...prev,
        [itemId]: { ...existing, qty: nextQty },
      };
    });
  };

  const handleChangeCut = (itemId, cutValue) => {
    setSelectedCuts((prev) => ({ ...prev, [itemId]: cutValue }));
  };

  const handleAddAllCombos = () => {
    const mixes = catalog.filter((c) => c.category === 'mixes');
    setCartMap((prev) => {
      const next = { ...prev };
      mixes.forEach((mix) => {
        next[mix.id] = {
          item: mix,
          qty: (next[mix.id]?.qty || 0) + 1,
        };
      });
      return next;
    });
    setIsCartOpen(true);
  };

  const handleUpdatePrice = (itemId, newPrice) => {
    setCatalog((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price: newPrice } : item))
    );
  };

  const handlePlaceDemoOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleResetDemoData = () => {
    setCatalog(INITIAL_CATALOG);
    setOrders(SEED_DEMO_ORDERS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F6F8F3] text-[#10241A]">
      <Navbar
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'mr' : 'en'))}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        <HeroSection lang={lang} />

        <DeliveryZoneBar
          lang={lang}
          selectedZoneId={selectedZoneId}
          onSelectZone={setSelectedZoneId}
          subtotal={cartSubtotal}
        />

        <CombosShowcase
          lang={lang}
          catalog={catalog}
          cartMap={cartMap}
          onAddItem={handleAddItem}
          onUpdateQty={handleUpdateQty}
          onAddAllCombos={handleAddAllCombos}
        />

        <CatalogSection
          lang={lang}
          catalog={catalog}
          cartMap={cartMap}
          onAddItem={handleAddItem}
          onUpdateQty={handleUpdateQty}
          selectedCuts={selectedCuts}
          onChangeCut={handleChangeCut}
        />

        <HowItWorksSection lang={lang} />
      </main>

      {/* Footer (extra bottom padding when floating mobile bar is visible) */}
      <footer
        className={`border-t border-[#1A3B2A] bg-[#0A2015] px-4 pt-6 text-xs text-emerald-100/75 md:pb-6 ${
          cartCount > 0 ? 'pb-24' : 'pb-6'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p>
            © {CURRENT_YEAR} {BUSINESS_INFO.brandName} ({BUSINESS_INFO.parentCompany}). Interactive
            Demo Website — Sample data only.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="font-semibold text-[#F59E0B] hover:underline"
            >
              Open Owner Admin Demo
            </button>
            <span className="text-emerald-200/70">{BUSINESS_INFO.instagramHandle}</span>
          </div>
        </div>
      </footer>

      {/* Floating mobile basket bar (safe-area aware) */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 z-30 md:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex min-h-[52px] w-full items-center justify-between rounded-2xl bg-[#146C3B] px-4 py-3 text-sm font-bold text-white shadow-2xl ring-1 ring-white/20"
          >
            <span>
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in basket
            </span>
            <span className="rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-extrabold text-[#10241A]">
              View Basket • ₹{cartSubtotal} →
            </span>
          </button>
        </div>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lang={lang}
        cartItems={cartItems}
        selectedZoneId={selectedZoneId}
        onSelectZone={setSelectedZoneId}
        onUpdateQty={handleUpdateQty}
        onClearCart={() => setCartMap({})}
        onPlaceDemoOrder={handlePlaceDemoOrder}
      />

      <AdminDemoPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        catalog={catalog}
        onUpdatePrice={handleUpdatePrice}
        orders={orders}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}
