import React from 'react';
import { Utensils, MapPin, Phone, Mail, Clock, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800 text-xs sm:text-sm">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-lg">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                FOOD<span className="text-orange-500">ZONE</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hệ thống Căn tin học đường trực tuyến hiện đại. Cung cấp bữa ăn dinh dưỡng, nóng sốt, giá rẻ và thanh toán tiện lợi cho toàn bộ sinh viên, giảng viên và nhân viên nhà trường.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Đang mở cửa phục vụ (06:30 - 21:00)</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#menu" className="hover:text-orange-400 transition">
                  🍽️ Thực đơn cơm trưa & đồ ăn nóng
                </a>
              </li>
              <li>
                <a href="#combos" className="hover:text-orange-400 transition">
                  🔥 Combo tiết kiệm sinh viên
                </a>
              </li>
              <li>
                <a href="#history" className="hover:text-orange-400 transition">
                  📋 Theo dõi đơn hàng & lịch sử
                </a>
              </li>
              <li>
                <a href="#qr" className="hover:text-orange-400 transition">
                  💳 Hướng dẫn thanh toán VietQR / MoMo
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">
              Khu Vực Giao Hàng Nội Bộ
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>📍 Ký túc xá A, B, C, D (Giao tận phòng: 5 - 10 phút)</li>
              <li>📍 Khu giảng đường A2 (7 - 12 phút)</li>
              <li>📍 Thư viện , khu tự học (8 - 15 phút)</li>
              <li>📍 Quầy phục vụ ăn tại chỗ Căn tin Trung tâm</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">
              Liên Hệ Căn Tin
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Nhà dịch vụ Căn tin A2, Học viện Phụ Nữ Việt Nam, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-bold text-white">Hotline Bếp: 0987 654 321</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@foodzone.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 FOODZONE Canteen Management. Bản quyền thuộc về nhóm CTRC+CTRV.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Phục vụ với</span> <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> <span>cho cộng đồng sinh viên</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
