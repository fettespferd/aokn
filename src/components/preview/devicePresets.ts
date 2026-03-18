export interface DevicePreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

/** Gängige Geräte von klein nach groß sortiert */
export const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'iphone-se', label: 'iPhone SE', width: 375, height: 667 },
  { id: 'iphone-12-mini', label: 'iPhone 12 mini', width: 375, height: 812 },
  { id: 'iphone-13-14', label: 'iPhone 13/14', width: 390, height: 844 },
  { id: 'iphone-14-plus', label: 'iPhone 14 Plus', width: 428, height: 926 },
  { id: 'iphone-14-pro-max', label: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { id: 'iphone-15-pro-max', label: 'iPhone 15 Pro Max', width: 430, height: 932 },
  { id: 'pixel-5', label: 'Pixel 5', width: 393, height: 851 },
  { id: 'pixel-7', label: 'Pixel 7', width: 412, height: 915 },
  { id: 'galaxy-s21', label: 'Galaxy S21', width: 360, height: 800 },
  { id: 'galaxy-s23', label: 'Galaxy S23', width: 360, height: 780 },
  { id: 'galaxy-s24-ultra', label: 'Galaxy S24 Ultra', width: 412, height: 915 },
];
