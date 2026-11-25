import { useState } from 'react';
import { ClipboardList, Database, IndianRupee, PackageCheck, X } from 'lucide-react';

export default function AdminDemoPanel({
  isOpen,
  onClose,
  catalog,
  onUpdatePrice,
  orders,
}) {
  const [tab, setTab] = useState('orders'); // 'orders' | 'procurement' | 'prices'

  if (!isOpen) return null;

  // Aggregate tomorrow's 5 AM Mandi procurement list from all orders
  const procurementMap = {};
  orders.forEach((order) => {
    order.items.forEach((it) => {
      if (!procurementMap[it.id]) {
        procurementMap[it.id] = {
          srNo: it.srNo,
          nameEn: it.nameEn,
          packSize: it.packSize,
          totalPacks: 0,
        };
      }
      procurementMap[it.id].totalPacks += it.qty;
    });
  });
  const procurementList = Object.values(procurementMap).sort((a, b) => a.srNo - b.srNo);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#14281D]/55 p-0 backdrop-blur-xs sm:items-center sm:p-4">
      <div className="flex h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-[#DDD7C3] bg-[#FAF8F2] shadow-2xl sm:h-auto sm:max-h-[88vh] sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#E3DEC9] bg-[#14281D] px-4 py-3.5 text-white sm:px-6 sm:py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 shrink-0 text-[#E8A317]" />
              <h2 className="font-display truncate text-base font-bold sm:text-lg">
                Guruprasad Enterprises — Owner Admin Demo
              </h2>
            </div>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-emerald-200/80 sm:text-xs">
              Preview PostgreSQL/Supabase 1-day-prior batches, 5 AM mandi totals & daily prices.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
            aria-label="Close Owner Demo"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs (horizontally scrollable on narrow screens) */}
        <div className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto border-b border-[#E3DEC9] bg-white px-4 py-3 sm:flex-wrap sm:px-6">
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition ${
              tab === 'orders'
                ? 'bg-[#1B5E32] text-white'
                : 'bg-[#FAF8F2] text-[#2E4738] hover:bg-emerald-50'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>Incoming Orders ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('procurement')}
            className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition ${
              tab === 'procurement'
                ? 'bg-[#1B5E32] text-white'
                : 'bg-[#FAF8F2] text-[#2E4738] hover:bg-emerald-50'
            }`}
          >
            <PackageCheck className="h-3.5 w-3.5" />
            <span>5 AM Mandi List ({procurementList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('prices')}
            className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition ${
              tab === 'prices'
                ? 'bg-[#1B5E32] text-white'
                : 'bg-[#FAF8F2] text-[#2E4738] hover:bg-emerald-50'
            }`}
          >
            <IndianRupee className="h-3.5 w-3.5" />
            <span>Daily Prices (31)</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6">
          {tab === 'orders' && (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl border border-[#E3DEC9] bg-white p-3.5 shadow-xs sm:p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-extrabold text-[#1B5E32]">{ord.id}</span>
                      <span className="mx-2 text-[#CFC8B0]">•</span>
                      <span className="text-sm font-bold text-[#14281D]">{ord.customerName}</span>
                      <span className="ml-2 text-xs text-[#526B5C]">({ord.customerPhone})</span>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-[#1B5E32]">
                      {ord.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#526B5C]">
                    📍 {ord.zoneName} — {ord.address} | 📅 {ord.deliveryDate} ({ord.slot})
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {ord.items.map((it) => (
                      <span
                        key={`${it.id}-${it.cutStyle}`}
                        className="rounded-lg bg-[#FAF8F2] px-2.5 py-1 text-[11px] font-semibold text-[#2E4738]"
                      >
                        {it.nameEn} ({it.packSize}) × {it.qty}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-right text-xs font-extrabold text-[#14281D]">
                    Total: ₹{ord.total}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'procurement' && (
            <div>
              <p className="mb-4 text-xs text-[#435B4D]">
                Auto-calculated from scheduled customer orders so your team knows exact quantities
                to buy fresh at 5:00 AM APMC Vashi Mandi:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-[#E3DEC9] bg-white">
                <table className="w-full min-w-[440px] text-left text-xs">
                  <thead className="border-b border-[#E3DEC9] bg-[#F3EFE2] text-[#14281D]">
                    <tr>
                      <th className="px-4 py-3 font-bold">#</th>
                      <th className="px-4 py-3 font-bold">Vegetable</th>
                      <th className="px-4 py-3 font-bold">Pack Unit</th>
                      <th className="px-4 py-3 font-bold">Total Packs Ordered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE0]">
                    {procurementList.map((row) => (
                      <tr key={row.srNo}>
                        <td className="px-4 py-2.5 font-bold text-[#6C8073]">{row.srNo}</td>
                        <td className="px-4 py-2.5 font-semibold text-[#14281D]">{row.nameEn}</td>
                        <td className="px-4 py-2.5 text-[#526B5C]">{row.packSize}</td>
                        <td className="px-4 py-2.5 font-extrabold text-[#1B5E32]">
                          {row.totalPacks} packs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'prices' && (
            <div>
              <p className="mb-4 text-xs text-[#435B4D]">
                Edit any daily rate below—changes reflect instantly on the customer storefront:
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {catalog.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#E3DEC9] bg-white px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#14281D]">
                        #{item.srNo} {item.nameEn}
                      </p>
                      <p className="text-[11px] text-[#526B5C]">{item.packSize}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#526B5C]">₹</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={5}
                        max={999}
                        value={item.price}
                        onChange={(e) => onUpdatePrice(item.id, Number(e.target.value) || 0)}
                        className="min-h-[38px] w-16 rounded-lg border border-[#D4CEB8] bg-[#FAF8F2] px-2 py-1 text-right text-base font-bold text-[#14281D] sm:min-h-[30px] sm:text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
