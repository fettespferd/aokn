import {
  FileText,
  Baby,
  Search,
  HeartHandshake,
  Phone,
  BadgePlus,
  HousePlus,
  ShieldPlus,
  BookOpen,
  CircleHelp,
  Home,
  FileEdit,
  Settings,
  ChevronLeft,
  MoreVertical,
  Share2,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react';

export const AVAILABLE_ICONS = [
  'FileText',
  'Baby',
  'Search',
  'HeartHandshake',
  'Phone',
  'BadgePlus',
  'HousePlus',
  'ShieldPlus',
  'BookOpen',
  'CircleHelp',
] as const;

export type IconName = (typeof AVAILABLE_ICONS)[number];

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Baby,
  Search,
  HeartHandshake,
  Phone,
  BadgePlus,
  HousePlus,
  ShieldPlus,
  BookOpen,
  CircleHelp,
  Home,
  FileEdit,
  Settings,
  ChevronLeft,
  MoreVertical,
  Share2,
  ChevronUp,
};

export function getIconComponent(name: string): LucideIcon {
  const Icon = ICON_MAP[name];
  return Icon ?? FileText;
}

export function isValidIconName(name: string): name is IconName {
  return AVAILABLE_ICONS.includes(name as IconName);
}
