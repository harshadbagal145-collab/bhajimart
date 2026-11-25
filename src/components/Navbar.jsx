import { useState } from 'react';
import { Globe, Leaf, Menu, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/translations';

export default function Navbar({
  lang,
  onToggleLang,
  cartCount,
  cartSubtotal,
  onOpenCart,
  onOpenAdmin,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '#menu', labelEn: '31-Item Menu', labelMr: 'मेनू (३१ भाज्या)' },
    { href: '#mixes', labelEn: 'Ready Mixes', labelMr: 'तयार मिक्स' },
    { href: '#how-it-works', labelEn: 'How It Works', labelMr: 'प्रक्रिया' },
    { href: '#location', labelEn: 'Seawoods Pickup', labelMr: 'पिकअप व संपर्क' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#E3DEC9] bg-[#FAF8F2]/95 backdrop-blur-md">
      {/* Top announcement bar */}
      <div className="bg-[#1B5E32] px-3 py-1.5 text-center text-[11px] font-medium text-white sm:px-4 sm:text-xs">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
          <span>
            🌿{' '}
            {lang === 'en'
              ? 'Order 1 Day Prior for Morning-Fresh Harvest'
              : 'ताज्या भाज्यांसाठी १ दिवस आधी ऑर्डर करा'}
          </span>
          <span className="hidden text-emerald-200 sm:inline">•</span>
          <span className="hidden sm:inline">
            {lang === 'en'
              ? 'Free Delivery: Nerul > ₹199 | CBD Belapur & Ulwe > ₹299'
              : 'मोफत डिलिव्हरी: नेरूळ > ₹१९९ | बेलापूर व उलवे > ₹२९९'}
          </span>
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        {/* Brand */}
        <a href="#top" className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1B5E32] text-white shadow-sm transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
            <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-display whitespace-nowrap text-base font-bold tracking-tight text-[#14281D] sm:text-xl">
                {BUSINESS_INFO.brandName}
              </span>
            </div>
            <p className="hidden truncate text-[9px] font-medium tracking-wide text-[#526B5C] uppercase min-[400px]:block sm:text-[10px]">
              {BUSINESS_INFO.parentCompany}
            </p>
          </div>
        </a>

        {/* Desktop Navigation links */}
        <nav className="hidden items-center gap-5 whitespace-nowrap text-sm font-semibold text-[#2E4738] lg:flex xl:gap-7">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-[#1B5E32]">
              {lang === 'en' ? item.labelEn : item.labelMr}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap sm:gap-2.5">
          {/* Language Switch */}
          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex min-h-[38px] items-center gap-1 rounded-full border border-[#D4CEB8] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#14281D] shadow-xs transition hover:border-[#1B5E32] hover:text-[#1B5E32] sm:px-3"
            title="Switch between English and Marathi"
          >
            <Globe className="h-3.5 w-3.5 text-[#1B5E32]" />
            <span>{lang === 'en' ? 'मराठी' : 'EN'}</span>
          </button>

          {/* Owner Admin Demo (tablet/desktop) */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="hidden min-h-[38px] items-center gap-1.5 rounded-full border border-[#D4CEB8] bg-[#F3EFE2] px-3 py-1.5 text-xs font-semibold text-[#2E4738] transition hover:border-[#1B5E32] hover:bg-white md:inline-flex"
            title="Preview Owner Admin & Daily Batch Database Demo"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#1B5E32]" />
            <span>{lang === 'en' ? 'Owner Demo' : 'ओनर डेमो'}</span>
          </button>

          {/* Cart CTA */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative inline-flex min-h-[38px] items-center gap-1.5 whitespace-nowrap rounded-full bg-[#1B5E32] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#154A27] active:scale-[0.98] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            aria-label="Open basket"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span className="hidden xs:inline sm:inline">
              {lang === 'en' ? 'Basket' : 'बॅग'}
            </span>
            {cartCount > 0 && (
              <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#E8A317] px-1.5 py-0.5 text-[11px] font-bold text-[#14281D] sm:px-2 sm:text-xs">
                {cartCount}
                <span className="hidden sm:inline">&nbsp;• ₹{cartSubtotal}</span>
              </span>
            )}
          </button>

          {/* Mobile Drawer Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D4CEB8] bg-white text-[#14281D] transition hover:border-[#1B5E32] lg:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Slide-down Nav */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E3DEC9] bg-white px-4 py-3 shadow-md lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-semibold text-[#14281D] hover:bg-[#FAF8F2]"
              >
                {lang === 'en' ? item.labelEn : item.labelMr}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="mt-1 flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F3EFE2] px-3 text-left text-sm font-semibold text-[#1B5E32]"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{lang === 'en' ? 'Owner Admin & Database Demo' : 'ओनर ॲडमिन डेमो पहा'}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
