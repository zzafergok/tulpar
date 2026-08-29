'use client';

import React, { useState } from 'react';
import { DatePicker } from './date-picker';
import type { DateRange } from './types';

export function DatePickerExample() {
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [multipleDates, setMultipleDates] = useState<Date[]>([]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <label className="mb-2 block text-sm font-medium">Tek Tarih</label>
        <DatePicker
          mode="single"
          value={singleDate}
          onChange={(date) => setSingleDate(date as Date)}
          placeholder="Tarih seçin"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Tarih Aralığı</label>
        <DatePicker
          mode="range"
          value={dateRange}
          onChange={(range) => setDateRange(range as DateRange)}
          placeholder="Tarih aralığı seçin"
          enablePresets={true}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Çoklu Tarih</label>
        <DatePicker
          mode="multiple"
          value={multipleDates}
          onChange={(dates) => setMultipleDates(dates as Date[])}
          placeholder="Tarihleri seçin"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Tarih ve Saat</label>
        <DatePicker
          mode="single"
          enableTime={true}
          value={singleDate}
          onChange={(date) => setSingleDate(date as Date)}
          placeholder="Tarih ve saat seçin"
        />
      </div>
    </div>
  );
}
