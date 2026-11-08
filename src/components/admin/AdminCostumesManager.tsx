/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCommunityData } from '../../context/CommunityDataContext';
import { CostumeItem } from '../../types';
import DirectImageUploader from '../DirectImageUploader';
import { resolveAssetUrl } from '../../services/storagePersistence';
import { Plus, Edit3, Trash2, Shirt, Tag, Check, Sparkles, Search, CheckCircle } from 'lucide-react';

export default function AdminCostumesManager() {
  const { costumes, addCostume, updateCostume, deleteCostume } = useCommunityData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWearerFilter, setSelectedWearerFilter] = useState<'all' | 'men' | 'women' | 'both'>('all');
  const [editingCostume, setEditingCostume] = useState<CostumeItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [accessoryInput, setAccessoryInput] = useState('');

  const filteredCostumes = costumes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameNepali.includes(searchQuery) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWearer = selectedWearerFilter === 'all' || c.wearer === selectedWearerFilter || c.wearer === 'both';
    return matchesSearch && matchesWearer;
  });

  const emptyCostume: Omit<CostumeItem, 'id'> = {
    name: '',
    nameNepali: '',
    category: 'ceremonial',
    wearer: 'both',
    fabric: 'Hand-woven Indigenous Cotton',
    description: '',
    culturalSignificance: '',
    image: '/favicon.svg',
    accessories: []
  };

  const [formData, setFormData] = useState<Omit<CostumeItem, 'id'>>(emptyCostume);

  const handleOpenAdd = () => {
    setFormData(emptyCostume);
    setEditingCostume(null);
    setIsAddingNew(true);
  };

  const handleOpenEdit = (item: CostumeItem) => {
    setEditingCostume(item);
    setFormData({
      name: item.name,
      nameNepali: item.nameNepali,
      category: item.category,
      wearer: item.wearer,
      fabric: item.fabric,
      description: item.description,
      culturalSignificance: item.culturalSignificance,
      image: item.image,
      accessories: [...(item.accessories || [])]
    });
    setIsAddingNew(false);
  };

  const handleAddAccessory = () => {
    if (!accessoryInput.trim()) return;
    const clean = accessoryInput.trim();
    if (!formData.accessories?.includes(clean)) {
      setFormData((prev) => ({
        ...prev,
        accessories: [...(prev.accessories || []), clean]
      }));
    }
    setAccessoryInput('');
  };

  const handleRemoveAccessory = (acc: string) => {
    setFormData((prev) => ({
      ...prev,
      accessories: prev.accessories?.filter((a) => a !== acc) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCostume) {
      updateCostume(editingCostume.id, formData);
      setEditingCostume(null);
    } else {
      addCostume(formData);
      setIsAddingNew(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-[#DC143C]" />
            <h2 className="text-xl font-black text-slate-900 font-poppins">
              Bote Traditional Costumes &amp; Attire Management
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Add and update full traditional costumes, festival regalia, riverman attire, and ceremonial fabrics.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#DC143C] hover:bg-[#b51031] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Costume</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search costumes, fabrics, rituals..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:border-[#DC143C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedWearerFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedWearerFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Costumes ({costumes.length})
          </button>
          <button
            onClick={() => setSelectedWearerFilter('women')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedWearerFilter === 'women'
                ? 'bg-[#DC143C] text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Women's Costumes
          </button>
          <button
            onClick={() => setSelectedWearerFilter('men')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedWearerFilter === 'men'
                ? 'bg-[#003893] text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Men's River Dress
          </button>
        </div>
      </div>

      {/* Costumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCostumes.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-4"
          >
            <div className="space-y-3">
              <div className="h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={resolveAssetUrl(c.image && c.image.trim() && !c.image.includes('images.unsplash.com') ? c.image.trim() : '/favicon.svg')}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  {c.category}
                </span>
                <span className="absolute top-2 right-2 bg-white/90 text-[#003893] text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {c.wearer}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">{c.name}</h3>
                <p className="text-xs font-semibold text-[#DC143C]">{c.nameNepali}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Fabric: {c.fabric}</p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3">{c.description}</p>

              {c.accessories && c.accessories.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {c.accessories.map((acc, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
                      {acc}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Live on Website
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 text-slate-600 hover:text-[#003893] hover:bg-blue-50 rounded-xl transition cursor-pointer"
                  title="Edit Costume"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteCostume(c.id);
                  }}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  title="Delete Costume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(isAddingNew || editingCostume) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 font-poppins flex items-center gap-2">
                <Shirt className="w-5 h-5 text-[#DC143C]" />
                <span>{editingCostume ? 'Edit Costume & Attire' : 'Add New Bote Costume'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingCostume(null);
                }}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Costume Name (English)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Traditional Riverman Kachhad & Waistcoat"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name in Nepali (पोसाकको नाम)</label>
                  <input
                    type="text"
                    value={formData.nameNepali}
                    onChange={(e) => setFormData({ ...formData, nameNepali: e.target.value })}
                    required
                    placeholder="e.g. बोटे परम्परागत कछाड तथा इस्टकोट"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wearer / Gender</label>
                  <select
                    value={formData.wearer}
                    onChange={(e) => setFormData({ ...formData, wearer: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="both">Universal / Both (सबै)</option>
                    <option value="women">Women (महिला)</option>
                    <option value="men">Men (पुरुष)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Costume Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="daily">Daily River / Wading</option>
                    <option value="ceremonial">Ceremonial / Ritual</option>
                    <option value="dance">Dance &amp; Musical (Gholeni)</option>
                    <option value="fishing">River Fishing &amp; Boating</option>
                    <option value="wedding">Wedding / Festive</option>
                    <option value="youth-council">Youth Council Official</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fabric &amp; Loom Material</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. Coarse Handspun River Cotton, Indigo Herbal Dye"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <DirectImageUploader
                    id="costume-photo-uploader"
                    label="Costume Photograph (Upload from Device or paste URL)"
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    aspectRatio="square"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description &amp; Wear Style</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Describe how the costume is worn, knee wrap technique, waist sash..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cultural Significance &amp; Water Rites</label>
                  <textarea
                    rows={2}
                    value={formData.culturalSignificance}
                    onChange={(e) => setFormData({ ...formData, culturalSignificance: e.target.value })}
                    placeholder="Worn during Jal Puja river deities worship, canoe races..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                {/* Accessories Tags */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Paired Accessories &amp; Ornaments</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={accessoryInput}
                      onChange={(e) => setAccessoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAccessory();
                        }
                      }}
                      placeholder="e.g. Hansuli Necklace, Bamboo Fishing Basket, Turbans..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddAccessory}
                      className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.accessories?.map((acc) => (
                      <span
                        key={acc}
                        className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                      >
                        <span>{acc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAccessory(acc)}
                          className="text-blue-500 hover:text-red-600 font-bold"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingCostume(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#DC143C] hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCostume ? 'Update Costume' : 'Save Costume'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
