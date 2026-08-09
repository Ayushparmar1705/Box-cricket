import React, { useState } from 'react';
import type { Payment, Coupon } from '../../../types/schema.types';
import { MOCK_PAYMENTS, MOCK_COUPONS } from '../../../data/mockData';
import { Tag } from 'lucide-react';

export const PaymentsModule: React.FC = () => {
  const [payments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [coupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [tab, setTab] = useState<'TRANSACTIONS' | 'COUPONS'>('TRANSACTIONS');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Payments & Coupons</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review Razorpay gateway response payloads and verify active coupon parameters</p>
        </div>
        <div className="flex bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 p-1 rounded-lg w-fit shadow-sm">
          <button
            type="button"
            onClick={() => setTab('TRANSACTIONS')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              tab === 'TRANSACTIONS' 
                ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
            }`}
          >
            Transactions ({payments.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('COUPONS')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              tab === 'COUPONS' 
                ? 'bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
            }`}
          >
            Coupons ({coupons.length})
          </button>
        </div>
      </div>

      {tab === 'TRANSACTIONS' ? (
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Txn ID</th>
                  <th className="px-6 py-4">Booking Ref</th>
                  <th className="px-6 py-4">Gateway</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-900 dark:text-gray-100 font-semibold">{p.transactionId}</td>
                    <td className="px-6 py-4 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-medium">{p.bookingRef}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border border-gray-200 dark:border-gray-700">
                        {p.paymentGateway}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{p.paymentMethod}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400 text-right">₹{p.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          p.paymentStatus === 'SUCCESS' 
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs text-right font-medium">{p.paidAt.slice(0, 19).replace('T', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="text-indigo-600 dark:text-indigo-400" size={18} />
                  <span className="font-mono font-bold text-gray-900 dark:text-gray-100 text-base tracking-wider">{c.couponCode}</span>
                </div>
                <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider">
                  ACTIVE
                </span>
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50 dark:border-gray-700/50"><strong className="text-gray-500 dark:text-gray-400">Discount:</strong> <span className="font-medium text-gray-900 dark:text-gray-100">{c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}</span></div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50 dark:border-gray-700/50"><strong className="text-gray-500 dark:text-gray-400">Min Amount:</strong> <span className="font-medium">₹{c.minimumAmount}</span></div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50 dark:border-gray-700/50"><strong className="text-gray-500 dark:text-gray-400">Redemptions Limit:</strong> <span className="font-medium">{c.usageLimit} times</span></div>
                <div className="flex justify-between items-center"><strong className="text-gray-500 dark:text-gray-400">Expiry:</strong> <span className="font-medium">{c.expiryDate}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
