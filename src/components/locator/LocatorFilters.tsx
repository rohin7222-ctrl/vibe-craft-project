'use client';

import React from 'react';
import { 
  Search, 
  Filter, 
  Snowflake, 
  LayoutGrid, 
  Building2,
  Compass,
  Layers, 
  TableProperties, 
  RotateCcw 
} from 'lucide-react';
import { DayOfWeek } from '@/data/roomData';

export type ViewMode = 'visual-map' | 'cards' | 'map' | 'floors' | 'matrix';
export type StatusFilter = 'all' | 'free' | 'occupied';
export type ACFilter = 'all' | 'ac' | 'non-ac';

interface LocatorFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  acFilter: ACFilter;
  setAcFilter: (filter: ACFilter) => void;
  floorFilter: string;
  setFloorFilter: (floor: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  availableFloors: string[];
  selectedDay?: DayOfWeek;
  setSelectedDay?: (day: DayOfWeek) => void;
  selectedPeriod?: number;
  setSelectedPeriod?: (p: number) => void;
}

export const LocatorFilters: React.FC<LocatorFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  acFilter,
  setAcFilter,
  floorFilter,
  setFloorFilter,
  viewMode,
  setViewMode,
  availableFloors,
}) => {
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAcFilter('all');
    setFloorFilter('all');
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-lg shadow-slate-100/50 mb-6 space-y-4">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Room Search, Attributes &amp; Layout Views
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Filter by floor, cooling, or switch layout
        </span>
      </div>

      {/* Search & Filter Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search room by name or floor (e.g. IST 227, IST 108 Lab, 2nd Floor)..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs font-bold rounded-2xl border border-slate-200/90 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-slate-200/90 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
          >
            <option value="all">All Statuses</option>
            <option value="free">🟢 Free Only</option>
            <option value="occupied">🔴 Occupied Only</option>
          </select>

          {/* AC Filter */}
          <select
            value={acFilter}
            onChange={e => setAcFilter(e.target.value as ACFilter)}
            className="px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-slate-200/90 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
          >
            <option value="all">❄️ All Rooms</option>
            <option value="ac">❄️ AC Rooms Only</option>
            <option value="non-ac">Non-AC Only</option>
          </select>

          {/* Floor Filter */}
          <select
            value={floorFilter}
            onChange={e => setFloorFilter(e.target.value)}
            className="px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-slate-200/90 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
          >
            <option value="all">🏢 All Floors</option>
            {availableFloors.map(floor => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetFilters}
            title="Reset Filters"
            className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* View Toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('visual-map')}
              title="Interactive Visual Building Map (Floor Plan Grid)"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'visual-map'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              title="Cards Grid View"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              title="Campus Elevation Map"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('floors')}
              title="Floor Grouped View"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'floors'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              title="Master Matrix View"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
