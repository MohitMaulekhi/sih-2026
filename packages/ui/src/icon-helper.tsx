import React from 'react';
import {
  Wind,
  Sparkles,
  Zap,
  Droplets,
  Scissors,
  Smile,
  Wrench,
  Paintbrush,
  Clock,
  Star,
  Shield,
  MapPin,
  Check,
  CheckCircle2,
  XCircle,
  Calendar,
  Phone,
  AlertCircle,
  User,
  Briefcase,
  IndianRupee,
  Settings,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Home,
  Compass,
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  Banknote,
  QrCode,
  MessageSquare,
  Power,
  Radio,
  X,
  Flame,
  Award,
} from 'lucide-react-native';

export type IconName =
  | 'wind'
  | 'sparkles'
  | 'zap'
  | 'droplet'
  | 'droplets'
  | 'scissors'
  | 'smile'
  | 'tool'
  | 'wrench'
  | 'brush'
  | 'paintbrush'
  | 'clock'
  | 'star'
  | 'shield'
  | 'shield-check'
  | 'map-pin'
  | 'check'
  | 'check-circle'
  | 'x-circle'
  | 'calendar'
  | 'phone'
  | 'alert-circle'
  | 'user'
  | 'briefcase'
  | 'dollar'
  | 'rupee'
  | 'settings'
  | 'search'
  | 'filter'
  | 'chevron-right'
  | 'chevron-left'
  | 'arrow-right'
  | 'arrow-left'
  | 'refresh'
  | 'home'
  | 'compass'
  | 'dashboard'
  | 'clipboard'
  | 'cash'
  | 'upi'
  | 'message'
  | 'power'
  | 'radio'
  | 'close'
  | 'flame'
  | 'award';

interface IconProps {
  name: IconName | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const IconHelper: React.FC<IconProps> = ({
  name,
  size = 20,
  color = '#64748B',
  strokeWidth = 2,
}) => {
  switch (name) {
    case 'wind':
      return <Wind size={size} color={color} strokeWidth={strokeWidth} />;
    case 'sparkles':
      return <Sparkles size={size} color={color} strokeWidth={strokeWidth} />;
    case 'zap':
      return <Zap size={size} color={color} strokeWidth={strokeWidth} />;
    case 'droplet':
    case 'droplets':
      return <Droplets size={size} color={color} strokeWidth={strokeWidth} />;
    case 'scissors':
      return <Scissors size={size} color={color} strokeWidth={strokeWidth} />;
    case 'smile':
      return <Smile size={size} color={color} strokeWidth={strokeWidth} />;
    case 'tool':
    case 'wrench':
      return <Wrench size={size} color={color} strokeWidth={strokeWidth} />;
    case 'brush':
    case 'paintbrush':
      return <Paintbrush size={size} color={color} strokeWidth={strokeWidth} />;
    case 'clock':
      return <Clock size={size} color={color} strokeWidth={strokeWidth} />;
    case 'star':
      return <Star size={size} color={color} strokeWidth={strokeWidth} fill={color} />;
    case 'shield':
      return <Shield size={size} color={color} strokeWidth={strokeWidth} />;
    case 'shield-check':
      return <ShieldCheck size={size} color={color} strokeWidth={strokeWidth} />;
    case 'map-pin':
      return <MapPin size={size} color={color} strokeWidth={strokeWidth} />;
    case 'check':
      return <Check size={size} color={color} strokeWidth={strokeWidth} />;
    case 'check-circle':
      return <CheckCircle2 size={size} color={color} strokeWidth={strokeWidth} />;
    case 'x-circle':
      return <XCircle size={size} color={color} strokeWidth={strokeWidth} />;
    case 'calendar':
      return <Calendar size={size} color={color} strokeWidth={strokeWidth} />;
    case 'phone':
      return <Phone size={size} color={color} strokeWidth={strokeWidth} />;
    case 'alert-circle':
      return <AlertCircle size={size} color={color} strokeWidth={strokeWidth} />;
    case 'user':
      return <User size={size} color={color} strokeWidth={strokeWidth} />;
    case 'briefcase':
      return <Briefcase size={size} color={color} strokeWidth={strokeWidth} />;
    case 'dollar':
    case 'rupee':
      return <IndianRupee size={size} color={color} strokeWidth={strokeWidth} />;
    case 'settings':
      return <Settings size={size} color={color} strokeWidth={strokeWidth} />;
    case 'search':
      return <Search size={size} color={color} strokeWidth={strokeWidth} />;
    case 'filter':
      return <Filter size={size} color={color} strokeWidth={strokeWidth} />;
    case 'chevron-right':
      return <ChevronRight size={size} color={color} strokeWidth={strokeWidth} />;
    case 'chevron-left':
      return <ChevronLeft size={size} color={color} strokeWidth={strokeWidth} />;
    case 'arrow-right':
      return <ArrowRight size={size} color={color} strokeWidth={strokeWidth} />;
    case 'arrow-left':
      return <ArrowLeft size={size} color={color} strokeWidth={strokeWidth} />;
    case 'refresh':
      return <RefreshCw size={size} color={color} strokeWidth={strokeWidth} />;
    case 'home':
      return <Home size={size} color={color} strokeWidth={strokeWidth} />;
    case 'compass':
      return <Compass size={size} color={color} strokeWidth={strokeWidth} />;
    case 'dashboard':
      return <LayoutDashboard size={size} color={color} strokeWidth={strokeWidth} />;
    case 'clipboard':
      return <ClipboardList size={size} color={color} strokeWidth={strokeWidth} />;
    case 'cash':
      return <Banknote size={size} color={color} strokeWidth={strokeWidth} />;
    case 'upi':
      return <QrCode size={size} color={color} strokeWidth={strokeWidth} />;
    case 'message':
      return <MessageSquare size={size} color={color} strokeWidth={strokeWidth} />;
    case 'power':
      return <Power size={size} color={color} strokeWidth={strokeWidth} />;
    case 'radio':
      return <Radio size={size} color={color} strokeWidth={strokeWidth} />;
    case 'close':
      return <X size={size} color={color} strokeWidth={strokeWidth} />;
    case 'flame':
      return <Flame size={size} color={color} strokeWidth={strokeWidth} />;
    case 'award':
      return <Award size={size} color={color} strokeWidth={strokeWidth} />;
    default:
      return <Sparkles size={size} color={color} strokeWidth={strokeWidth} />;
  }
};
