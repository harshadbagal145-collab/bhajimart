import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import {
  calculateDeliverySummary,
  DELIVERY_ZONES,
  formatReadableDate,
  getTomorrowDateISO,
} from '../data/deliveryZones';
import { BUSINESS_INFO } from '../data/translations';

export default function CartDrawer({
  isOpen,
  onClose,
  lang,
  cartItems,
  selectedZoneId,
  onSelectZone,
  onUpdateQty,
  onClearCart,
  onPlaceDemoOrder,
}) {
  const minDate = getTomorrowDateISO();
  const [deliveryDate, setDeliveryDate] = useState(minDate);
  const [slot, setSlot] = useState(
    selectedZoneId === 'pickup' ? '5:00 PM – 9:00 PM (Seawoods Pickup)' : '4:00 PM – 5:00 PM (Home Delivery)'
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [prepNote, setPrepNote] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0);
  const summary = calculateDeliverySummary(selectedZoneId, subtotal);

  const canCheckout =
    cartItems.length > 0 &&
    summary.meetsMinOrder &&
    customerName.trim().length > 1 &&
    customerPhone.trim().length >= 10 &&
    (selectedZoneId === 'pickup' || address.trim().length > 4);

  const buildWhatsAppText = (orderId) => {
    const lines = [
      `*SabziMate Order ${orderId}*`,
      `Name: ${customerName}`,
      `Phone: ${customerPhone}`,
      `Area: ${summary.zone.nameEn}`,
      selectedZoneId === 'pickup'
        ? `Pickup: Near Seawoods Station East Entry`
        : `Address: ${address}`,
      `Batch Date: ${formatReadableDate(deliveryDate)} (${deliveryDate})`,
      `Slot: ${slot}`,
      ``,
      `*Items:*`,
      ...cartItems.map(
        (c, i) =>
          `${i + 1}. ${c.item.nameEn} (${c.item.packSize}) x${c.qty} [${c.cutStyle}] = ₹${
            c.item.price * c.qty
          }`
      ),
      ``,
      `Subtotal: ₹${subtotal}`,
      `Delivery: ₹${summary.deliveryFee}`,
      `*Total Payable: ₹${summary.total}*`,
      prepNote.trim() ? `Note: ${prepNote.trim()}` : '',
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!canCheckout) return;

    const orderId = `SM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      zoneId: selectedZoneId,
      zoneName: summary.zone.nameEn,
      address: selectedZoneId === 'pickup' ? 'Self-Pickup: Seawoods Station East' : address.trim(),
      deliveryDate,
      slot,
      prepNote: prepNote.trim(),
      items: cartItems.map((c) => ({
        id: c.item.id,
        srNo: c.item.srNo,
        nameEn: c.item.nameEn,
        packSize: c.item.packSize,
        cutStyle: c.cutStyle,
        qty: c.qty,
        price: c.item.price,
      })),
      subtotal,
      deliveryFee: summary.deliveryFee,
      total: summary.total,
      status: 'Scheduled for 5 AM Purchase',
      whatsappText: buildWhatsAppText(orderId),
    };

    onPlaceDemoOrder(newOrder);
    setConfirmedOrder(newOrder);
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#14281D]/45 backdrop-blur-xs">
      <div className="flex h-[100dvh] w-full max-w-lg flex-col bg-[#FAF8F2] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E3DEC9] bg-white px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#1B5E32]" />
            <h2 className="font-display text-lg font-bold text-[#14281D] sm:text-xl">
              {confirmedOrder
                ? lang === 'en'
                  ? 'Order Scheduled!'
                  : 'ऑर्डर नोंदवली गेली!'
                : lang === 'en'
                ? 'Your SabziMate Basket'
                : 'तुमची भाजी बॅग'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#526B5C] transition hover:bg-[#F3EFE2]"
            aria-label="Close basket"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {confirmedOrder ? (
            <div className="space-y-5">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#1B5E32]" />
                <p className="mt-2 text-xs font-bold tracking-wider text-[#1B5E32] uppercase">
                  Order ID: {confirmedOrder.id}
                </p>
                <h3 className="font-display mt-1 text-2xl font-bold text-[#14281D]">
                  {lang === 'en'
                    ? 'Ready for Tomorrow’s Harvest!'
                    : 'उद्याच्या ताज्या बॅचसाठी ऑर्डर निश्चित!'}
                </h3>
                <p className="mt-1 text-xs text-[#435B4D]">
                  {lang === 'en'
                    ? 'Click below to send this pre-filled order directly to SabziMate WhatsApp for confirmation.'
                    : 'खालील बटणावर क्लिक करून ही ऑर्डर थेट SabziMate व्हॉट्सॲपवर पाठवा.'}
                </p>
              </div>

              <div className="space-y-2 rounded-2xl border border-[#E3DEC9] bg-white p-4 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-[#526B5C]">Batch Date:</span>
                  <span className="font-bold text-[#14281D]">
                    {formatReadableDate(confirmedOrder.deliveryDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#526B5C]">Area & Slot:</span>
                  <span className="text-right font-bold text-[#14281D]">
                    {confirmedOrder.zoneName} • {confirmedOrder.slot}
                  </span>
                </div>
                <div className="border-t border-[#F0ECE0] pt-2">
                  {confirmedOrder.items.map((it) => (
                    <div key={`${it.id}-${it.cutStyle}`} className="flex justify-between gap-2 py-1">
                      <span>
                        {it.nameEn} ({it.packSize}) × {it.qty}
                      </span>
                      <span className="shrink-0 font-semibold">₹{it.price * it.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-[#F0ECE0] pt-2 text-sm font-bold text-[#14281D]">
                  <span>Total (incl. ₹{confirmedOrder.deliveryFee} delivery)</span>
                  <span>₹{confirmedOrder.total}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(
                  confirmedOrder.whatsappText
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-[#0F2617] shadow-md transition hover:brightness-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Send Order on WhatsApp ({BUSINESS_INFO.whatsappDisplay})</span>
              </a>

              <p className="text-center text-[11px] text-[#6C8073]">
                Tip: Open &ldquo;Owner Demo&rdquo; in the menu to see this order live in the
                5 AM Mandi Procurement & Admin view!
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-[#B9CBBF]" />
              <p className="mt-3 text-base font-bold text-[#14281D]">
                {lang === 'en' ? 'Your basket is empty' : 'तुमची बॅग रिकामी आहे'}
              </p>
              <p className="mt-1 max-w-xs text-xs text-[#526B5C]">
                {lang === 'en'
                  ? 'Add pre-cut vegetables, peeled garlic, or ready-to-cook mixes for tomorrow.'
                  : 'उद्याच्या ताज्या बॅचसाठी कापलेल्या भाज्या किंवा मिक्स पॅक्स जोडा.'}
              </p>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-4 sm:space-y-5">
              {/* Items List */}
              <div className="space-y-2.5">
                {cartItems.map(({ item, qty, cutStyle }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2.5 rounded-2xl border border-[#E3DEC9] bg-white p-3 sm:gap-3 sm:p-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#14281D]">
                        {item.emoji} {lang === 'en' ? item.nameEn : item.nameMr}
                      </p>
                      <p className="truncate text-[11px] text-[#526B5C]">
                        {item.packSize} • ✂️ {cutStyle}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-[#1B5E32]">
                        ₹{item.price * qty}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                      <div className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#F3EFE2] px-2 py-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#14281D] hover:bg-white"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[16px] text-center text-xs font-bold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#14281D] hover:bg-white"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, 0)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#8A9B90] hover:bg-red-50 hover:text-red-600"
                        title="Remove"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Zone Selector inside Cart */}
              <div className="space-y-3 rounded-2xl border border-[#E3DEC9] bg-white p-4">
                <label className="block text-xs font-bold tracking-wide text-[#1B5E32] uppercase">
                  1. Delivery Area / Pickup
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => {
                    const nextZone = e.target.value;
                    onSelectZone(nextZone);
                    setSlot(
                      nextZone === 'pickup'
                        ? '5:00 PM – 9:00 PM (Seawoods Pickup)'
                        : '4:00 PM – 5:00 PM (Home Delivery)'
                    );
                  }}
                  className="min-h-[42px] w-full rounded-xl border border-[#D4CEB8] bg-[#FAF8F2] px-3 py-2 text-base font-semibold text-[#14281D] sm:text-xs"
                >
                  {DELIVERY_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nameEn} ({z.shortBadge})
                    </option>
                  ))}
                </select>

                {!summary.meetsMinOrder && (
                  <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                    ⚠️ Other Navi Mumbai areas require a minimum order of ₹399 (+₹50 delivery). Add
                    ₹{summary.amountForMin} more, or choose Seawoods Pickup!
                  </p>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 flex items-center gap-1 text-[11px] font-bold text-[#435B4D]">
                      <Calendar className="h-3.5 w-3.5 text-[#1B5E32]" />
                      Delivery Date (1 Day Prior)
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      required
                      className="min-h-[42px] w-full rounded-xl border border-[#D4CEB8] bg-[#FAF8F2] px-3 py-2 text-base font-semibold text-[#14281D] sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-[#435B4D]">
                      Preferred Time Slot
                    </label>
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      className="min-h-[42px] w-full rounded-xl border border-[#D4CEB8] bg-[#FAF8F2] px-3 py-2 text-base font-semibold text-[#14281D] sm:text-xs"
                    >
                      {selectedZoneId === 'pickup' ? (
                        <option value="5:00 PM – 9:00 PM (Seawoods Pickup)">
                          5:00 PM – 9:00 PM (Seawoods East)
                        </option>
                      ) : (
                        <>
                          <option value="4:00 PM – 5:00 PM (Home Delivery)">
                            4:00 PM – 5:00 PM (Standard Delivery)
                          </option>
                          <option value="5:00 PM – 7:00 PM (Evening Delivery)">
                            5:00 PM – 7:00 PM (Evening)
                          </option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Details (16px font on mobile prevents iOS Safari zoom) */}
              <div className="space-y-3 rounded-2xl border border-[#E3DEC9] bg-white p-4">
                <label className="block text-xs font-bold tracking-wide text-[#1B5E32] uppercase">
                  2. Customer Details
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name *"
                    className="min-h-[42px] w-full rounded-xl border border-[#D4CEB8] bg-[#FAF8F2] px-3 py-2 text-base text-[#14281D] focus:border-[#1B5E32] focus:outline-none sm:text-xs"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp Number *"
                    className="min-h-[42px] w-full rounded-xl border border-[#D4CEB8] bg-[#FAF8F2] px-3 py-2 text-base text-[#14281D] focus:border-[#1B5E32] focus:outline-none sm:text-xs"
                  />
                </div>
                {selectedZoneId !== 'pickup' && (
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat / Wing / Society Name & Sector (e.g. Sector 44, Seawoods) *"
                    className="w-full rounded-xl border border-[#D4CEB8] bg-[#FAF8F2] px-3 py-2.5 text-base text-[#14281D] focus:border-[#1B5E32] focus:outline-none sm:text-xs"
                  />
                )}
                <input
                  type="text"
                  value={prepNote}
                  onChange={(e) => setPrepNote(e.target.value)}
                  placeholder="Optional prep note (e.g. cut bhendi medium)"
                  className="min-h-[42px] w-full rounded-xl border border-[#D4CEB8] bg-[#FAF8F2] px-3 py-2 text-base text-[#14281D] focus:border-[#1B5E32] focus:outline-none sm:text-xs"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer Totals with iOS/Android Safe Area Inset */}
        {!confirmedOrder && cartItems.length > 0 && (
          <div className="space-y-3 border-t border-[#E3DEC9] bg-white px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-5">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#526B5C]">
                <span>Vegetables Subtotal</span>
                <span className="font-semibold text-[#14281D]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#526B5C]">
                <span>Delivery Charges ({summary.zone.nameEn})</span>
                <span className="font-semibold text-[#1B5E32]">
                  {summary.deliveryFee === 0 ? 'FREE' : `₹${summary.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#F0ECE0] pt-2 text-base font-extrabold text-[#14281D]">
                <span>Total Payable</span>
                <span>₹{summary.total}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={!canCheckout}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#1B5E32] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#144725] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Confirm Tomorrow’s Order • ₹{summary.total}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
