import { useState } from 'react';
import { Clock, Info, MapPin, MessageCircle, PhoneCall } from 'lucide-react';
import { BUSINESS_INFO, UI_COPY } from '../data/translations';

function InstagramIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function HowItWorksSection({ lang }) {
  const copy = UI_COPY[lang];
  const [demoNotice, setDemoNotice] = useState('');

  return (
    <>
      {/* How It Works */}
      <section id="how-it-works" className="border-t border-[#DDE6DA] bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-widest text-[#146C3B] uppercase">
              {lang === 'en' ? '1-Day Prior Freshness Workflow' : '१ दिवस आधी ऑर्डर करण्याची पद्धत'}
            </p>
            <h2 className="font-display mt-2 text-2xl font-bold text-[#10241A] sm:text-3xl">
              {copy.howTitle}
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
            {copy.howSteps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-3xl border border-[#DDE6DA] bg-[#F6F8F3] p-6 transition hover:border-[#B6CBB2]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#146C3B] font-display text-base font-bold text-white shadow-xs">
                  {s.step}
                </span>
                <h3 className="mt-3.5 text-lg font-bold text-[#10241A]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3E5849]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Demo Contact */}
      <section id="location" className="border-t border-[#DDE6DA] bg-[#0E2A1C] py-10 text-white sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="min-w-0 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                {BUSINESS_INFO.parentCompany} • DEMO
              </span>
              <h2 className="font-display mt-3 text-2xl font-bold sm:text-4xl">
                {lang === 'en'
                  ? 'Eat Fresh, Live Healthy — Sample Storefront Hub'
                  : 'ताज्या भाज्या खा, निरोगी रहा — डेमो स्टोअरफ्रंट'}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-100/80">
                {lang === 'en'
                  ? 'All addresses, phone numbers, and handles shown below are fictional demo placeholders for presentation and testing.'
                  : 'खाली दिलेला पत्ता, फोन नंबर आणि सोशल मीडिया माहिती केवळ डेमो व चाचणीसाठी आहे.'}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-wide text-emerald-200 uppercase">
                      {lang === 'en' ? 'Demo Pickup Address' : 'डेमो पत्ता'}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {lang === 'en' ? BUSINESS_INFO.locationEn : BUSINESS_INFO.locationMr}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-wide text-emerald-200 uppercase">
                      {lang === 'en' ? 'Demo Timings' : 'डेमो वेळ'}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {lang === 'en'
                        ? `Delivery: ${BUSINESS_INFO.deliveryTiming} | Pickup: ${BUSINESS_INFO.pickupTiming}`
                        : `डिलिव्हरी: ${BUSINESS_INFO.deliveryTiming} | पिकअप: ${BUSINESS_INFO.pickupTiming}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-3xl border border-white/15 bg-white/8 p-5 backdrop-blur-xs sm:p-6">
                <h3 className="text-lg font-bold">
                  {lang === 'en' ? 'Demo Contact Channels' : 'डेमो संपर्क पर्याय'}
                </h3>
                <p className="mt-1 text-xs text-emerald-100/75">
                  {lang === 'en'
                    ? 'Placeholder buttons for client demos—no real phone numbers or external accounts are contacted.'
                    : 'ही बटणे केवळ डेमो सादरीकरणासाठी आहेत—खऱ्या नंबरवर कॉल किंवा मेसेज जाणार नाही.'}
                </p>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={() =>
                      setDemoNotice(
                        `Demo WhatsApp preview triggered for ${BUSINESS_INFO.whatsappDisplay}. Place an order from the Basket to see the full WhatsApp receipt preview!`
                      )
                    }
                    className="flex min-h-[48px] w-full items-center justify-between gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-left text-sm font-bold text-[#0F2617] transition hover:brightness-105 sm:px-5"
                  >
                    <span className="inline-flex min-w-0 items-center gap-2.5">
                      <MessageCircle className="h-5 w-5 shrink-0" />
                      <span className="truncate">WhatsApp: {BUSINESS_INFO.whatsappDisplay}</span>
                    </span>
                    <span className="shrink-0">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDemoNotice(
                        `Demo Call action: ${BUSINESS_INFO.phoneDisplay} (sample placeholder number, not a real line).`
                      )
                    }
                    className="flex min-h-[48px] w-full items-center justify-between gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/15 sm:px-5"
                  >
                    <span className="inline-flex min-w-0 items-center gap-2.5">
                      <PhoneCall className="h-4 w-4 shrink-0 text-[#F59E0B]" />
                      <span className="truncate">Call: {BUSINESS_INFO.phoneDisplay} (Demo)</span>
                    </span>
                    <span className="shrink-0">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDemoNotice(
                        `Demo Social handle: ${BUSINESS_INFO.instagramHandle} • Contact email: ${BUSINESS_INFO.demoEmail}`
                      )
                    }
                    className="flex min-h-[48px] w-full items-center justify-between gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/15 sm:px-5"
                  >
                    <span className="inline-flex min-w-0 items-center gap-2.5">
                      <InstagramIcon className="h-4 w-4 shrink-0 text-pink-300" />
                      <span className="truncate">Instagram {BUSINESS_INFO.instagramHandle}</span>
                    </span>
                    <span className="shrink-0">→</span>
                  </button>
                </div>

                {demoNotice && (
                  <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-300/30 bg-amber-400/15 p-3 text-xs leading-relaxed text-amber-100">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                    <span>{demoNotice}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
