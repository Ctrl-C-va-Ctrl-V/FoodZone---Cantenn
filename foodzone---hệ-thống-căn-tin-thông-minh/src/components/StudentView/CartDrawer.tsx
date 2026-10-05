import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const { cart, updateCartQty, removeFromCart, clearCart } = useCanteen();

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Giỏ Hàng Của Bạn</h2>
                <div className="text-xs text-slate-500">{totalItems} món đang chờ đặt</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 transition cursor-pointer"
                >
                  Xóa tất cả
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-3xl mb-4">
                  🛒
                </div>
                <h3 className="text-base font-bold text-slate-800">Giỏ hàng của bạn đang trống!</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                  Hãy khám phá thực đơn thơm ngon chuẩn vị của Căn tin và thêm những món yêu thích nhé!
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Chọn Món Ngon Ngay
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.dish.id}
                  className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition"
                >
                  <img
                    src={item.dish.img}
                    alt={item.dish.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                          {item.dish.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.dish.id)}
                          className="text-slate-400 hover:text-red-500 transition cursor-pointer shrink-0"
                          title="Xóa món này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-extrabold text-orange-600 mt-0.5">
                        {item.dish.price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                      <div className="text-[11px] text-slate-500 font-medium">
                        Tổng: <span className="font-bold text-slate-800">{(item.dish.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                        <button
                          onClick={() => updateCartQty(item.dish.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.dish.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính ({totalItems} món):</span>
                  <span className="font-semibold">{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí giao hàng:</span>
                  <span className="text-emerald-600 font-bold">0đ (Miễn phí nội khu)</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-lg text-orange-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-100 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hỗ trợ thanh toán mã VietQR / MoMo / Tiền mặt khi nhận.</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
              >
                Tiến Hành Đặt Hàng <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
