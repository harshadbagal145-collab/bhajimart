import { ArrowRight, CalendarClock, CheckCircle2, Droplets, Scissors, Sparkles, Utensils } from 'lucide-react';
import { formatReadableDate, getTomorrowDateISO } from '../data/deliveryZones';
import { UI_COPY } from '../data/translations';

export default function HeroSection({ lang }) {
  const copy = UI_COPY[lang];
  const tomorrowLabel = formatReadableDate(getTomorrowDateISO());

  const pillarIcons = [Sparkles, Droplets, Scissors, Utensils];

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[#DDE6DA] bg-gradient-to-br from-[#EEF4EB] via-[#F6F8F3] to-[#FAF8F1]"
    >
      {/* Subtle decorative radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Copy */}
          <div className="min-w-0 lg:col-span-6">
            <div className="mb-3.5 inline-flex max-w-full items-center gap-2 rounded-2xl border border-emerald-200 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#146C3B] shadow-xs sm:mb-4 sm:rounded-full sm:px-3.5 sm:text-xs">
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              <span className="leading-snug">
                {copy.orderPriorPill} ({tomorrowLabel})
              </span>
            </div>

            <p className="mb-1.5 text-[11px] font-bold tracking-widest text-[#4D6857] uppercase sm:mb-2 sm:text-xs">
              {copy.heroEyebrow}
            </p>

            <h1 className="font-display text-[30px] leading-[1.13] font-bold tracking-tight text-[#10241A] sm:text-5xl lg:text-[54px]">
              {copy.heroTitle}
            </h1>

            <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[#3E5849] sm:mt-4 sm:text-lg">
              {copy.heroSubtitle}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
              <a
                href="#menu"
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#146C3B] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-950/15 transition hover:bg-[#0E522C] sm:w-auto"
              >
                <span>{copy.browseMenu}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-[#C8D5C3] bg-white px-5 py-3 text-sm font-semibold text-[#10241A] transition hover:border-[#146C3B] hover:text-[#146C3B] sm:w-auto"
              >
                <span>{copy.howItWorksBtn}</span>
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#3E5849] sm:mt-7 sm:gap-x-5">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#146C3B]" />
                {lang === 'en' ? 'Zero Cold-Storage Stock' : 'जुना साठा नाही'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#146C3B]" />
                {lang === 'en' ? 'Food-Grade Demo Packing' : 'स्वच्छ व सुरक्षित पॅकिंग'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#146C3B]" />
                {lang === 'en' ? 'EN / मराठी Bilingual' : 'इंग्रजी आणि मराठी भाषा'}
              </span>
            </div>
          </div>

          {/* Right Editorial Image */}
          <div className="relative min-w-0 lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-[#D4DFD0] bg-white p-1.5 shadow-xl shadow-emerald-950/10 sm:rounded-3xl sm:p-2">
              <img
                src="/images/hero-sabzimate.jpg"
                alt="Freshly washed, peeled and pre-cut vegetables demo showcase"
                className="aspect-[16/11] w-full rounded-xl object-cover sm:aspect-[4/3] sm:rounded-2xl"
              />
              {/* Freshness promise strip: attached below image on mobile so photo isn't covered; floating overlay on sm+ */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-[#DDE6DA] bg-[#F6F8F3] px-3.5 py-2.5 sm:mt-0 sm:absolute sm:bottom-5 sm:left-5 sm:right-5 sm:rounded-2xl sm:border-white/70 sm:bg-white/95 sm:px-4 sm:py-3 sm:backdrop-blur-md sm:shadow-lg">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-[#146C3B] uppercase sm:text-[11px]">
                    {lang === 'en' ? 'Morning Harvest Workflow' : 'सकाळची ताजी प्रक्रिया'}
                  </p>
                  <p className="text-xs font-bold text-[#10241A] sm:text-sm">
                    {lang === 'en'
                      ? '5 AM Sourced → Fresh Cut → 4–5 PM Delivery'
                      : 'सकाळी ५ खरेदी → ताजी कटिंग → सायं. ४–५ डिलिव्हरी'}
                  </p>
                </div>
                <span className="rounded-full bg-[#F59E0B] px-2.5 py-1 text-[11px] font-extrabold text-[#10241A] sm:px-3 sm:text-xs">
                  {lang === 'en' ? 'Save 45 mins/day' : 'रोज ४५ मिनिटे वाचवा'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Value Pillars */}
        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {copy.pillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx];
            return (
              <div
                key={pillar.title}
                className="flex items-start gap-3 rounded-2xl border border-[#DDE6DA] bg-white/95 p-3.5 shadow-xs transition hover:border-[#B6CBB2] sm:gap-3.5 sm:p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#146C3B] sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#10241A]">{pillar.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#4D6857]">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
