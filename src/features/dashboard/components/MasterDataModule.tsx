import React, { useState } from 'react';
import type { City, Category, Amenity } from '../../../types/schema.types';
import { MOCK_CITIES, MOCK_CATEGORIES, MOCK_AMENITIES } from '../../../data/mockData';
import { Globe, Layers, Sparkles, MapPin, Plus, Check } from 'lucide-react';

export const MasterDataModule: React.FC = () => {
  const [cities, setCities] = useState<City[]>(MOCK_CITIES);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [amenities] = useState<Amenity[]>(MOCK_AMENITIES);
  const [newCityName, setNewCityName] = useState('');
  const [newState, setNewState] = useState('');
  const [showAddCityModal, setShowAddCityModal] = useState(false);

  const toggleCityStatus = (id: string) => {
    setCities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, isActive: !cat.isActive } : cat))
    );
  };

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName || !newState) return;
    const created: City = {
      id: `c-${cities.length + 1}`,
      cityName: newCityName,
      state: newState,
      country: 'India',
      latitude: 19.0,
      longitude: 72.8,
      isActive: true,
      venueCount: 0,
    };
    setCities([...cities, created]);
    setNewCityName('');
    setNewState('');
    setShowAddCityModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Master Reference Data</h2>
          <p className="text-xs text-slate-500 mt-1">Configure platform supported cities, sports categories, and court amenities</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddCityModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md w-fit"
        >
          <Plus size={16} /> Add City
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-55 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="text-slate-500" size={18} />
            <h3 className="font-bold text-slate-900 text-sm">Supported Operating Cities</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">cities ({cities.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">City Name & State</th>
                <th className="px-5 py-3.5">Country</th>
                <th className="px-5 py-3.5">Centroid Lat/Long</th>
                <th className="px-5 py-3.5">Venues</th>
                <th className="px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {cities.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-500">{c.id}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-600 shrink-0" />
                    <div>
                      <div>{c.cityName}</div>
                      <div className="text-xs text-slate-400 font-normal">{c.state}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">{c.country}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{c.latitude}, {c.longitude}</td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700">{c.venueCount} Venues</td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleCityStatus(c.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                        c.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-red-50 hover:text-red-750'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-emerald-50 hover:text-emerald-750'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="text-slate-500" size={16} />
            <h3 className="font-bold text-slate-900 text-sm">Sports Categories</h3>
          </div>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <div className="font-bold text-slate-900">{cat.categoryName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {cat.id}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCategoryStatus(cat.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer ${
                    cat.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-200 text-slate-400 border-slate-300'
                  }`}
                >
                  {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="text-slate-500" size={16} />
            <h3 className="font-bold text-slate-900 text-sm">Court Amenities</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {amenities.map((am) => (
              <div key={am.id} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {am.amenityName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddCityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Supported City</h3>
              <button type="button" className="text-slate-400 hover:text-slate-650" onClick={() => setShowAddCityModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddCity} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">City Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Pune"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-emerald-500 text-xs"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">State *</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-emerald-500 text-xs"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer" onClick={() => setShowAddCityModal(false)}>Cancel</button>
                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"><Check size={14} /> Add City</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
