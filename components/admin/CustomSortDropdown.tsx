'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Calendar, Clock, Eye, Heart, MessageCircle, 
  ChevronDown, Check, ArrowUpDown 
} from 'lucide-react';

export type SortOptionValue = 'createdAt:desc' | 'createdAt:asc' | 'views:desc' | 'likes:desc' | 'comments:desc';

interface SortOption {
  value: SortOptionValue;
  label: string;
  icon: any;
  colorClass: string;
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'createdAt:desc', label: 'Newest First', icon: Calendar, colorClass: 'text-yellow-600' },
  { value: 'createdAt:asc', label: 'Oldest First', icon: Clock, colorClass: 'text-gray-500' },
  { value: 'views:desc', label: 'Most Viewed', icon: Eye, colorClass: 'text-blue-500' },
  { value: 'likes:desc', label: 'Most Liked', icon: Heart, colorClass: 'text-rose-500' },
  { value: 'comments:desc', label: 'Most Commented', icon: MessageCircle, colorClass: 'text-amber-500' },
];

interface CustomSortDropdownProps {
  value: SortOptionValue;
  onChange: (value: SortOptionValue) => void;
}

export default function CustomSortDropdown({ value, onChange }: CustomSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];
  const ActiveIcon = activeOption.icon;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-100 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
      >
        <span className="flex items-center gap-2.5 truncate">
          <ActiveIcon size={16} className={`${activeOption.colorClass} shrink-0`} />
          <span className="truncate">{activeOption.label}</span>
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 w-56 bg-white rounded-2xl p-1.5 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[11px] font-bold text-gray-400 px-3 py-1.5 uppercase tracking-wider">
            Sort Videos By
          </div>
          {SORT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                  isSelected 
                    ? 'bg-yellow-50 text-gray-900 font-extrabold' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={16} className={option.colorClass} />
                  {option.label}
                </span>
                {isSelected && <Check size={14} className="text-yellow-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
