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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Courts & Dynamic Pricing</h2>
          <p className="text-xs text-slate-500 mt-1">Manage individual court surfaces and custom pricing rule windows</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md w-fit"
        >
          <Plus size={16} /> Add Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {courts.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">{c.id}</span>
              <span className="bg-slate-100 border border-slate-250 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                {c.surfaceType}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">{c.courtName}</h3>
            <div className="text-xs text-slate-500">{c.venueName}</div>
            <div className="text-xs text-slate-700 bg-slate-55 p-2.5 rounded-lg border border-slate-200 flex justify-between">
              <span>Standard Base Rate:</span>
              <strong className="text-emerald-700 font-bold">₹{c.pricePerHour} / hr</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-55 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-slate-500" />
            <h3 className="font-bold text-slate-900 text-sm">Dynamic Pricing Windows</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">pricing_rules</span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3.5">ID</th>
              <th className="px-5 py-3.5">Court</th>
              <th className="px-5 py-3.5">Day Type</th>
              <th className="px-5 py-3.5">Time Window</th>
              <th className="px-5 py-3.5">Rate</th>
              <th className="px-5 py-3.5">Validity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {rules.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-mono text-slate-500">{r.id}</td>
                <td className="px-5 py-3.5 font-bold text-slate-900">{r.courtName}</td>
                <td className="px-5 py-3.5">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                    {r.dayType}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-700">{r.startTime} - {r.endTime}</td>
                <td className="px-5 py-3.5 font-bold text-emerald-700">₹{r.price} / hr</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">{r.validFrom} to {r.validTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-sans">Add Pricing Rule</h3>
              <button type="button" className="text-slate-400 hover:text-slate-650" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddRule} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">Select Court</label>
                <select
                  value={newRule.courtId}
                  onChange={(e) => setNewRule({ ...newRule, courtId: e.target.value })}
                  className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer text-xs"
                >
                  {courts.map((c) => (
                    <option key={c.id} value={c.id}>{c.courtName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Day Type</label>
                  <select
                    value={newRule.dayType}
                    onChange={(e) => setNewRule({ ...newRule, dayType: e.target.value as any })}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-emerald-500 cursor-pointer text-xs"
                  >
                    <option value="WEEKDAY">WEEKDAY</option>
                    <option value="WEEKEND">WEEKEND</option>
                    <option value="HOLIDAY">HOLIDAY</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Rate (₹ / hr)</label>
                  <input
                    type="number"
                    value={newRule.price}
                    onChange={(e) => setNewRule({ ...newRule, price: Number(e.target.value) })}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-emerald-500 text-xs"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
