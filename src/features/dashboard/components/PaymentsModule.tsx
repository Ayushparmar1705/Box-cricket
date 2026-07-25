import React, { useState } from 'react';
import type { Payment, Coupon } from '../../../types/schema.types';
import { MOCK_PAYMENTS, MOCK_COUPONS } from '../../../data/mockData';
import { Tag } from 'lucide-react';

export const PaymentsModule: React.FC = () => {
  const [payments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [coupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [tab, setTab] = useState<'TRANSACTIONS' | 'COUPONS'>('TRANSACTIONS');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payments & Coupons</h2>
          <p className="text-xs text-slate-500 mt-1">Review Razorpay gateway response payloads and verify active coupon parameters</p>
        </div>
        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setTab('TRANSACTIONS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'TRANSACTIONS' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Transactions ({payments.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('COUPONS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${tab === 'COUPONS' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Coupons ({coupons.length})
          </button>
        </div>
      </div>

      {tab === 'TRANSACTIONS' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">Txn ID</th>
                <th className="px-5 py-3.5">Booking Ref</th>
                <th className="px-5 py-3.5">Gateway</th>
                <th className="px-5 py-3.5">Method</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-mono text-slate-700 font-bold">{p.transactionId}</td>
                  <td className="px-5 py-3.5 font-mono text-emerald-600">{p.bookingRef}</td>
                  <td className="px-5 py-3.5">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-700">
                      {p.paymentGateway}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">{p.paymentMethod}</td>
                  <td className="px-5 py-3.5 font-extrabold text-emerald-700">₹{p.amount}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${p.paymentStatus === 'SUCCESS' ? 'bg-emerald-55 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{p.paidAt.slice(0, 19).replace('T', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="text-emerald-600" size={18} />
                  <span className="font-mono font-extrabold text-slate-900 text-base tracking-wider">{c.couponCode}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-750 border border-emerald-250 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col gap-1.5">
                <div><strong>Discount:</strong> {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</div>
                <div><strong>Minimum Amount:</strong> ₹{c.minimumAmount}</div>
                <div><strong>Redemptions Limit:</strong> {c.usageLimit} times</div>
                <div><strong>Expiry:</strong> {c.expiryDate}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
