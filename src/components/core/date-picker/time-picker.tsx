'use client';

import React from 'react';
import { Clock, Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/core/select';
import { timeZones } from './constants';

interface TimePickerProps {
  hours: number;
  minutes: number;
  enableTimezone?: boolean;
  selectedTimezone: string;
  onTimeChange: (hours: number, minutes: number) => void;
  onTimezoneChange: (timezone: string) => void;
}

export function TimePicker({
  hours,
  minutes,
  enableTimezone = false,
  selectedTimezone,
  onTimeChange,
  onTimezoneChange,
}: TimePickerProps) {
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i).filter(
    (minute) => minute % 5 === 0,
  );

  return (
    <div className="border-t border-gunmetal p-3">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-ash" />
        <span className="text-sm font-medium">Saat</span>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={hours.toString()}
          onValueChange={(value) => onTimeChange(parseInt(value, 10), minutes)}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.map((h) => (
              <SelectItem key={h} value={h.toString()}>
                {h.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-ash">:</span>

        <Select
          value={minutes.toString()}
          onValueChange={(value) => onTimeChange(hours, parseInt(value, 10))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {minuteOptions.map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {m.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {enableTimezone && (
        <div className="mt-3">
          <div className="mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-ash" />
            <span className="text-sm font-medium">Zaman Dilimi</span>
          </div>
          <Select
            value={selectedTimezone}
            onValueChange={onTimezoneChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
