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
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Master Reference Data</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure platform supported cities, sports categories, and court amenities</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddCityModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm w-fit"
        >
          <Plus size={16} /> Add City
        </button>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="text-gray-500 dark:text-gray-400" size={18} />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Supported Operating Cities</h3>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono tracking-wider">cities ({cities.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">City Name & State</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Centroid Lat/Long</th>
                <th className="px-6 py-4">Venues</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-sm">
              {cities.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{c.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{c.cityName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">{c.state}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{c.country}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{c.latitude}, {c.longitude}</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">{c.venueCount} <span className="text-gray-500 dark:text-gray-400 font-normal">Venues</span></td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleCityStatus(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                        c.isActive
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30'
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30'
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <Layers className="text-gray-500 dark:text-gray-400" size={18} />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">Sports Categories</h3>
          </div>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 text-sm hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{cat.categoryName}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono uppercase tracking-wider mt-0.5">ID: {cat.id}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCategoryStatus(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border cursor-pointer transition-colors ${
                    cat.isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <Sparkles className="text-gray-500 dark:text-gray-400" size={18} />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">Court Amenities</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {amenities.map((am) => (
              <div key={am.id} className="px-3.5 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 shadow-xs hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                {am.amenityName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddCityModal && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Add Supported City</h3>
              <button type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" onClick={() => setShowAddCityModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddCity} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700 dark:text-gray-300 text-xs">City Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Pune"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  className="h-11 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700 dark:text-gray-300 text-xs">State *</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="h-11 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
                <button type="button" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold cursor-pointer transition-colors" onClick={() => setShowAddCityModal(false)}>Cancel</button>
                <button type="submit" className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"><Check size={14} /> Add City</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
