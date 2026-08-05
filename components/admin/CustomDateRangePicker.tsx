'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Check, Clock } from 'lucide-react';

interface DateRangePickerProps {
  datePreset: 'all' | 'today' | '7days' | '30days' | 'custom';
  fromDate: string; // YYYY-MM-DD
  toDate: string;   // YYYY-MM-DD
  onChange: (preset: 'all' | 'today' | '7days' | '30days' | 'custom', from: string, to: string) => void;
  align?: 'left' | 'right';
}

export default function CustomDateRangePicker({ datePreset, fromDate, toDate, onChange, align = 'right' }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [tempFrom, setTempFrom] = useState(fromDate);
  const [tempTo, setTempTo] = useState(toDate);
  const [tempPreset, setTempPreset] = useState(datePreset);

  // Sync state when props change
  useEffect(() => {
    setTempFrom(fromDate);
    setTempTo(toDate);
    setTempPreset(datePreset);
  }, [fromDate, toDate, datePreset]);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const todayObj = new Date();
  const todayYear = todayObj.getFullYear();
  const todayMonth = todayObj.getMonth();
  const todayStr = `${todayYear}-${String(todayMonth + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  const currentYear = currentMonth.getFullYear();
  const currentM = currentMonth.getMonth();
  const isNextMonthDisabled = currentYear > todayYear || (currentYear === todayYear && currentM >= todayMonth);

  const handleNextMonth = () => {
    if (isNextMonthDisabled) return;
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Quick preset click handler
  const handlePresetSelect = (preset: 'all' | 'today' | '7days' | '30days' | 'custom') => {
    setTempPreset(preset);

    if (preset === 'all') {
      setTempFrom('');
      setTempTo('');
      onChange('all', '', '');
      setIsOpen(false);
    } else if (preset === 'today') {
      setTempFrom(todayStr);
      setTempTo(todayStr);
      onChange('today', todayStr, todayStr);
      setIsOpen(false);
    } else if (preset === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      const yearS = d.getFullYear();
      const monthS = String(d.getMonth() + 1).padStart(2, '0');
      const dayS = String(d.getDate()).padStart(2, '0');
      const fromStr = `${yearS}-${monthS}-${dayS}`;

      setTempFrom(fromStr);
      setTempTo(todayStr);
      onChange('7days', fromStr, todayStr);
      setIsOpen(false);
    } else if (preset === '30days') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      const yearS = d.getFullYear();
      const monthS = String(d.getMonth() + 1).padStart(2, '0');
      const dayS = String(d.getDate()).padStart(2, '0');
      const fromStr = `${yearS}-${monthS}-${dayS}`;

      setTempFrom(fromStr);
      setTempTo(todayStr);
      onChange('30days', fromStr, todayStr);
      setIsOpen(false);
    }
  };

  // Calendar day click handler
  const handleDateClick = (dateStr: string) => {
    if (dateStr > todayStr) return; // Prevent selecting future dates

    setTempPreset('custom');
    if (!tempFrom || (tempFrom && tempTo)) {
      setTempFrom(dateStr);
      setTempTo('');
    } else if (tempFrom && !tempTo) {
      if (dateStr < tempFrom) {
        setTempFrom(dateStr);
        setTempTo('');
      } else {
        setTempTo(dateStr);
      }
    }
  };

  const applyCustomRange = () => {
    onChange('custom', tempFrom, tempTo || tempFrom);
    setIsOpen(false);
  };

  // Helper to format date display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Generate calendar grid dates
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

  // Previous month trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthDays - i);
    calendarDays.push({
      dateStr: prevDate.toISOString().split('T')[0],
      dayNum: prevMonthDays - i,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    // Format YYYY-MM-DD accurately in local time
    const yearStr = dateObj.getFullYear();
    const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dayStr = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;

    calendarDays.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to fill grid (6 rows = 42 slots)
  const remainingSlots = 42 - calendarDays.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateStr = nextDate.toISOString().split('T')[0];
    calendarDays.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: false,
    });
  }

  // Label for trigger button
  const getButtonLabel = () => {
    if (datePreset === 'all') return 'All Time';
    if (datePreset === 'today') return 'Today';
    if (datePreset === '7days') return 'Last 7 Days';
    if (datePreset === '30days') return 'Last 30 Days';
    if (fromDate && toDate) return `${formatDateDisplay(fromDate)} - ${formatDateDisplay(toDate)}`;
    if (fromDate) return `From ${formatDateDisplay(fromDate)}`;
    return 'Custom Range';
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold transition-all shadow-sm ${
          datePreset !== 'all'
            ? 'border-yellow-500 bg-yellow-50/50 text-gray-900 ring-2 ring-yellow-500/20'
            : 'border-gray-200 text-gray-800 hover:bg-gray-100'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <Calendar size={16} className="text-yellow-600 shrink-0" />
          <span className="truncate">{getButtonLabel()}</span>
        </span>
        <ChevronRight size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-2 z-50 w-80 sm:w-96 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200`}>
          {/* Preset Buttons Header */}
          <div className="flex items-center gap-1.5 flex-wrap pb-3 mb-3 border-b border-gray-100">
            <button
              onClick={() => handlePresetSelect('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                tempPreset === 'all' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => handlePresetSelect('today')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                tempPreset === 'today' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handlePresetSelect('7days')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                tempPreset === '7days' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => handlePresetSelect('30days')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                tempPreset === '30days' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTempPreset('custom')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                tempPreset === 'custom' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-extrabold text-sm text-gray-900">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={isNextMonthDisabled}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <span key={day} className="text-[11px] font-bold text-gray-400">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, idx) => {
              const isFuture = item.dateStr > todayStr;
              const isSelectedFrom = tempFrom === item.dateStr;
              const isSelectedTo = tempTo === item.dateStr;
              const isInRange = tempFrom && tempTo && item.dateStr >= tempFrom && item.dateStr <= tempTo;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isFuture}
                  onClick={() => !isFuture && handleDateClick(item.dateStr)}
                  className={`h-8 w-full rounded-lg text-xs font-bold transition flex items-center justify-center ${
                    isFuture
                      ? 'text-gray-300 opacity-25 cursor-not-allowed pointer-events-none'
                      : !item.isCurrentMonth
                      ? 'text-gray-400 hover:bg-gray-100'
                      : 'text-gray-800 hover:bg-yellow-100'
                  } ${
                    isSelectedFrom || isSelectedTo
                      ? 'bg-yellow-500 text-gray-900 shadow-md font-black'
                      : isInRange
                      ? 'bg-yellow-100 text-yellow-900 rounded-none'
                      : ''
                  }`}
                >
                  {item.dayNum}
                </button>
              );
            })}
          </div>

          {/* Range Summary & Apply Footer */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="text-[11px] font-medium text-gray-500">
              {tempFrom ? (
                <span>
                  {formatDateDisplay(tempFrom)} {tempTo ? ` - ${formatDateDisplay(tempTo)}` : '(Select End)'}
                </span>
              ) : (
                'Select start & end date'
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCustomRange}
                disabled={!tempFrom}
                className="px-3 py-1.5 bg-yellow-500 text-gray-900 hover:bg-yellow-600 rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-1"
              >
                <Check size={14} /> Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
