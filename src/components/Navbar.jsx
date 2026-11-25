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
    { href: '#location', labelEn: 'Demo Hub', labelMr: 'पिकअप व संपर्क' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#DDE6DA] bg-[#F6F8F3]/95 backdrop-blur-md">
      {/* Top announcement bar */}
      <div className="bg-[#0E2A1C] px-3 py-1.5 text-center text-[11px] font-medium text-emerald-50 sm:px-4 sm:text-xs">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5">
          <span className="rounded-full bg-[#F59E0B] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-[#0E2A1C] uppercase">
            {BUSINESS_INFO.demoBadge}
          </span>
          <span>
            {lang === 'en'
              ? 'Interactive Storefront Preview • Sample Data Only'
              : 'इंटरॲक्टिव्ह डेमो वेबसाइट • नमुना माहिती'}
          </span>
          <span className="hidden text-emerald-400 sm:inline">•</span>
          <span className="hidden sm:inline text-emerald-100/90">
            {lang === 'en'
              ? 'Free Delivery: Central Zone > ₹199 | East Metro > ₹299'
              : 'मोफत डिलिव्हरी: सेंट्रल झोन > ₹१९९ | ईस्ट मेट्रो > ₹२९९'}
          </span>
        </span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1.5 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        {/* Brand */}
        <a href="#top" className="group flex min-w-0 items-center gap-1.5 sm:gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#146C3B] to-[#0E4A28] text-white shadow-sm transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
            <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display truncate text-base font-bold tracking-tight text-[#10241A] sm:text-xl">
                {BUSINESS_INFO.brandName}
              </span>
              <span className="hidden rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-[#146C3B] uppercase min-[360px]:inline-block">
                {BUSINESS_INFO.demoBadge}
              </span>
            </div>
            <p className="hidden truncate text-[9px] font-semibold tracking-wide text-[#4D6857] uppercase min-[400px]:block sm:text-[10px]">
              {BUSINESS_INFO.parentCompany}
            </p>
          </div>
        </a>

        {/* Desktop Navigation links */}
        <nav className="hidden items-center gap-5 whitespace-nowrap text-sm font-semibold text-[#244232] lg:flex xl:gap-7">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-[#146C3B]">
              {lang === 'en' ? item.labelEn : item.labelMr}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1 whitespace-nowrap sm:gap-2.5">
          {/* Language Switch */}
          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-[#CFDACA] bg-white px-2 py-1 text-[11px] font-semibold text-[#10241A] shadow-xs transition hover:border-[#146C3B] hover:text-[#146C3B] sm:min-h-[38px] sm:px-3 sm:py-1.5 sm:text-xs"
            title="Switch between English and Marathi"
          >
            <Globe className="h-3.5 w-3.5 text-[#146C3B]" />
            <span>{lang === 'en' ? 'मराठी' : 'EN'}</span>
          </button>

          {/* Owner Admin Demo (tablet/desktop) */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="hidden min-h-[38px] items-center gap-1.5 rounded-full border border-[#CFDACA] bg-[#ECF1E9] px-3 py-1.5 text-xs font-semibold text-[#244232] transition hover:border-[#146C3B] hover:bg-white md:inline-flex"
            title="Preview Owner Admin & Daily Batch Database Demo"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#146C3B]" />
            <span>{lang === 'en' ? 'Owner Demo' : 'ओनर डेमो'}</span>
          </button>

          {/* Cart CTA */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-full bg-[#146C3B] px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0E522C] active:scale-[0.98] sm:min-h-[38px] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            aria-label="Open basket"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span className="hidden min-[380px]:inline">
              {lang === 'en' ? 'Basket' : 'बॅग'}
            </span>
            {cartCount > 0 && (
              <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#F59E0B] px-1.5 py-0.5 text-[11px] font-extrabold text-[#10241A] sm:px-2 sm:text-xs">
                {cartCount}
                <span className="hidden sm:inline">&nbsp;• ₹{cartSubtotal}</span>
              </span>
            )}
          </button>

          {/* Mobile Drawer Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#CFDACA] bg-white text-[#10241A] transition hover:border-[#146C3B] lg:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Slide-down Nav */}
      {mobileMenuOpen && (
        <div className="border-t border-[#DDE6DA] bg-white px-4 py-3 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-semibold text-[#10241A] hover:bg-[#F6F8F3]"
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
              className="mt-1 flex min-h-[44px] items-center gap-2 rounded-xl bg-[#ECF1E9] px-3 text-left text-sm font-semibold text-[#146C3B]"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{lang === 'en' ? 'Owner Admin & Demo Panel' : 'ओनर ॲडमिन डेमो पहा'}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
