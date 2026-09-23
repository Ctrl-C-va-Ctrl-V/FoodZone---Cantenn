import React from 'react';
import {
  GraduationCap,
  ChefHat,
  ShieldCheck,
  IdCard,
  Building,
  LogOut,
  Wallet,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';

export const UserProfileBanner: React.FC = () => {
  const { currentUser, setActiveView, logout } = useCanteen();

  const roleConfigs = {
    student: {
      badge: 'Sinh Viên / Học Sinh',
      bgColor: 'bg-emerald-500',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <GraduationCap className="w-4 h-4" />,
      extraLabel: 'Lớp:',
      extraValue: currentUser.classroom || 'CNTT K65',
      idLabel: 'MSSV:',
      specialBtn: 'Lịch sử & Đánh giá',
      specialView: 'orders',
    },
    staff: {
      badge: 'Cán Bộ / Nhân Viên Bếp',
      bgColor: 'bg-amber-500',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <ChefHat className="w-4 h-4" />,
      extraLabel: 'Phân ban:',
      extraValue: currentUser.department || 'Tổ Chế Biến & Bếp Căn Tin A2',
      idLabel: 'Mã NV:',
      specialBtn: 'Khu vực bếp',
      specialView: 'kitchen',
    },
    admin: {
      badge: 'Quản Trị Viên (Super Admin)',
      bgColor: 'bg-purple-600',
      tagColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: <ShieldCheck className="w-4 h-4" />,
      extraLabel: 'Bộ phận:',
      extraValue: currentUser.department || 'Ban Quản Lý & Vận Hành',
      idLabel: 'Mã Admin:',
      specialBtn: 'Báo cáo doanh thu',
      specialView: 'analytics',
    },
  };

  const config = roleConfigs[currentUser.role];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        {/* Avatar with role badge */}
        <div className="relative shrink-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
          />
          <span
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-xs ${config.bgColor}`}
          >
            {currentUser.role === 'student' ? 'Học sinh' : currentUser.role === 'staff' ? 'Nhân viên' : 'Quản lý'}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Chào mừng, <span className="text-orange-600">{currentUser.name}</span>!
            </h2>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${config.tagColor}`}
            >
              {config.icon}
              {config.badge}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-slate-500 pt-1">
            {currentUser.schoolId && (
              <span className="flex items-center gap-1">
                <span className="font-bold text-slate-700">{config.idLabel}</span>
                <span className="font-mono font-bold text-slate-900">{currentUser.schoolId}</span>
              </span>
            )}
            <span>•</span>
            <span>
              <span className="font-bold text-slate-700">{config.extraLabel}</span>{' '}
              <span className="text-slate-800">{config.extraValue}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <Wallet className="w-3.5 h-3.5" /> Ví CanteenPay: 250.000đ
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Cơ sở dữ liệu: Firestore Cloud
            </span>
          </div>
        </div>
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => setActiveView(config.specialView)}
          className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          {config.specialBtn}
        </button>
        <button
          onClick={logout}
          className="px-3.5 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border border-slate-200"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          Đăng Xuất
        </button>
      </div>
    </div>
  );
};
