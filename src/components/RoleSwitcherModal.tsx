import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  ChefHat,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';
import { Role, User } from '../types';
import { DEMO_USERS } from '../data/initialData';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchActor } = useCanteen();
  const [selectedRole, setSelectedRole] = useState<Role>(currentUser.role);
  const [customName, setCustomName] = useState(currentUser.name);
  const [customId, setCustomId] = useState(currentUser.schoolId || '');

  if (!isOpen) return null;

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setCustomName(DEMO_USERS[role].name);
    setCustomId(DEMO_USERS[role].schoolId || '');
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const base = DEMO_USERS[selectedRole];
    const customizedUser: User = {
      ...base,
      name: customName.trim() || base.name,
      schoolId: customId.trim() || base.schoolId,
    };
    switchActor(selectedRole, customizedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Cổng Phân Quyền Nghiệp Vụ
          </div>
          <h2 className="text-2xl font-black tracking-tight">Đăng Nhập & Chọn Tác Nhân</h2>
          <p className="text-orange-100 text-xs mt-1">
            Chọn vai trò để trải nghiệm luồng nghiệp vụ tương ứng theo yêu cầu của hệ thống Căn tin.
          </p>
        </div>

        {/* Roles selection */}
        <form onSubmit={handleApply} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {/* Student */}
            <div
              onClick={() => handleSelectRole('student')}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                selectedRole === 'student'
                  ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-slate-900 text-sm">Học Sinh / Sinh Viên</div>
                  {selectedRole === 'student' && (
                    <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Xem thực đơn, chọn món, thanh toán bằng mã VietQR/MoMo, theo dõi trạng thái đơn hàng thời gian thực & lưu lịch sử đặt món.
                </div>
              </div>
            </div>

            {/* Staff */}
            <div
              onClick={() => handleSelectRole('staff')}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                selectedRole === 'staff'
                  ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-slate-900 text-sm">Nhân Viên Bếp & Căn Tin</div>
                  {selectedRole === 'staff' && (
                    <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Tiếp nhận đơn mới tức thì, chuyển trạng thái nấu/giao món, cập nhật nhanh tình trạng món ăn (còn món / hết món) để khách không bị lỡ đơn.
                </div>
              </div>
            </div>

            {/* Admin */}
            <div
              onClick={() => handleSelectRole('admin')}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                selectedRole === 'admin'
                  ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-slate-900 text-sm">Quản Lý / Quản Trị Viên</div>
                  {selectedRole === 'admin' && (
                    <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Báo cáo doanh thu chuyên sâu (ngày/tuần/tháng), cơ cấu thanh toán QR vs Tiền mặt, quản lý thêm/sửa/xóa thực đơn và kiểm soát hoạt động.
                </div>
              </div>
            </div>
          </div>

          {/* User information input */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Info className="w-3.5 h-3.5 text-orange-600" /> Thông tin đăng nhập hiển thị:
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-orange-500 outline-none"
                  placeholder="Nhập tên..."
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {selectedRole === 'student' ? 'Mã sinh viên (MSSV)' : 'Mã định danh'}
                </label>
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-orange-500 outline-none font-mono"
                  placeholder="Mã..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              Xác Nhận & Vào Giao Diện <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
