'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Users, Lock, Shield, ChevronDown, Check } from 'lucide-react';

export type PrivacyValue = 'all' | 'public' | 'friends' | 'private';

interface PrivacyOption {
  value: PrivacyValue;
  label: string;
  icon: any;
  colorClass: string;
}

const PRIVACY_OPTIONS: PrivacyOption[] = [
  { value: 'all', label: 'All Privacy', icon: Shield, colorClass: 'text-gray-500' },
  { value: 'public', label: 'Public Only', icon: Globe, colorClass: 'text-green-600' },
  { value: 'friends', label: 'Friends Only', icon: Users, colorClass: 'text-blue-500' },
  { value: 'private', label: 'Private Only', icon: Lock, colorClass: 'text-rose-500' },
];

interface CustomPrivacyDropdownProps {
  value: PrivacyValue;
  onChange: (value: PrivacyValue) => void;
}

export default function CustomPrivacyDropdown({ value, onChange }: CustomPrivacyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption = PRIVACY_OPTIONS.find(opt => opt.value === value) || PRIVACY_OPTIONS[0];
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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold transition-all shadow-sm ${
          value !== 'all'
            ? 'border-yellow-500 bg-yellow-50/50 text-gray-900 ring-2 ring-yellow-500/20'
            : 'border-gray-200 text-gray-800 hover:bg-gray-100'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <ActiveIcon size={16} className={`${activeOption.colorClass} shrink-0`} />
          <span className="truncate">{activeOption.label}</span>
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-48 bg-white rounded-2xl p-1.5 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-150">
          {PRIVACY_OPTIONS.map((option) => {
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                  isSelected 
                    ? 'bg-yellow-50 text-gray-900 font-extrabold' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={15} className={option.colorClass} />
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
