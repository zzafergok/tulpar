import { toBCP47Locale } from '@/i18n/routing';

interface FormatPercentOptions {
  decimals?: number;
  locale?: string;
  clamp?: boolean;
  suffix?: boolean;
  fallback?: string;
  min?: number;
  max?: number;
  useGrouping?: boolean;
  showPositiveSign?: boolean;
}

export function formatPercent(
  value: number,
  options: FormatPercentOptions = {},
): string {
  const {
    decimals = 2,
    clamp = true,
    suffix = false,
    fallback,
    min,
    max,
    useGrouping = false,
    showPositiveSign = false,
  } = options;
  const locale = toBCP47Locale(options.locale);

  if (!Number.isFinite(value)) {
    if (fallback !== undefined) return fallback;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(0);
  }

  let processedValue = clamp ? Math.max(0, Math.min(100, value)) : value;

  if (min !== undefined && processedValue > 0 && processedValue < min) {
    const formattedMin = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(min);
    return `<${formattedMin}${suffix ? '%' : ''}`;
  }

  if (max !== undefined && processedValue > max) {
    const formattedMax = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(max);
    return `>${formattedMax}${suffix ? '%' : ''}`;
  }

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping,
    signDisplay: showPositiveSign ? 'exceptZero' : 'auto',
  }).format(processedValue);
  return suffix ? `${formatted}%` : formatted;
}

interface FormatCurrencyOptions {
  decimals?: number | 'auto';
  locale?: string;
  currency?: string;
  symbol?: boolean;
  compact?: boolean;
  fallback?: string;
  scientific?: boolean;
  min?: number;
  showPositiveSign?: boolean;
}

export function formatCurrency(
  value: number,
  options: FormatCurrencyOptions = {},
): string {
  const {
    decimals = 2,
    currency = 'TRY',
    symbol = true,
    compact = false,
    fallback,
    scientific = false,
    min,
    showPositiveSign = false,
  } = options;
  const locale = toBCP47Locale(options.locale);

  if (!Number.isFinite(value)) {
    if (fallback !== undefined) return fallback;
    return symbol
      ? new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(0)
      : '0,00';
  }

  if (min !== undefined && value > 0 && value < min) {
    return `<${formatCurrency(min, { ...options, min: undefined })}`;
  }

  if (scientific && Math.abs(value) > 0 && Math.abs(value) < 0.0001) {
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exponent);
    const superscriptMap: Record<string, string> = {
      '0': '⁰',
      '1': '¹',
      '2': '²',
      '3': '³',
      '4': '⁴',
      '5': '⁵',
      '6': '⁶',
      '7': '⁷',
      '8': '⁸',
      '9': '⁹',
      '-': '⁻',
    };
    const superscriptExp = String(exponent)
      .split('')
      .map((character) => superscriptMap[character] || character)
      .join('');
    return `${symbol ? '₺' : ''}${mantissa.toFixed(2)}×10${superscriptExp}`;
  }

  const decimalPlaces = decimals === 'auto' ? 2 : decimals;

  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat(locale, {
      style: symbol ? 'currency' : 'decimal',
      currency: symbol ? currency : undefined,
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: showPositiveSign ? 'exceptZero' : 'auto',
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    style: symbol ? 'currency' : 'decimal',
    currency: symbol ? currency : undefined,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    signDisplay: showPositiveSign ? 'exceptZero' : 'auto',
  }).format(value);
}

interface FormatDurationOptions {
  unit?: 'milliseconds' | 'seconds' | 'hours';
  decimals?: number;
  suffix?: boolean;
  locale?: string;
  fallback?: string;
  compact?: boolean;
}

export function formatDuration(
  value: number,
  options: FormatDurationOptions = {},
): string {
  const {
    unit = 'milliseconds',
    decimals = 1,
    suffix = true,
    locale = 'tr-TR',
    fallback,
    compact = false,
  } = options;

  if (!Number.isFinite(value)) {
    if (fallback !== undefined) return fallback;
    return suffix ? '0s' : '0';
  }

  const seconds =
    unit === 'milliseconds'
      ? value / 1000
      : unit === 'hours'
        ? value * 3600
        : value;
  let outputValue = unit === 'milliseconds' ? seconds : value;
  let unitSuffix = unit === 'hours' ? 'h' : 's';

  if (compact) {
    if (seconds >= 3600) {
      outputValue = seconds / 3600;
      unitSuffix = 'h';
    } else if (seconds >= 60) {
      outputValue = seconds / 60;
      unitSuffix = 'm';
    } else {
      outputValue = seconds;
      unitSuffix = 's';
    }
  }

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(outputValue);
  return suffix ? `${formatted}${unitSuffix}` : formatted;
}

export function roundTo(value: number, decimals: number = 2): number {
  if (!Number.isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Formats a raw number or string value into Turkish currency input format.
 * Examples:
 *   1123 -> "1.123"
 *   1123.12 or "1123.12" or "1123,12" -> "1.123,12"
 *   1111123.5 -> "1.111.123,5"
 */
export function formatAmountInput(
  value: string | number | undefined | null,
): string {
  if (value === undefined || value === null || value === '') return '';

  const rawStr = String(value).trim();
  if (!rawStr) return '';

  // If string contains comma, split by comma; replace dots
  const hasComma = rawStr.includes(',');
  const hasDot = rawStr.includes('.');

  // If it's a JS number string like "1123.12" (without comma)
  let normalized = rawStr;
  if (!hasComma && hasDot) {
    // Check if dot is a decimal point or thousand separator
    const parts = rawStr.split('.');
    if (parts.length === 2 && parts[1].length <= 2) {
      normalized = `${parts[0]},${parts[1]}`;
    } else {
      normalized = rawStr.replace(/\./g, '');
    }
  }

  // Trailing comma/dot check (user typing "123,")
  const hasTrailingSeparator = rawStr.endsWith(',') || rawStr.endsWith('.');

  const cleanIntStr = normalized.split(',')[0].replace(/[^0-9]/g, '');
  const decStr = normalized.split(',')[1];

  if (!cleanIntStr && decStr === undefined) return '';

  const intNum = cleanIntStr ? BigInt(cleanIntStr) : BigInt(0);
  const intFormatted = new Intl.NumberFormat('tr-TR', {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(intNum);

  if (decStr !== undefined) {
    const cleanDec = decStr.replace(/[^0-9]/g, '').slice(0, 2);
    return `${intFormatted},${cleanDec}`;
  }

  if (hasTrailingSeparator) {
    return `${intFormatted},`;
  }

  return intFormatted;
}

/**
 * Parses a Turkish formatted currency string back to a numeric float value.
 * Examples:
 *   "1.123,12" -> 1123.12
 *   "1.111.123,5" -> 1111123.5
 *   "1.123" -> 1123
 */
export function parseAmountInput(
  formattedValue: string | number | undefined | null,
): number {
  if (
    formattedValue === undefined ||
    formattedValue === null ||
    formattedValue === ''
  )
    return 0;
  if (typeof formattedValue === 'number')
    return Number.isFinite(formattedValue) ? formattedValue : 0;

  const raw = String(formattedValue)
    .trim()
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}
