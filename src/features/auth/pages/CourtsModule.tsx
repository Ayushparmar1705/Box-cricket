import React, { useState } from 'react';
import type { Court, PricingRule } from '../../../types/schema.types';
import { MOCK_COURTS, MOCK_PRICING_RULES } from '../../../data/mockData';
import { Layers, Plus } from 'lucide-react';

export const CourtsModule: React.FC = () => {
  const [courts] = useState<Court[]>(MOCK_COURTS);
  const [rules, setRules] = useState<PricingRule[]>(MOCK_PRICING_RULES);
  const [showModal, setShowModal] = useState(false);
  const [newRule, setNewRule] = useState({
    courtId: MOCK_COURTS[0].id,
    dayType: 'WEEKDAY' as const,
    startTime: '18:00',
    endTime: '22:00',
    price: 1500,
  });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const court = courts.find((c) => c.id === newRule.courtId);
    setRules([
      ...rules,
      {
        id: `pr-${rules.length + 1}`,
        courtId: newRule.courtId,
        courtName: court ? court.courtName : 'Court A',
        dayType: newRule.dayType,
        startTime: newRule.startTime,
        endTime: newRule.endTime,
        price: Number(newRule.price),
        validFrom: '2026-01-01',
        validTo: '2026-12-31',
      },
    ]);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Courts & Dynamic Pricing</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage individual court surfaces and custom pricing rule windows</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm w-fit"
        >
          <Plus size={16} /> Add Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courts.map((c) => (
          <div key={c.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gray-400 dark:text-gray-500 font-semibold">{c.id}</span>
              <span className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md">
                {c.surfaceType}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-snug">{c.courtName}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{c.venueName}</div>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center mt-1">
              <span className="font-medium text-gray-500 dark:text-gray-400">Standard Base Rate:</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">₹{c.pricePerHour} / hr</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers size={18} className="text-gray-500 dark:text-gray-400" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Dynamic Pricing Windows</h3>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono tracking-wider">pricing_rules</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Court</th>
                <th className="px-6 py-4">Day Type</th>
                <th className="px-6 py-4">Time Window</th>
                <th className="px-6 py-4 text-right">Rate</th>
                <th className="px-6 py-4 text-right">Validity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{r.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{r.courtName}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border border-gray-200 dark:border-gray-700">
                      {r.dayType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{r.startTime} - {r.endTime}</td>
                  <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400 text-right">₹{r.price} <span className="text-xs text-gray-400 font-normal">/ hr</span></td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs text-right">{r.validFrom} <span className="text-gray-300 dark:text-gray-600 px-1">to</span> {r.validTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Add Pricing Rule</h3>
              <button type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddRule} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Select Court</label>
                <select
                  value={newRule.courtId}
                  onChange={(e) => setNewRule({ ...newRule, courtId: e.target.value })}
                  className="h-11 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 cursor-pointer text-sm"
                >
                  {courts.map((c) => (
                    <option key={c.id} value={c.id}>{c.courtName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Day Type</label>
                  <select
                    value={newRule.dayType}
                    onChange={(e) => setNewRule({ ...newRule, dayType: e.target.value as any })}
                    className="h-11 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 cursor-pointer text-sm"
                  >
                    <option value="WEEKDAY">WEEKDAY</option>
                    <option value="WEEKEND">WEEKEND</option>
                    <option value="HOLIDAY">HOLIDAY</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Rate (₹ / hr)</label>
                  <input
                    type="number"
                    value={newRule.price}
                    onChange={(e) => setNewRule({ ...newRule, price: Number(e.target.value) })}
                    className="h-11 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                <button type="button" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold cursor-pointer transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
