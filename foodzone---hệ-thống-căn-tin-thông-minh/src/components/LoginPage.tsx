import React, { useState } from 'react';
import {
  Utensils,
  GraduationCap,
  ChefHat,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  QrCode,
  Star,
  Info,
} from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';
import { Role, User as UserType } from '../types';
import { DEMO_USERS } from '../data/initialData';

export const LoginPage: React.FC = () => {
  const { login } = useCanteen();
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [username, setUsername] = useState('20216789');
  const [password, setPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'student') {
      setUsername(DEMO_USERS.student.schoolId || '20216789');
      setPassword('123456');
    } else if (role === 'staff') {
      setUsername(DEMO_USERS.staff.schoolId || 'NV-8802');
      setPassword('staff@123');
    } else {
      setUsername('admin@canteen.edu.vn');
      setPassword('admin@2026');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập mã định danh hoặc tên tài khoản!');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu!');
      return;
    }

    // Login with the chosen role
    const baseUser = DEMO_USERS[selectedRole];
    login(selectedRole, baseUser);
  };

  const handleQuickLogin = (role: Role) => {
    login(role, DEMO_USERS[role]);
  };

  const roleDetails = {
    student: {
      title: 'Học Sinh / Sinh Viên',
      subtitle: 'Xem thực đơn, đặt món nhanh, thanh toán QR và đánh giá đồ ăn',
      idPlaceholder: 'Nhập MSSV (ví dụ: 20216789)',
      idLabel: 'Mã số sinh viên (MSSV)',
      color: 'from-orange-500 to-amber-500',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
      accountName: DEMO_USERS.student.name,
      accountDetail: `${DEMO_USERS.student.classroom} • MSSV: ${DEMO_USERS.student.schoolId}`,
      features: [
        'Chọn món nóng hổi theo thực đơn từng ngày & combo giảm giá',
        'Thanh toán tiện lợi qua VietQR ngân hàng hoặc ví MoMo',
        'Theo dõi tiến độ nấu món và nhận thông báo giao đến KTX',
        '⭐ Đánh giá 1 - 5 sao và gửi góp ý món ăn sau khi nhận đơn',
      ],
    },
    staff: {
      title: 'Nhân Viên Bếp & Căn Tin',
      subtitle: 'Tiếp nhận đơn, cập nhật tiến độ nấu và quản lý kho món ăn',
      idPlaceholder: 'Nhập Mã nhân viên (ví dụ: NV-8802)',
      idLabel: 'Mã nhân viên (Mã CB/NV)',
      color: 'from-amber-600 to-orange-600',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <ChefHat className="w-5 h-5 text-amber-600" />,
      accountName: DEMO_USERS.staff.name,
      accountDetail: `${DEMO_USERS.staff.department} • Mã: ${DEMO_USERS.staff.schoolId}`,
      features: [
        'Màn hình Bếp KDS thời gian thực, chuông báo đơn mới tự động',
        'Cập nhật trạng thái: Đang nấu → Sẵn sàng / Giao hàng',
        'Bật / Tắt trạng thái Còn món - Tạm hết món trong 1 chạm',
        'Ghi chú bếp trực tiếp cho học sinh (thêm cơm, đổi canh)',
      ],
    },
    admin: {
      title: 'Quản Trị Viên / Quản Lý',
      subtitle: 'Kiểm soát doanh thu, quản trị thực đơn và theo dõi đánh giá',
      idPlaceholder: 'Nhập Email quản lý (admin@canteen.edu.vn)',
      idLabel: 'Tài khoản Quản lý',
      color: 'from-purple-600 to-indigo-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      accountName: DEMO_USERS.admin.name,
      accountDetail: `${DEMO_USERS.admin.department} • Mã: ${DEMO_USERS.admin.schoolId}`,
      features: [
        'Báo cáo doanh thu theo ngày, tuần, tháng & tỷ lệ thanh toán QR',
        '⭐ Xem điểm đánh giá trung bình (1-5★) của từng món ăn',
        'Đọc toàn bộ phản hồi từ sinh viên & phản hồi lại ý kiến',
        'Quản lý danh mục món, thêm món mới và điều chỉnh giá bán',
      ],
    },
  };

  const currentRoleInfo = roleDetails[selectedRole];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50/40 to-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Brand Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900 leading-none">
                FOOD<span className="text-orange-600">ZONE</span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Căn Tin Học Đường ĐHSP - HVPVN
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1 bg-orange-100/60 text-orange-800 px-3 py-1 rounded-full border border-orange-200/60">
              <Clock className="w-3.5 h-3.5 text-orange-600" /> Giờ mở cửa: 06:30 - 21:00
            </span>
            <span className="flex items-center gap-1 bg-emerald-100/60 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200/60">
              <QrCode className="w-3.5 h-3.5 text-emerald-600" /> Hỗ trợ VietQR & MoMo
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Content */}
      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-12 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Role Features & Visual Guidance */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-7 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" /> Hệ Thống Quản Lý Căn Tin Đa Tác Nhân
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                  Chào mừng đến với <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                    Căn Tin FOODZONE
                  </span>
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Đăng nhập đúng vai trò của bạn để truy cập không gian làm việc và tiện ích phù hợp nhất.
                </p>
              </div>

              {/* Dynamic Role Highlights */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  {currentRoleInfo.icon}
                  <span>Quyền lợi vai trò: {currentRoleInfo.title}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{currentRoleInfo.subtitle}</p>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  {currentRoleInfo.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                ⚡ Đăng nhập nhanh 1 chạm (Tài khoản mẫu):
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student')}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white p-2.5 rounded-xl text-left transition border border-white/10 flex flex-col gap-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                    <GraduationCap className="w-3.5 h-3.5" /> Sinh viên
                  </div>
                  <div className="text-[10px] text-slate-300 truncate">Thùy Linh</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('staff')}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white p-2.5 rounded-xl text-left transition border border-white/10 flex flex-col gap-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                    <ChefHat className="w-3.5 h-3.5" /> Bếp / NV
                  </div>
                  <div className="text-[10px] text-slate-300 truncate">Thị Mai</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white p-2.5 rounded-xl text-left transition border border-white/10 flex flex-col gap-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-300">
                    <ShieldCheck className="w-3.5 h-3.5" /> Quản lý
                  </div>
                  <div className="text-[10px] text-slate-300 truncate">Hoàng Vũ</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl flex flex-col justify-center">
            {/* Role Switcher Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5">
                1. Chọn vai trò đăng nhập của bạn:
              </label>
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                    selectedRole === 'student'
                      ? 'bg-white text-orange-600 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sinh Viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('staff')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                    selectedRole === 'staff'
                      ? 'bg-white text-orange-600 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ChefHat className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Nhân Viên Bếp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-white text-orange-600 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Quản Trị Viên</span>
                </button>
              </div>
            </div>

            {/* Role Header Banner */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={DEMO_USERS[selectedRole].avatar}
                  alt={currentRoleInfo.accountName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-orange-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {currentRoleInfo.accountName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRoleInfo.badgeColor}`}
                    >
                      {currentRoleInfo.title}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {currentRoleInfo.accountDetail}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickLogin(selectedRole)}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs whitespace-nowrap hidden sm:flex items-center gap-1"
              >
                Vào ngay <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                <Info className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {currentRoleInfo.idLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={currentRoleInfo.idPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => setPassword('123456')}
                    className="text-[11px] font-semibold text-orange-600 hover:underline"
                  >
                    Điền mật khẩu mặc định (123456)
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-medium transition"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 border-slate-300 focus:ring-orange-500"
                  />
                  <span className="text-slate-600 font-medium">Ghi nhớ đăng nhập trên thiết bị</span>
                </label>
                <span className="text-slate-400">Hỗ trợ 24/7: 0988.776.655</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
              >
                <span>Đăng Nhập Với Vai Trò {currentRoleInfo.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              Căn Tin Học Đường ĐH Sư Phạm - Học Viện Phụ Nữ Việt Nam • Hệ thống thanh toán QR trực tiếp
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200/60 bg-white/50">
        © 2026 FOODZONE Canteen Management System • Đăng nhập vai trò nào vào trực tiếp giao diện vai trò đó.
      </footer>
    </div>
  );
};
