import { useState } from 'react';
import { ClipboardList, Database, IndianRupee, PackageCheck, RotateCcw, X } from 'lucide-react';

export default function AdminDemoPanel({
  isOpen,
  onClose,
  catalog,
  onUpdatePrice,
  orders,
  onResetDemoData,
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
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0E2A1C]/55 p-0 backdrop-blur-xs sm:items-center sm:p-4"
    >
      <div className="flex h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-[#D4DFD0] bg-[#F6F8F3] shadow-2xl sm:h-auto sm:max-h-[88vh] sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#DDE6DA] bg-[#0E2A1C] px-4 py-3.5 text-white sm:px-6 sm:py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 shrink-0 text-[#F59E0B]" />
              <h2 className="font-display truncate text-base font-bold sm:text-lg">
                BhajiCart Demo — Owner Admin Preview
              </h2>
            </div>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-emerald-200/80 sm:text-xs">
              Interactive demo of 1-day-prior orders, 5 AM mandi aggregation &amp; live price editor.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {onResetDemoData && (
              <button
                type="button"
                onClick={onResetDemoData}
                className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-white/20"
                title="Reset sample orders and prices"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
              aria-label="Close Owner Demo"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs (horizontally scrollable on narrow screens) */}
        <div className="no-scrollbar flex flex-nowrap gap-2 overflow-x-auto border-b border-[#DDE6DA] bg-white px-4 py-3 sm:flex-wrap sm:px-6">
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition ${
              tab === 'orders'
                ? 'bg-[#146C3B] text-white'
                : 'bg-[#F6F8F3] text-[#244232] hover:bg-emerald-50'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>Demo Orders ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('procurement')}
            className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition ${
              tab === 'procurement'
                ? 'bg-[#146C3B] text-white'
                : 'bg-[#F6F8F3] text-[#244232] hover:bg-emerald-50'
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
                ? 'bg-[#146C3B] text-white'
                : 'bg-[#F6F8F3] text-[#244232] hover:bg-emerald-50'
            }`}
          >
            <IndianRupee className="h-3.5 w-3.5" />
            <span>Daily Prices (31)</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6">
          {tab === 'orders' && (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl border border-[#DDE6DA] bg-white p-3.5 shadow-xs sm:p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-[#146C3B]">{ord.id}</span>
                      <span className="mx-2 text-[#C8D5C3]">•</span>
                      <span className="text-sm font-bold text-[#10241A]">{ord.customerName}</span>
                      <span className="ml-2 text-xs text-[#4D6857]">({ord.customerPhone})</span>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-[#146C3B]">
                      {ord.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#4D6857]">
                    📍 {ord.zoneName} — {ord.address} | 📅 {ord.deliveryDate} ({ord.slot})
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {ord.items.map((it) => (
                      <span
                        key={`${it.id}-${it.cutStyle}`}
                        className="rounded-lg bg-[#F6F8F3] px-2.5 py-1 text-[11px] font-semibold text-[#244232]"
                      >
                        {it.nameEn} ({it.packSize}) × {it.qty}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-right text-xs font-extrabold text-[#10241A]">
                    Total: ₹{ord.total}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'procurement' && (
            <div>
              <p className="mb-4 text-xs text-[#3E5849]">
                Auto-calculated from scheduled demo orders so the morning team knows exact pack
                quantities to source at 5:00 AM Wholesale Mandi:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-[#DDE6DA] bg-white">
                <table className="w-full min-w-[440px] text-left text-xs">
                  <thead className="border-b border-[#DDE6DA] bg-[#ECF1E9] text-[#10241A]">
                    <tr>
                      <th className="px-4 py-3 font-bold">#</th>
                      <th className="px-4 py-3 font-bold">Vegetable</th>
                      <th className="px-4 py-3 font-bold">Pack Unit</th>
                      <th className="px-4 py-3 font-bold">Total Packs Ordered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDF2EA]">
                    {procurementList.map((row) => (
                      <tr key={row.srNo}>
                        <td className="px-4 py-2.5 font-bold text-[#647D6E]">{row.srNo}</td>
                        <td className="px-4 py-2.5 font-semibold text-[#10241A]">{row.nameEn}</td>
                        <td className="px-4 py-2.5 text-[#4D6857]">{row.packSize}</td>
                        <td className="px-4 py-2.5 font-extrabold text-[#146C3B]">
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
              <p className="mb-4 text-xs text-[#3E5849]">
                Edit any sample rate below—changes reflect immediately on the demo storefront:
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {catalog.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#DDE6DA] bg-white px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#10241A]">
                        #{item.srNo} {item.nameEn}
                      </p>
                      <p className="text-[11px] text-[#4D6857]">{item.packSize}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#4D6857]">₹</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={5}
                        max={999}
                        value={item.price}
                        onChange={(e) => onUpdatePrice(item.id, Number(e.target.value) || 0)}
                        className="min-h-[38px] w-16 rounded-lg border border-[#CFDACA] bg-[#F6F8F3] px-2 py-1 text-right text-base font-bold text-[#10241A] sm:min-h-[32px] sm:text-xs"
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
