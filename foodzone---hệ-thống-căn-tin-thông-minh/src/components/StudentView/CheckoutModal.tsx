import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  User,
  CreditCard,
  QrCode,
  Banknote,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { PaymentMethod } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQRPayment: (orderData: {
    studentName: string;
    studentPhone: string;
    deliveryArea: string;
    detailedAddress: string;
    paymentMethod: PaymentMethod;
    studentNotes?: string;
    totalAmount: number;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOpenQRPayment,
}) => {
  const { cart, currentUser } = useCanteen();

  const [studentName, setStudentName] = useState(currentUser.name || '');
  const [studentPhone, setStudentPhone] = useState(currentUser.phone || '0988776655');
  const [deliveryArea, setDeliveryArea] = useState('KTX B1-B10');
  const [detailedAddress, setDetailedAddress] = useState('Phòng 402 - KTX B5');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr_bank');
  const [studentNotes, setStudentNotes] = useState('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim() || !detailedAddress.trim()) {
      alert('Vui lòng điền đầy đủ thông tin giao nhận!');
      return;
    }

    onClose();
    onOpenQRPayment({
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      deliveryArea,
      detailedAddress: detailedAddress.trim(),
      paymentMethod,
      studentNotes: studentNotes.trim(),
      totalAmount,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">Xác Nhận Đặt Món Căn Tin</h2>
            <p className="text-xs text-orange-100 mt-0.5">
              Giao tận nơi hoặc nhận tại quầy Căn tin trong 10 phút
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Order Summary Miniature */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 pb-2 border-b border-slate-200">
              <span>Món đã chọn ({cart.length} món):</span>
              <span className="text-orange-600 font-extrabold">{totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 pt-2 text-xs text-slate-600">
              {cart.map((item) => (
                <div key={item.dish.id} className="flex justify-between">
                  <span className="truncate pr-2">
                    {item.quantity}x {item.dish.name}
                  </span>
                  <span className="font-semibold shrink-0">
                    {(item.dish.price * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-orange-600" /> Họ & Tên Học Sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
                placeholder="VD: Nguyễn Văn A"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-orange-600" /> Số Điện Thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
                placeholder="VD: 0987654321"
                required
              />
            </div>
          </div>

          {/* Delivery Location */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" /> Khu Vực Nhận Hàng <span className="text-red-500">*</span>
              </label>
              <select
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-none bg-white cursor-pointer"
                required
              >
                <optgroup label="Khu Vực Ký Túc Xá">
                  <option value="KTX A1-A5">Ký Túc Xá A (Tòa A1 - A5)</option>
                  <option value="KTX B1-B10">Ký Túc Xá B (Tòa B1 - B10)</option>
                  <option value="KTX C1-C5">Ký Túc Xá C (Tòa C1 - C5)</option>
                </optgroup>
                <optgroup label="Khu Vực Giảng Đường">
                  <option value="Giảng đường D3-D5">Tòa Nhà Giảng Đường D3 - D5</option>
                  <option value="Giảng đường B1">Tòa Nhà Giảng Đường B1</option>
                  <option value="Giảng đường C1">Tòa Nhà Giảng Đường C1</option>
                  <option value="Thư viện Tạ Quang Bửu">Thư Viện Tạ Quang Bửu (Tầng 1 - 5)</option>
                  <option value="Tòa Nhà A2 Trung Tâm">Tòa Nhà A2 Trung Tâm</option>
                </optgroup>
                <optgroup label="Khác">
                  <option value="Nhận tại Quầy Căn Tin">Ăn trực tiếp / Lấy tại quầy Căn tin</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Địa Chỉ Chi Tiết (Số Phòng, Số Bàn) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
                placeholder="VD: Phòng 402 - KTX B5 hoặc Bàn 12 - Tầng 3 Thư viện"
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-orange-600" /> Phương Thức Thanh Toán <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div
                onClick={() => setPaymentMethod('qr_bank')}
                className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                  paymentMethod === 'qr_bank'
                    ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-extrabold text-slate-800">VietQR Ngân Hàng</div>
                <div className="text-[9px] text-slate-500">Mã QR tự động</div>
              </div>

              <div
                onClick={() => setPaymentMethod('qr_momo')}
                className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                  paymentMethod === 'qr_momo'
                    ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-extrabold text-slate-800">Ví MoMo QR</div>
                <div className="text-[9px] text-slate-500">Quét mã MoMo</div>
              </div>

              <div
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                  paymentMethod === 'cash'
                    ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-extrabold text-slate-800">Tiền Mặt</div>
                <div className="text-[9px] text-slate-500">Trả khi nhận đồ</div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-orange-600" /> Ghi Chú Cho Nhà Bếp
            </label>
            <input
              type="text"
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
              placeholder="VD: Không cay, nhiều đá, shipper đến nơi gọi điện trước..."
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            <div>
              <div className="text-[10px] text-slate-500">Tổng thanh toán:</div>
              <div className="text-lg font-black text-orange-600">
                {totalAmount.toLocaleString('vi-VN')}đ
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              {paymentMethod === 'cash' ? 'Xác Nhận Đặt Hàng' : 'Tạo Mã QR Thanh Toán'}{' '}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
