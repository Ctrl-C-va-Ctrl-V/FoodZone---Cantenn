import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  QrCode,
  Calendar,
  Download,
  Printer,
  Award,
  ChevronUp,
  ArrowUpRight,
  PieChart,
  BarChart3,
  Wallet,
  Star,
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';

export const RevenueAnalytics: React.FC = () => {
  const { revenueStats, orders, reviews, setActiveView } = useCanteen();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const {
    todayRevenue,
    todayOrderCount,
    weekRevenue,
    monthRevenue,
    completedOrders,
    cancelledOrders,
    avgOrderValue,
    paymentStats,
    dailyRevenue,
    topDishes,
  } = revenueStats;

  const totalPayment = paymentStats.qrBank + paymentStats.qrMomo + paymentStats.cash;
  const qrBankPercent = Math.round((paymentStats.qrBank / totalPayment) * 100);
  const qrMomoPercent = Math.round((paymentStats.qrMomo / totalPayment) * 100);
  const cashPercent = 100 - qrBankPercent - qrMomoPercent;

  // Max revenue in daily for chart scaling
  const maxDayRevenue = Math.max(...dailyRevenue.map((d) => d.revenue));

  const handleExportReport = () => {
    alert('Hệ thống đang xuất file báo cáo doanh thu PDF / Excel của Căn tin!');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header with Title and Print/Export */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-1">
            <BarChart3 className="w-3.5 h-3.5" /> Báo Cáo Tài Chính & Doanh Thu
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Trung Tâm Thống Kê & Báo Cáo Quản Trị
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Dữ liệu doanh thu thời gian thực, tổng hợp thanh toán QR và các món ăn được yêu thích nhất.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveView('reviews')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Xem Đánh Giá ({reviews.length})</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> In Báo Cáo
          </button>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Xuất File Excel
          </button>
        </div>
      </div>

      {/* 4 Key Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Doanh Thu Hôm Nay
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {todayRevenue.toLocaleString('vi-VN')}đ
            </div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <ChevronUp className="w-3.5 h-3.5" /> +14.2% so với hôm qua
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Doanh Thu Tuần Này
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {weekRevenue.toLocaleString('vi-VN')}đ
            </div>
            <div className="text-[11px] font-bold text-blue-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Đạt 105% chỉ tiêu tuần
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Đơn Đã Xử Lý
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{todayOrderCount} đơn</div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
              ✓ Tỷ lệ hoàn thành 98%
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Giá Trị Đơn Trung Bình
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {avgOrderValue.toLocaleString('vi-VN')}đ
            </div>
            <div className="text-[11px] font-bold text-purple-600 flex items-center gap-1 mt-1">
              Thường kèm 1 cơm + 1 đồ uống
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weekly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Biểu Đồ Doanh Thu 7 Ngày Gần Nhất
              </h3>
              <p className="text-xs text-slate-500">So sánh doanh thu và số lượng đơn hàng theo ngày</p>
            </div>
            <div className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-xl">
              Đỉnh điểm: Giờ trưa (11:30 - 13:00)
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-6">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100 pb-2">
              {dailyRevenue.map((item, idx) => {
                const heightPercent = Math.round((item.revenue / maxDayRevenue) * 100);
                const isToday = idx === dailyRevenue.length - 1;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition duration-150 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded-md whitespace-nowrap pointer-events-none mb-1 shadow-md">
                      {item.revenue.toLocaleString('vi-VN')}đ ({item.orderCount} đơn)
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          isToday
                            ? 'bg-gradient-to-t from-orange-600 to-amber-500'
                            : 'bg-gradient-to-t from-slate-400 to-slate-300 group-hover:from-orange-400 group-hover:to-amber-400'
                        }`}
                      />
                    </div>

                    {/* Day label */}
                    <span
                      className={`text-xs font-bold mt-1 ${
                        isToday ? 'text-orange-600' : 'text-slate-500'
                      }`}
                    >
                      {item.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-around pt-2 text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-gradient-to-r from-orange-600 to-amber-500" />
              <span>Hôm nay: {todayRevenue.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-300" />
              <span>Các ngày trước</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Method Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Phương Thức Thanh Toán</h3>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ thanh toán không tiền mặt qua QR</p>
          </div>

          {/* Graphical Multi-segmented bar */}
          <div className="space-y-4">
            <div className="h-6 w-full rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${qrBankPercent}%` }}
                className="bg-blue-600 transition-all duration-500"
                title={`VietQR: ${qrBankPercent}%`}
              />
              <div
                style={{ width: `${qrMomoPercent}%` }}
                className="bg-pink-600 transition-all duration-500"
                title={`MoMo: ${qrMomoPercent}%`}
              />
              <div
                style={{ width: `${cashPercent}%` }}
                className="bg-emerald-600 transition-all duration-500"
                title={`Tiền mặt: ${cashPercent}%`}
              />
            </div>

            {/* Legends */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">VietQR Ngân Hàng</div>
                    <div className="text-[11px] text-slate-500">{paymentStats.qrBank.toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>
                <span className="text-sm font-black text-blue-600">{qrBankPercent}%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/60 border border-pink-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">Ví MoMo QR</div>
                    <div className="text-[11px] text-slate-500">{paymentStats.qrMomo.toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>
                <span className="text-sm font-black text-pink-600">{qrMomoPercent}%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">Tiền Mặt Khi Nhận</div>
                    <div className="text-[11px] text-slate-500">{paymentStats.cash.toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-600">{cashPercent}%</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center font-medium">
            💡 Hơn <strong className="text-slate-800">{qrBankPercent + qrMomoPercent}%</strong> giao dịch được thực hiện qua mã QR thông minh!
          </div>
        </div>
      </div>

      {/* Top 5 Best Selling Dishes Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top 5 Món Ăn Bán Chạy Nhất (Best Sellers)
            </h3>
            <p className="text-xs text-slate-500">Món được học sinh, sinh viên yêu thích và đặt nhiều nhất</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Xếp Hạng</th>
                <th className="py-3 px-3">Món Ăn</th>
                <th className="py-3 px-3 text-center">Số Suất Đã Bán</th>
                <th className="py-3 px-3 text-right">Tổng Doanh Thu</th>
                <th className="py-3 px-3 text-center">Mức Độ Phổ Biến</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {topDishes.map((dish, idx) => (
                <tr key={dish.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-black text-sm">
                    <span
                      className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800 font-extrabold'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={dish.img}
                        alt={dish.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <span className="font-extrabold text-slate-900">{dish.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">
                    {dish.quantity.toLocaleString('vi-VN')} suất
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-orange-600">
                    {dish.revenue.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      🔥 Hot deal
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
