import { MapPin, Truck } from 'lucide-react';
import { calculateDeliverySummary, DELIVERY_ZONES } from '../data/deliveryZones';
import { BUSINESS_INFO } from '../data/translations';

export default function DeliveryZoneBar({ lang, selectedZoneId, onSelectZone, subtotal }) {
  const summary = calculateDeliverySummary(selectedZoneId, subtotal);

  return (
    <section className="border-b border-[#DDE6DA] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#146C3B] uppercase">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>
                {lang === 'en' ? 'Select Demo Delivery Zone' : 'डेमो डिलिव्हरी परिसर निवडा'}
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {DELIVERY_ZONES.map((zone) => {
                const active = zone.id === selectedZoneId;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => onSelectZone(zone.id)}
                    className={`flex min-h-[48px] flex-col items-start justify-center rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition sm:min-h-[38px] sm:flex-row sm:items-center sm:rounded-full sm:px-3.5 sm:py-1.5 ${
                      active
                        ? 'border-[#146C3B] bg-[#146C3B] text-white shadow-xs'
                        : 'border-[#CFDACA] bg-[#F6F8F3] text-[#244232] hover:border-[#146C3B]'
                    }`}
                  >
                    <span className="leading-snug">{lang === 'en' ? zone.nameEn : zone.nameMr}</span>
                    <span
                      className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] sm:mt-0 sm:ml-1.5 ${
                        active ? 'bg-white/20 text-white' : 'bg-emerald-100 text-[#146C3B]'
                      }`}
                    >
                      {zone.shortBadge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Delivery Progress */}
          <div className="rounded-2xl border border-[#DDE6DA] bg-[#F6F8F3] px-4 py-3 lg:min-w-[340px]">
            <div className="flex items-center justify-between gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-[#10241A]">
                <Truck className="h-4 w-4 shrink-0 text-[#146C3B]" />
                <span>{lang === 'en' ? summary.zone.ruleEn : summary.zone.ruleMr}</span>
              </span>
            </div>

            {selectedZoneId === 'pickup' ? (
              <p className="mt-1.5 text-xs font-medium text-emerald-700">
                {lang === 'en'
                  ? `✓ Free self-pickup at ${BUSINESS_INFO.pickupHubShort} (${BUSINESS_INFO.pickupTiming})`
                  : `✓ ${BUSINESS_INFO.pickupHubShort} येथे मोफत पिकअप (सायं. ५ ते रात्री ९)`}
              </p>
            ) : selectedZoneId === 'outer-city' ? (
              <p className="mt-1.5 text-xs font-medium text-[#3E5849]">
                {summary.meetsMinOrder ? (
                  <span className="text-emerald-700">
                    ✓{' '}
                    {lang === 'en'
                      ? 'Minimum order ₹399 met (+₹50 delivery applies)'
                      : 'किमान ₹३९९ ऑर्डर पूर्ण (+₹५० डिलिव्हरी)'}
                  </span>
                ) : (
                  <span>
                    {lang === 'en'
                      ? `Add ₹${summary.amountForMin} more to reach ₹399 minimum order.`
                      : `₹३९९ किमान ऑर्डरसाठी आणखी ₹${summary.amountForMin} जोडा.`}
                  </span>
                )}
              </p>
            ) : (
              <div className="mt-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#DDE6DA]">
                  <div
                    className="h-full rounded-full bg-[#146C3B] transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((subtotal / summary.zone.freeAbove) * 100))}%`,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-xs font-medium text-[#3E5849]">
                  {summary.isFree && subtotal > 0 ? (
                    <span className="text-emerald-700">
                      ✓ {lang === 'en' ? 'Unlocked FREE home delivery!' : 'मोफत घरपोच डिलिव्हरी मिळाली!'}
                    </span>
                  ) : (
                    <span>
                      {lang === 'en'
                        ? `Add ₹${summary.amountForFree} more for FREE delivery (otherwise ₹${summary.zone.baseDeliveryFee} fee)`
                        : `मोफत डिलिव्हरीसाठी आणखी ₹${summary.amountForFree} चे पदार्थ जोडा`}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
