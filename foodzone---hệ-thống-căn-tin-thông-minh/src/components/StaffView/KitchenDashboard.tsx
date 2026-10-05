import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Bike,
  AlertCircle,
  Bell,
  RefreshCw,
  Search,
  Filter,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Flame,
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { Order, OrderStatus } from '../../types';

export const KitchenDashboard: React.FC = () => {
  const { orders, updateOrderStatus, dishes, toggleDishStock } = useCanteen();
  const [selectedColumn, setSelectedColumn] = useState<'all' | 'pending' | 'cooking' | 'ready'>('all');
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Group orders
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending');
  const cookingOrders = orders.filter((o) => o.orderStatus === 'cooking');
  const readyOrders = orders.filter((o) => o.orderStatus === 'ready');
  const completedOrders = orders.filter((o) => o.orderStatus === 'completed');

  const handleAdvanceStatus = (order: Order) => {
    const staffNote = noteInputs[order.id];

    if (order.orderStatus === 'pending') {
      updateOrderStatus(order.id, 'cooking', staffNote || 'Bếp đã tiếp nhận và đang chế biến');
    } else if (order.orderStatus === 'cooking') {
      updateOrderStatus(order.id, 'ready', staffNote || 'Món đã hoàn thành, sẵn sàng phục vụ');
    } else if (order.orderStatus === 'ready') {
      updateOrderStatus(order.id, 'completed', staffNote || 'Đã giao thành công cho khách hàng');
    }
  };

  const handleCancel = (order: Order) => {
    if (confirm(`Bạn có chắc muốn hủy đơn ${order.id}?`)) {
      updateOrderStatus(order.id, 'cancelled', 'Căn tin hết món / Đã hủy bởi nhà bếp');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Kitchen Alert Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-600/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/25 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Tổ Bếp Trực Tuyến • Nhận Đơn Tức Thời
            </div>
            <h1 className="text-2xl font-black tracking-tight">Khu Vực Chế Biến & Điều Phối Đơn</h1>
            <p className="text-xs text-orange-100 mt-0.5">
              Thao tác 1 chạm chuyển trạng thái món ăn để thông báo kịp thời cho sinh viên.
            </p>
          </div>
        </div>

        {/* Counter Stats & Sound button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <div className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">Đơn Mới Chờ Nấu</div>
            <div className="text-xl font-black text-amber-200">{pendingOrders.length} đơn</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <div className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">Đang Nấu</div>
            <div className="text-xl font-black text-white">{cookingOrders.length} đơn</div>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2 text-xs font-bold ${
              soundEnabled
                ? 'bg-white text-orange-700 border-white shadow-sm'
                : 'bg-white/10 text-white/70 border-white/20'
            }`}
            title="Bật/Tắt chuông báo đơn mới"
          >
            <Bell className={`w-4 h-4 ${soundEnabled ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{soundEnabled ? 'Chuông: BẬT' : 'Chuông: TẮT'}</span>
          </button>
        </div>
      </div>

      {/* Quick 1-tap Stock Availability Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <h2 className="text-sm font-extrabold text-slate-900">
              Quản Lý Nhanh Trạng Thái Món Ăn (Cảnh Báo Hết Món)
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Bấm vào để chuyển đổi trạng thái Còn món / Hết món tức thì
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {dishes.slice(0, 10).map((dish) => (
            <button
              key={dish.id}
              onClick={() => toggleDishStock(dish.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition shrink-0 cursor-pointer ${
                dish.inStock
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dish.inStock ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <span className="truncate max-w-[140px]">{dish.name}</span>
              <span className="text-[10px] font-extrabold opacity-75">
                {dish.inStock ? 'Còn món' : 'HẾT MÓN'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns: 3 Columns for quick touch screen workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Chờ tiếp nhận (PENDING) */}
        <div className="bg-slate-100/80 rounded-3xl p-4 border border-slate-200/80 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="font-extrabold text-slate-900 text-sm">1. Đơn Mới Chờ Nhận</h3>
            </div>
            <span className="bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[700px] pr-1">
            {pendingOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs italic bg-white/60 rounded-2xl border border-dashed border-slate-200">
                Không có đơn mới nào đang chờ
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-md space-y-3 hover:shadow-lg transition"
                >
                  {/* Order header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{order.id}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          {order.paymentMethod === 'cash' ? '💵 Tiền mặt' : '💳 Đã TT VietQR'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 mt-0.5">
                        {order.studentName} • {order.studentPhone}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' • '}
                        <span className="font-semibold text-orange-600">{order.deliveryArea}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-orange-600">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </div>
                      <button
                        onClick={() => handleCancel(order)}
                        className="text-[10px] text-red-500 hover:underline font-bold mt-1"
                      >
                        Hủy đơn
                      </button>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="text-[11px] bg-slate-50 p-2 rounded-xl text-slate-700 border border-slate-100">
                    <span className="font-bold">Địa chỉ:</span> {order.detailedAddress}
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 border-t border-slate-100 pt-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-900">
                          {item.quantity}x {item.dishName}
                        </span>
                        {item.notes && (
                          <span className="text-[10px] text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded font-medium">
                            {item.notes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.studentNotes && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 italic">
                      "Khách dặn: {order.studentNotes}"
                    </div>
                  )}

                  {/* Quick Advance button */}
                  <button
                    onClick={() => handleAdvanceStatus(order)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-extrabold text-xs shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                  >
                    <ChefHat className="w-4 h-4" /> Tiếp Nhận & Nấu Ngay
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Đang nấu (COOKING) */}
        <div className="bg-slate-100/80 rounded-3xl p-4 border border-slate-200/80 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-bounce" />
              <h3 className="font-extrabold text-slate-900 text-sm">2. Đang Chế Biến / Nấu</h3>
            </div>
            <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
              {cookingOrders.length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[700px] pr-1">
            {cookingOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs italic bg-white/60 rounded-2xl border border-dashed border-slate-200">
                Không có món nào đang nấu
              </div>
            ) : (
              cookingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border-2 border-orange-400 shadow-md space-y-3 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{order.id}</div>
                      <div className="text-xs font-bold text-slate-700">
                        {order.studentName} ({order.deliveryArea})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Bắt đầu nấu:{' '}
                        {new Date(order.updatedAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <span className="bg-orange-100 text-orange-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Đang trên bếp
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 border-t border-slate-100 pt-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-slate-900">
                          {item.quantity}x {item.dishName}
                        </span>
                        {item.notes && (
                          <span className="text-[10px] text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded font-medium">
                            {item.notes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quick message input for student */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ghi chú báo khách (vd: Đang đóng hộp)..."
                      value={noteInputs[order.id] || ''}
                      onChange={(e) =>
                        setNoteInputs({ ...noteInputs, [order.id]: e.target.value })
                      }
                      className="flex-1 text-[11px] px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    onClick={() => handleAdvanceStatus(order)}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                  >
                    <Bike className="w-4 h-4" /> Báo Món Sẵn Sàng / Đi Giao
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Sẵn sàng lấy / Đang giao (READY) */}
        <div className="bg-slate-100/80 rounded-3xl p-4 border border-slate-200/80 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="font-extrabold text-slate-900 text-sm">3. Sẵn Sàng / Đang Giao</h3>
            </div>
            <span className="bg-blue-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[700px] pr-1">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs italic bg-white/60 rounded-2xl border border-dashed border-slate-200">
                Không có đơn đang chờ giao
              </div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border-2 border-blue-400 shadow-md space-y-3 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{order.id}</div>
                      <div className="text-xs font-bold text-slate-700">
                        {order.studentName} ({order.studentPhone})
                      </div>
                      <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                        📍 {order.detailedAddress}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {order.paymentMethod === 'cash' ? 'Thu tiền mặt' : 'Đã thanh toán'}
                      </div>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                    {order.items.map((i) => `${i.quantity}x ${i.dishName}`).join(', ')}
                  </div>

                  <button
                    onClick={() => handleAdvanceStatus(order)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Khách Đã Nhận / Hoàn Tất
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
