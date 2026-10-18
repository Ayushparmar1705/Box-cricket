// ============================================================================
// File: PricingManager.tsx
// Description: Dynamic Hourly Pricing, Surcharge Rules & Live Price Estimator
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Tag,
  Info,
  Calculator,
  Plus,
  Sliders,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface PricingRule {
  id: string;
  name: string;
  type: 'PEAK_HOUR' | 'WEEKEND' | 'LONG_BOOKING' | 'NIGHT_SURCHARGE';
  condition: string;
  adjustmentType: 'PERCENT' | 'FLAT';
  value: number;
  isActive: boolean;
}

const INITIAL_PRICING_RULES: PricingRule[] = [
  {
    id: 'pr-1',
    name: 'Night Floodlight Surcharge',
    type: 'NIGHT_SURCHARGE',
    condition: 'Bookings between 07:00 PM - 12:00 AM',
    adjustmentType: 'FLAT',
    value: 300,
    isActive: true,
  },
  {
    id: 'pr-2',
    name: 'Weekend Prime Hours',
    type: 'WEEKEND',
    condition: 'Saturday & Sunday All Day',
    adjustmentType: 'PERCENT',
    value: 20,
    isActive: true,
  },
  {
    id: 'pr-3',
    name: 'Long Match Discount (3+ Hours)',
    type: 'LONG_BOOKING',
    condition: 'Continuous slot booking >= 3 Hours',
    adjustmentType: 'PERCENT',
    value: -10,
    isActive: true,
  },
];

export default function PricingManager() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(() => {
    try {
      const stored = localStorage.getItem('boxcricket_pricing_rules');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_PRICING_RULES;
  });

  // Simulator State
  const [calcBaseRate, setCalcBaseRate] = useState<number>(1500);
  const [calcHours, setCalcHours] = useState<number>(2);
  const [calcIsWeekend, setCalcIsWeekend] = useState<boolean>(true);
  const [calcIsNight, setCalcIsNight] = useState<boolean>(true);

  const saveRules = (rules: PricingRule[]) => {
    setPricingRules(rules);
    try {
      localStorage.setItem('boxcricket_pricing_rules', JSON.stringify(rules));
    } catch {
      // fallback
    }
  };

  const handleToggleRuleStatus = (id: string) => {
    const updated = pricingRules.map((r) =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    saveRules(updated);
    toast.success('Pricing rule updated');
  };

  // Live price calculation
  const calculatedEstimatedPrice = useMemo(() => {
    const subtotal = calcBaseRate * calcHours;
    let surcharge = 0;

    const nightRule = pricingRules.find((r) => r.type === 'NIGHT_SURCHARGE');
    if (calcIsNight && nightRule?.isActive) {
      surcharge += nightRule.value * calcHours;
    }

    const weekendRule = pricingRules.find((r) => r.type === 'WEEKEND');
    if (calcIsWeekend && weekendRule?.isActive) {
      surcharge += subtotal * (weekendRule.value / 100);
    }

    const longRule = pricingRules.find((r) => r.type === 'LONG_BOOKING');
    if (calcHours >= 3 && longRule?.isActive) {
      surcharge += subtotal * (longRule.value / 100); // negative discount
    }

    return Math.max(0, Math.round(subtotal + surcharge));
  }, [calcBaseRate, calcHours, calcIsWeekend, calcIsNight, pricingRules]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ── Toolbar Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>Dynamic Hourly Pricing & Surcharge Rules</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automate surge pricing for night floodlights, weekend peaks, and long match discounts.
          </p>
        </div>
      </div>

      {/* ── Rules Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingRules.map((rule) => (
          <div
            key={rule.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between hover:border-emerald-200 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={() => handleToggleRuleStatus(rule.id)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {rule.isActive ? 'Active' : 'Disabled'}
                  </span>
                </label>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">{rule.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{rule.condition}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Adjustment Rate</span>
                <span className="text-sm font-extrabold text-emerald-700">
                  {rule.adjustmentType === 'FLAT'
                    ? `+₹${rule.value}`
                    : `${rule.value > 0 ? '+' : ''}${rule.value}%`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Applied automatically during player checkout</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Interactive Live Price Calculator Simulator ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Slot Price Estimator</h3>
              <p className="text-xs text-slate-500">
                Test how active surge rules calculate final player fees
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Simulator
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Base Rate per Hour (₹)</label>
            <input
              type="number"
              value={calcBaseRate}
              onChange={(e) => setCalcBaseRate(Number(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Duration (Hours)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={calcHours}
              onChange={(e) => setCalcHours(Number(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Weekend Prime Slot?</label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={calcIsWeekend}
                onChange={(e) => setCalcIsWeekend(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500/20 accent-emerald-600"
              />
              <span className="text-xs text-slate-600 font-semibold">Saturday / Sunday (+20%)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Night Floodlight Slot?</label>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={calcIsNight}
                onChange={(e) => setCalcIsNight(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500/20 accent-emerald-600"
              />
              <span className="text-xs text-slate-600 font-semibold">After 07:00 PM (+₹300/hr)</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Estimated Match Price
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              ₹{calculatedEstimatedPrice.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Base: ₹{(calcBaseRate * calcHours).toLocaleString()} • Adjustments: ₹
            {(calculatedEstimatedPrice - calcBaseRate * calcHours).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
