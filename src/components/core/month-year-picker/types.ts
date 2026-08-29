export interface MonthYearPickerProps {
  value?: string; // Format: "YYYY-MM"
  error?: boolean;
  minDate?: string; // Format: "YYYY-MM"
  maxDate?: string; // Format: "YYYY-MM"
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
  placeholder?: string;
  onChange: (value: string | null) => void;
}

export interface QuickDateItem {
  label: string;
  getValue: () => string;
}
