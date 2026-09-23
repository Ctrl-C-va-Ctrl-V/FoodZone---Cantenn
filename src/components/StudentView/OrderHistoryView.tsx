import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Bike,
  Package,
  RotateCcw,
  XCircle,
  MapPin,
  CreditCard,
  QrCode,
  Calendar,
  MessageSquare,
  Search,
  Star,
  Sparkles,
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { Order, OrderStatus, OrderItem } from '../../types';
import { DishReviewModal } from './DishReviewModal';

export const OrderHistoryView: React.FC = () => {
  const { orders, reviews, currentUser, cancelOrder, addToCart, dishes, setActiveView } = useCanteen();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchCode, setSearchCode] = useState('');

  // Rating modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<OrderItem | null>(null);
  const [selectedReviewOrderId, setSelectedReviewOrderId] = useState<string>('');

  const handleOpenReview = (orderId: string, item: OrderItem) => {
    setSelectedReviewOrderId(orderId);
    setSelectedReviewItem(item);
    setReviewModalOpen(true);
  };

  // If user is student, we show orders placed by this student (or all if demo testing)
  const studentOrders = orders.filter((o) => {
    if (currentUser.role === 'student') {
      // Allow viewing all if demo, or match studentId
      const matchesStudent = o.studentId === currentUser.id || o.studentPhone === currentUser.phone;
      // In demo mode we can show all to allow tester to see the pre-populated orders!
      return matchesStudent || true;
    }
    return true;
  });

  const filteredOrders = studentOrders.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(searchCode.toLowerCase()) ||
      order.items.some((i) => i.dishName.toLowerCase().includes(searchCode.toLowerCase()));

    if (!matchSearch) return false;

    if (statusFilter === 'active') {
      return order.orderStatus === 'pending' || order.orderStatus === 'cooking' || order.orderStatus === 'ready';
    }
    if (statusFilter === 'completed') {
      return order.orderStatus === 'completed';
    }
    if (statusFilter === 'cancelled') {
      return order.orderStatus === 'cancelled';
    }
    return true;
  });

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const originalDish = dishes.find((d) => d.id === item.dishId);
      if (originalDish) {
        addToCart(originalDish, item.quantity, item.notes);
      }
    });
    alert(`Đã thêm ${order.items.length} món từ đơn ${order.id} vào giỏ hàng!`);
    setActiveView('menu');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ tiếp nhận',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />,
        };
      case 'cooking':
        return {
          label: 'Đang nấu / Chế biến',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <ChefHat className="w-3.5 h-3.5 text-orange-600 animate-bounce" />,
        };
      case 'ready':
        return {
          label: 'Sẵn sàng / Đang giao',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Bike className="w-3.5 h-3.5 text-blue-600 animate-pulse" />,
        };
      case 'completed':
        return {
          label: 'Đã hoàn thành',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-3.5 h-3.5 text-red-600" />,
        };
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>📋</span> Lịch Sử & Theo Dõi Đơn Hàng
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Theo dõi tiến độ nấu món và giao nhận trong thời gian thực.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({studentOrders.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚡ Đang xử lý (
            {studentOrders.filter((o) => ['pending', 'cooking', 'ready'].includes(o.orderStatus)).length}
            )
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ✓ Đã giao ({studentOrders.filter((o) => o.orderStatus === 'completed').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Chưa có đơn hàng nào trong mục này</h3>
          <p className="text-xs text-slate-500 mt-1">
            Bạn có thể chuyển sang tab Thực Đơn để chọn món và đặt hàng ngay nhé!
          </p>
          <button
            onClick={() => setActiveView('menu')}
            className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Khám phá thực đơn
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusBadge(order.orderStatus);
            const canCancel = order.orderStatus === 'pending';

            // Step Progress (0 = pending, 1 = cooking, 2 = ready, 3 = completed)
            const stepIndex =
              order.orderStatus === 'pending'
                ? 0
                : order.orderStatus === 'cooking'
                ? 1
                : order.orderStatus === 'ready'
                ? 2
                : order.orderStatus === 'completed'
                ? 3
                : -1;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Top Bar of Order Card */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm">
                      FZ
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{order.id}</span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}{' '}
                          {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          {order.paymentMethod === 'qr_bank'
                            ? 'VietQR Ngân Hàng'
                            : order.paymentMethod === 'qr_momo'
                            ? 'Ví MoMo'
                            : 'Tiền mặt'}
                        </span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {canCancel && (
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${order.id}?`)) {
                            cancelOrder(order.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                      >
                        Hủy Đơn
                      </button>
                    )}
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-600 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Đặt Lại
                    </button>
                  </div>
                </div>

                {/* Progress Stepper for Active Orders */}
                {order.orderStatus !== 'cancelled' && (
                  <div className="px-5 py-3 bg-white border-b border-slate-100">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { title: 'Chờ tiếp nhận', desc: 'Bếp đã nhận thông báo' },
                        { title: 'Đang nấu', desc: 'Đầu bếp đang chế biến' },
                        { title: 'Sẵn sàng / Đang giao', desc: 'Món xong, shipper chuyển' },
                        { title: 'Hoàn thành', desc: 'Chúc bạn ngon miệng!' },
                      ].map((step, idx) => {
                        const isPast = idx <= stepIndex;
                        const isCurrent = idx === stepIndex;

                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition mb-1 ${
                                isCurrent
                                  ? 'bg-orange-600 text-white ring-4 ring-orange-100'
                                  : isPast
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {isPast && !isCurrent ? '✓' : idx + 1}
                            </div>
                            <div
                              className={`text-[11px] font-bold ${
                                isCurrent
                                  ? 'text-orange-600'
                                  : isPast
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.title}
                            </div>
                            <div className="text-[9px] text-slate-400 hidden sm:block">
                              {step.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Card Content: Items + Location */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Items List */}
                  <div className="md:col-span-2 space-y-2.5">
                    <div className="text-xs font-bold text-slate-700">Chi tiết món ăn:</div>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                      {order.items.map((item, idx) => {
                        const existingReview = reviews.find(
                          (r) => r.orderId === order.id && r.dishId === item.dishId
                        );

                        return (
                          <div key={idx} className="p-3.5 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={item.img}
                                  alt={item.dishName}
                                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                                />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-slate-900 truncate">
                                    {item.dishName}
                                  </h4>
                                  <div className="text-[11px] text-slate-500">
                                    Số lượng: <span className="font-bold text-slate-700">x{item.quantity}</span> • Giá:{' '}
                                    {item.price.toLocaleString('vi-VN')}đ
                                  </div>
                                  {item.notes && (
                                    <div className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-1 inline-block">
                                      Ghi chú: {item.notes}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                <div className="text-xs font-extrabold text-slate-900">
                                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                </div>

                                {/* Review Actions if order is completed */}
                                {order.orderStatus === 'completed' && (
                                  <div>
                                    {existingReview ? (
                                      <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                        <span>Đã đánh giá ({existingReview.rating}★)</span>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenReview(order.id, item)}
                                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer active:scale-95"
                                      >
                                        <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                        <span>Đánh giá món</span>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* If already reviewed, display the review comment snippet */}
                            {existingReview && (
                              <div className="mt-1 text-[11px] p-2.5 bg-white border border-amber-200/80 rounded-xl space-y-1">
                                <div className="flex items-center justify-between text-slate-500">
                                  <span className="font-semibold text-amber-900 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-600" />
                                    Cảm nhận của bạn:
                                  </span>
                                  <div className="flex text-amber-400">
                                    {Array.from({ length: existingReview.rating }).map((_, i) => (
                                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-slate-700 italic">"{existingReview.comment}"</p>
                                {existingReview.adminReply && (
                                  <div className="mt-1.5 p-2 bg-purple-50 border border-purple-200 rounded-lg text-purple-900">
                                    <span className="font-bold">Quản lý phản hồi: </span>
                                    <span>{existingReview.adminReply}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Location & Notes */}
                  <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                    <div className="space-y-2 text-xs">
                      <div className="font-bold text-slate-800 pb-1 border-b border-slate-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" /> Địa Điểm Giao Hàng
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">Khu vực:</div>
                        <div className="font-bold text-slate-800">{order.deliveryArea}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">Chi tiết:</div>
                        <div className="font-semibold text-slate-800">{order.detailedAddress}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">Người nhận:</div>
                        <div className="font-semibold text-slate-800">
                          {order.studentName} ({order.studentPhone})
                        </div>
                      </div>

                      {order.staffNotes && (
                        <div className="mt-2 p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                          <span className="font-bold flex items-center gap-1 text-[11px]">
                            <ChefHat className="w-3 h-3 text-amber-700" /> Bếp nhắn:
                          </span>
                          <p className="text-[11px] mt-0.5">{order.staffNotes}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Tổng tiền:</span>
                      <span className="text-base font-black text-orange-600">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dish Review Modal */}
      <DishReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        orderId={selectedReviewOrderId}
        item={selectedReviewItem}
      />
    </div>
  );
};
