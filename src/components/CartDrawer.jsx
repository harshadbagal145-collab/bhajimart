import { useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
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
    selectedZoneId === 'pickup'
      ? '5:00 PM – 9:00 PM (Demo Hub Pickup)'
      : '4:00 PM – 5:00 PM (Home Delivery)'
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [prepNote, setPrepNote] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0);
  const summary = calculateDeliverySummary(selectedZoneId, subtotal);

  const canCheckout =
    cartItems.length > 0 &&
    summary.meetsMinOrder &&
    customerName.trim().length > 1 &&
    customerPhone.trim().length >= 10 &&
    (selectedZoneId === 'pickup' || address.trim().length > 4);

  const fillSampleDetails = () => {
    setCustomerName('Demo Customer');
    setCustomerPhone('9000012345');
    if (selectedZoneId !== 'pickup') {
      setAddress('Flat 101, Sample Greens Society, Sector 5, Demo City');
    }
    setPrepNote('Medium size cut for bhendi (Demo note)');
  };

  const buildWhatsAppText = (orderId) => {
    const lines = [
      `*${BUSINESS_INFO.brandName} Demo Order ${orderId}*`,
      `Name: ${customerName}`,
      `Phone: ${customerPhone}`,
      `Zone: ${summary.zone.nameEn}`,
      selectedZoneId === 'pickup'
        ? `Pickup: ${BUSINESS_INFO.pickupHubShort}`
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

    const orderId = `BC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      zoneId: selectedZoneId,
      zoneName: summary.zone.nameEn,
      address: selectedZoneId === 'pickup' ? `Self-Pickup: ${BUSINESS_INFO.pickupHubShort}` : address.trim(),
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
      status: 'Scheduled for 5 AM Purchase (Demo)',
      whatsappText: buildWhatsAppText(orderId),
    };

    onPlaceDemoOrder(newOrder);
    setConfirmedOrder(newOrder);
    setCopiedMsg(false);
    onClearCart();
  };

  const handleCopyWhatsApp = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    } catch {
      // ignore clipboard errors in restricted browsers
    }
  };

  const closeDrawer = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDrawer();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-[#0E2A1C]/50 backdrop-blur-xs"
    >
      <div className="flex h-[100dvh] w-full max-w-lg flex-col bg-[#F6F8F3] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DDE6DA] bg-white px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#146C3B]" />
            <h2 className="font-display text-lg font-bold text-[#10241A] sm:text-xl">
              {confirmedOrder
                ? lang === 'en'
                  ? 'Demo Order Scheduled!'
                  : 'डेमो ऑर्डर नोंदवली गेली!'
                : lang === 'en'
                ? 'Your Demo Basket'
                : 'तुमची डेमो बॅग'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#4D6857] transition hover:bg-[#ECF1E9]"
            aria-label="Close basket"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
          {confirmedOrder ? (
            <div className="space-y-4">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#146C3B]" />
                <p className="mt-2 text-xs font-bold tracking-wider text-[#146C3B] uppercase">
                  Demo Order ID: {confirmedOrder.id}
                </p>
                <h3 className="font-display mt-1 text-2xl font-bold text-[#10241A]">
                  {lang === 'en'
                    ? 'Added to Tomorrow’s Batch!'
                    : 'उद्याच्या डेमो बॅचमध्ये समाविष्ट!'}
                </h3>
                <p className="mt-1 text-xs text-[#3E5849]">
                  {lang === 'en'
                    ? 'Simulated WhatsApp receipt generated below. No real message was sent.'
                    : 'खाली नमुना व्हॉट्सॲप संदेश तयार झाला आहे. प्रत्यक्ष मेसेज पाठवला गेला नाही.'}
                </p>
              </div>

              <div className="space-y-2 rounded-2xl border border-[#DDE6DA] bg-white p-4 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-[#4D6857]">Batch Date:</span>
                  <span className="font-bold text-[#10241A]">
                    {formatReadableDate(confirmedOrder.deliveryDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#4D6857]">Zone & Slot:</span>
                  <span className="text-right font-bold text-[#10241A]">
                    {confirmedOrder.zoneName} • {confirmedOrder.slot}
                  </span>
                </div>
                <div className="border-t border-[#EDF2EA] pt-2">
                  {confirmedOrder.items.map((it) => (
                    <div key={`${it.id}-${it.cutStyle}`} className="flex justify-between gap-2 py-1">
                      <span>
                        {it.nameEn} ({it.packSize}) × {it.qty}
                      </span>
                      <span className="shrink-0 font-semibold">₹{it.price * it.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-[#EDF2EA] pt-2 text-sm font-bold text-[#10241A]">
                  <span>Total (incl. ₹{confirmedOrder.deliveryFee} delivery)</span>
                  <span>₹{confirmedOrder.total}</span>
                </div>
              </div>

              {/* Safe Demo WhatsApp Message Preview */}
              <div className="rounded-2xl border border-emerald-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#146C3B]">
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    WhatsApp Order Message Preview (Demo)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyWhatsApp(confirmedOrder.whatsappText)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#ECF1E9] px-3 py-1 text-[11px] font-bold text-[#146C3B] transition hover:bg-emerald-100"
                  >
                    {copiedMsg ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="max-h-48 overflow-y-auto rounded-xl bg-[#F6F8F3] p-3 font-mono text-[11px] whitespace-pre-wrap text-[#244232]">
                  {confirmedOrder.whatsappText}
                </pre>
              </div>

              <p className="text-center text-[11px] text-[#647D6E]">
                Tip: Open &ldquo;Owner Demo&rdquo; in the top menu to view this order live in the
                5 AM Procurement List &amp; Admin Panel!
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-[#A9C0B0]" />
              <p className="mt-3 text-base font-bold text-[#10241A]">
                {lang === 'en' ? 'Your basket is empty' : 'तुमची बॅग रिकामी आहे'}
              </p>
              <p className="mt-1 max-w-xs text-xs text-[#4D6857]">
                {lang === 'en'
                  ? 'Add pre-cut vegetables, peeled garlic, or ready-to-cook mixes for the demo.'
                  : 'डेमोसाठी कापलेल्या भाज्या किंवा मिक्स पॅक्स जोडा.'}
              </p>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-4 sm:space-y-5">
              {/* Items List */}
              <div className="space-y-2.5">
                {cartItems.map(({ item, qty, cutStyle }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2.5 rounded-2xl border border-[#DDE6DA] bg-white p-3 sm:gap-3 sm:p-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#10241A]">
                        {item.emoji} {lang === 'en' ? item.nameEn : item.nameMr}
                      </p>
                      <p className="truncate text-[11px] text-[#4D6857]">
                        {item.packSize} • ✂️ {cutStyle}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-[#146C3B]">
                        ₹{item.price * qty}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                      <div className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#ECF1E9] px-2 py-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#10241A] hover:bg-white"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[16px] text-center text-xs font-bold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#10241A] hover:bg-white"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, 0)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#7E9687] hover:bg-red-50 hover:text-red-600"
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
              <div className="space-y-3 rounded-2xl border border-[#DDE6DA] bg-white p-4">
                <label className="block text-xs font-bold tracking-wide text-[#146C3B] uppercase">
                  1. Demo Delivery Zone / Pickup
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => {
                    const nextZone = e.target.value;
                    onSelectZone(nextZone);
                    setSlot(
                      nextZone === 'pickup'
                        ? '5:00 PM – 9:00 PM (Demo Hub Pickup)'
                        : '4:00 PM – 5:00 PM (Home Delivery)'
                    );
                  }}
                  className="min-h-[42px] w-full min-w-0 rounded-xl border border-[#CFDACA] bg-[#F6F8F3] px-3 py-2 text-base font-semibold text-[#10241A] sm:text-xs"
                >
                  {DELIVERY_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nameEn} ({z.shortBadge})
                    </option>
                  ))}
                </select>

                {!summary.meetsMinOrder && (
                  <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                    ⚠️ Outer City Suburbs require a minimum order of ₹399 (+₹50 delivery). Add ₹
                    {summary.amountForMin} more, or choose Demo Hub Pickup!
                  </p>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label className="mb-1 flex items-center gap-1 text-[11px] font-bold text-[#3E5849]">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-[#146C3B]" />
                      <span>Delivery Date (1 Day Prior)</span>
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      required
                      className="min-h-[42px] w-full min-w-0 max-w-full rounded-xl border border-[#CFDACA] bg-[#F6F8F3] px-3 py-2 text-base font-semibold text-[#10241A] sm:text-xs"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="mb-1 block text-[11px] font-bold text-[#3E5849]">
                      Preferred Time Slot
                    </label>
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      className="min-h-[42px] w-full min-w-0 rounded-xl border border-[#CFDACA] bg-[#F6F8F3] px-3 py-2 text-base font-semibold text-[#10241A] sm:text-xs"
                    >
                      {selectedZoneId === 'pickup' ? (
                        <option value="5:00 PM – 9:00 PM (Demo Hub Pickup)">
                          5:00 PM – 9:00 PM (Demo Market Hub)
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
              <div className="space-y-3 rounded-2xl border border-[#DDE6DA] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-bold tracking-wide text-[#146C3B] uppercase">
                    2. Sample Customer Details
                  </label>
                  <button
                    type="button"
                    onClick={fillSampleDetails}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-950 transition hover:bg-amber-200"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Fill Demo Info</span>
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Sample Name (e.g. Demo User) *"
                    className="min-h-[42px] w-full min-w-0 rounded-xl border border-[#CFDACA] bg-[#F6F8F3] px-3 py-2 text-base text-[#10241A] focus:border-[#146C3B] focus:outline-none sm:text-xs"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Demo Phone (e.g. 9000012345) *"
                    className="min-h-[42px] w-full min-w-0 rounded-xl border border-[#CFDACA] bg-[#F6F8F3] px-3 py-2 text-base text-[#10241A] focus:border-[#146C3B] focus:outline-none sm:text-xs"
                  />
                </div>
                {selectedZoneId !== 'pickup' && (
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Demo Address (e.g. Flat 101, Sample Society, Sector 5) *"
                    className="w-full min-w-0 rounded-xl border border-[#CFDACA] bg-[#F6F8F3] px-3 py-2.5 text-base text-[#10241A] focus:border-[#146C3B] focus:outline-none sm:text-xs"
                  />
                )}
                <input
                  type="text"
                  value={prepNote}
                  onChange={(e) => setPrepNote(e.target.value)}
                  placeholder="Optional prep note (e.g. cut bhendi medium)"
                  className="min-h-[42px] w-full min-w-0 rounded-xl border border-[#CFDACA] bg-[#F6F8F3] px-3 py-2 text-base text-[#10241A] focus:border-[#146C3B] focus:outline-none sm:text-xs"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer Totals with iOS/Android Safe Area Inset */}
        {!confirmedOrder && cartItems.length > 0 && (
          <div className="space-y-3 border-t border-[#DDE6DA] bg-white px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-5">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#4D6857]">
                <span>Vegetables Subtotal</span>
                <span className="font-semibold text-[#10241A]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#4D6857]">
                <span>Delivery Charges ({summary.zone.nameEn})</span>
                <span className="font-semibold text-[#146C3B]">
                  {summary.deliveryFee === 0 ? 'FREE' : `₹${summary.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EDF2EA] pt-2 text-base font-extrabold text-[#10241A]">
                <span>Total Payable</span>
                <span>₹{summary.total}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={!canCheckout}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#146C3B] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0E522C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Place Demo Order • ₹{summary.total}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
