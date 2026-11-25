export const DELIVERY_ZONES = [
  {
    id: 'central-hub',
    nameEn: 'Central Zone (Sectors 1–10)',
    nameMr: 'सेंट्रल झोन (सेक्टर १–१०)',
    freeAbove: 199,
    minOrder: 0,
    baseDeliveryFee: 30,
    ruleEn: 'Free delivery on orders above ₹199',
    ruleMr: '₹१९९ पेक्षा जास्त ऑर्डरवर मोफत डिलिव्हरी',
    shortBadge: 'Free > ₹199',
  },
  {
    id: 'east-metro',
    nameEn: 'Lakeview & East Metro',
    nameMr: 'लेकव्ह्यू आणि ईस्ट मेट्रो',
    freeAbove: 299,
    minOrder: 0,
    baseDeliveryFee: 40,
    ruleEn: 'Free delivery on orders above ₹299',
    ruleMr: '₹२९९ पेक्षा जास्त ऑर्डरवर मोफत डिलिव्हरी',
    shortBadge: 'Free > ₹299',
  },
  {
    id: 'outer-city',
    nameEn: 'Outer City Suburbs',
    nameMr: 'शहराबाहेरील परिसर',
    freeAbove: null, // always +₹50 delivery charge
    minOrder: 399,
    baseDeliveryFee: 50,
    ruleEn: 'Minimum order ₹399 + ₹50 delivery charges',
    ruleMr: 'किमान ऑर्डर ₹३९९ + ₹५० डिलिव्हरी शुल्क',
    shortBadge: 'Min ₹399 + ₹50',
  },
  {
    id: 'pickup',
    nameEn: 'Self-Pickup (Demo Market Hub)',
    nameMr: 'स्वतः पिकअप (डेमो मार्केट हब)',
    freeAbove: 0,
    minOrder: 0,
    baseDeliveryFee: 0,
    ruleEn: 'Zero delivery fee • Pickup 5:00 PM – 9:00 PM',
    ruleMr: 'डिलिव्हरी शुल्क नाही • वेळ सायं. ५ ते रात्री ९',
    shortBadge: 'Free Pickup',
  },
];

export function calculateDeliverySummary(zoneId, subtotal) {
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId) || DELIVERY_ZONES[0];

  if (zone.id === 'pickup') {
    return {
      zone,
      deliveryFee: 0,
      isFree: true,
      meetsMinOrder: subtotal > 0,
      amountForFree: 0,
      amountForMin: 0,
      total: subtotal,
    };
  }

  if (zone.id === 'outer-city') {
    const meetsMin = subtotal >= zone.minOrder;
    return {
      zone,
      deliveryFee: subtotal > 0 ? zone.baseDeliveryFee : 0,
      isFree: false,
      meetsMinOrder: meetsMin,
      amountForFree: 0,
      amountForMin: Math.max(0, zone.minOrder - subtotal),
      total: subtotal + (subtotal > 0 ? zone.baseDeliveryFee : 0),
    };
  }

  const isFree = subtotal >= zone.freeAbove;
  const deliveryFee = subtotal === 0 ? 0 : isFree ? 0 : zone.baseDeliveryFee;

  return {
    zone,
    deliveryFee,
    isFree,
    meetsMinOrder: subtotal > 0,
    amountForFree: Math.max(0, zone.freeAbove - subtotal),
    amountForMin: 0,
    total: subtotal + deliveryFee,
  };
}

export function getTomorrowDateISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export function formatReadableDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
