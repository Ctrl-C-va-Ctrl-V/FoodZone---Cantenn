import React, { useState } from 'react';
import {
  Utensils,
  ShoppingBag,
  User,
  ShieldCheck,
  ChefHat,
  GraduationCap,
  Bell,
  Clock,
  ChevronDown,
  Sparkles,
  LogOut,
  Star,
} from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';
import { Role } from '../types';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { currentUser, logout, cart, activeView, setActiveView, unreadOrdersCount } = useCanteen();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const roleLabels: Record<Role, { title: string; badge: string; icon: React.ReactNode; color: string }> = {
    student: {
      title: 'Học Sinh / Sinh Viên',
      badge: 'Sinh Viên',
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    staff: {
      title: 'Nhân Viên Căn Tin & Bếp',
      badge: 'Bếp & Phục Vụ',
      icon: <ChefHat className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    admin: {
      title: 'Quản Trị Viên / Quản Lý',
      badge: 'Quản Lý',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  };

  const currentRoleInfo = roleLabels[currentUser.role];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white text-xs py-1 px-4 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 container mx-auto">
          <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
            <Clock className="w-3 h-3" /> 06:30 - 21:00
          </span>
          <span className="truncate hidden md:inline">
            Căn tin Học Viện Phụ Nữ Việt Nam • Nấu nóng sốt mỗi ngày, giao nhanh chỉ 10 phút!
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Cloud Firestore Đang Đồng Bộ</span>
            </span>
            <span className="text-[11px] opacity-90 hidden sm:inline-block">
              Vai trò: <strong className="text-white font-black">{currentRoleInfo.title}</strong>
            </span>
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/30 active:scale-95 text-white px-2.5 py-0.5 rounded text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1 transition"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3 h-3" /> Đăng Xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => {
            if (currentUser.role === 'student') setActiveView('menu');
            else if (currentUser.role === 'staff') setActiveView('kitchen');
            else setActiveView('analytics');
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              FOOD<span className="text-orange-600">ZONE</span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
              Căn Tin Học Đường
            </div>
          </div>
        </div>

        {/* Dynamic Navigation according to Role */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {currentUser.role === 'student' && (
            <>
              <button
                onClick={() => setActiveView('menu')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeView === 'menu'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                🍽️ Thực Đơn
              </button>
              <button
                onClick={() => setActiveView('combos')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'combos'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Combo Tiết Kiệm
              </button>
              <button
                onClick={() => setActiveView('orders')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeView === 'orders'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                📋 Lịch Sử Đặt & Đánh Giá
              </button>
            </>
          )}

          {currentUser.role === 'staff' && (
            <>
              <button
                onClick={() => setActiveView('kitchen')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer relative ${
                  activeView === 'kitchen'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                👨‍🍳 Bếp & Nhận Đơn Mới
                {unreadOrdersCount > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {unreadOrdersCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveView('stock')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeView === 'stock'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                ⚡ Cập Nhật Còn/Hết Món
              </button>
              <button
                onClick={() => setActiveView('orders')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeView === 'orders'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                📦 Tất Cả Đơn Hàng
              </button>
            </>
          )}

          {currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeView === 'analytics'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                📊 Báo Cáo Doanh Thu
              </button>
              <button
                onClick={() => setActiveView('reviews')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'reviews'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Điểm Đánh Giá Món
              </button>
              <button
                onClick={() => setActiveView('menu-management')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeView === 'menu-management'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                🍲 Quản Lý Thực Đơn
              </button>
              <button
                onClick={() => setActiveView('orders')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeView === 'orders'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                🧾 Quản Lý Đơn
              </button>
            </>
          )}
        </nav>

        {/* Right Actions: User + Cart + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Profile Badge */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-orange-200"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-semibold text-orange-600 flex items-center gap-1">
                  <span>{currentRoleInfo.badge}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setShowUserDropdown(false)}
              >
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl mb-3 border border-slate-100">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-orange-500 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 text-sm truncate">{currentUser.name}</div>
                    <div className="text-xs text-slate-500">
                      {currentUser.schoolId && <span className="font-mono font-semibold">Mã: {currentUser.schoolId}</span>}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${currentRoleInfo.color}`}>
                      {currentRoleInfo.icon}
                      {currentRoleInfo.title}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 px-2 py-1 space-y-1 bg-slate-50/50 rounded-xl mb-3 border border-slate-100">
                  {currentUser.classroom && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lớp:</span>
                      <span className="font-bold">{currentUser.classroom}</span>
                    </div>
                  )}
                  {currentUser.department && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bộ phận:</span>
                      <span className="font-bold">{currentUser.department}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số điện thoại:</span>
                    <span className="font-mono">{currentUser.phone}</span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-red-50 hover:bg-red-100 active:scale-98 text-red-700 rounded-xl text-xs font-bold transition cursor-pointer border border-red-200"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Đăng Xuất Tài Khoản</span>
                </button>
              </div>
            )}
          </div>

          {/* Cart Button (For students) */}
          {currentUser.role === 'student' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl shadow-md shadow-orange-500/20 font-bold text-xs sm:text-sm cursor-pointer transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Giỏ Hàng</span>
              {cartTotalItems > 0 && (
                <span className="bg-white text-orange-600 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartTotalItems}
                </span>
              )}
            </button>
          )}

          {/* Direct logout icon button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-700 overflow-x-auto">
        {currentUser.role === 'student' && (
          <>
            <button
              onClick={() => setActiveView('menu')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'menu' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              🍽️ Thực Đơn
            </button>
            <button
              onClick={() => setActiveView('combos')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'combos' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              🔥 Combo
            </button>
            <button
              onClick={() => setActiveView('orders')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'orders' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              📋 Đơn & Đánh Giá
            </button>
          </>
        )}

        {currentUser.role === 'staff' && (
          <>
            <button
              onClick={() => setActiveView('kitchen')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'kitchen' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              👨‍🍳 Bếp Nhận Đơn ({unreadOrdersCount})
            </button>
            <button
              onClick={() => setActiveView('stock')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'stock' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              ⚡ Bật/Tắt Món
            </button>
            <button
              onClick={() => setActiveView('orders')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'orders' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              📦 Danh Sách Đơn
            </button>
          </>
        )}

        {currentUser.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'analytics' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              📊 Doanh Thu
            </button>
            <button
              onClick={() => setActiveView('reviews')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'reviews' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              ⭐ Đánh Giá Món
            </button>
            <button
              onClick={() => setActiveView('menu-management')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'menu-management' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              🍲 Quản Lý Món
            </button>
            <button
              onClick={() => setActiveView('orders')}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                activeView === 'orders' ? 'bg-orange-600 text-white' : 'text-slate-600'
              }`}
            >
              🧾 Đơn Hàng
            </button>
          </>
        )}
      </div>
    </header>
  );
};
