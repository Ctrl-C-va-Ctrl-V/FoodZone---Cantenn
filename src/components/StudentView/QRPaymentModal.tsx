import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Copy,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Smartphone,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCanteen } from '../../context/CanteenContext';
import { BANK_CONFIG } from '../../data/initialData';
import { PaymentMethod, Order } from '../../types';

interface QRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    studentName: string;
    studentPhone: string;
    deliveryArea: string;
    detailedAddress: string;
    paymentMethod: PaymentMethod;
    studentNotes?: string;
    totalAmount: number;
  } | null;
  onSuccess: (order: Order) => void;
}

export const QRPaymentModal: React.FC<QRPaymentModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onSuccess,
}) => {
  const { placeOrder } = useCanteen();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown

  const tempOrderRef = React.useMemo(() => {
    return Math.floor(1000 + Math.random() * 9000);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(600);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !orderData) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isMomo = orderData.paymentMethod === 'qr_momo';
  const transferContent = `FZ ${tempOrderRef} ${orderData.studentName.split(' ').pop()?.toUpperCase() || 'SV'}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    try {
      const placedOrder = await placeOrder({
        studentName: orderData.studentName,
        studentPhone: orderData.studentPhone,
        deliveryArea: orderData.deliveryArea,
        detailedAddress: orderData.detailedAddress,
        paymentMethod: orderData.paymentMethod,
        studentNotes: orderData.studentNotes,
      });

      // Fire festive celebration confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff5722', '#ffb300', '#10b981', '#3b82f6'],
      });

      setIsProcessing(false);
      onSuccess(placedOrder);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div
          className={`p-5 text-white flex items-center justify-between ${
            isMomo
              ? 'bg-gradient-to-r from-pink-600 to-rose-600'
              : 'bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white">
              {isMomo ? <Smartphone className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold">
                {isMomo ? 'Thanh Toán Ví MoMo QR' : 'Quét Mã VietQR Ngân Hàng'}
              </h2>
              <div className="text-[11px] text-white/80 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>Hết hạn sau: {formattedTime}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-6 flex flex-col items-center bg-slate-50 border-b border-slate-200">
          <div className="relative p-4 bg-white rounded-2xl shadow-md border-2 border-slate-200 flex flex-col items-center">
            {/* Visual QR Code Display */}
            <div className="relative w-52 h-52 bg-white flex items-center justify-center">
              {/* Fallback & Primary VietQR API image */}
              <img
                src={
                  isMomo
                    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|0988776655|FOODZONE|${orderData.totalAmount}|0|0|${transferContent}`
                    : `https://api.vietqr.io/image/970422-098877665588-compact2.jpg?amount=${orderData.totalAmount}&addInfo=${encodeURIComponent(
                        transferContent
                      )}&accountName=CAN%20TIN%20FOODZONE`
                }
                alt="QR Code Thanh Toán"
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  // Fallback to QR server if vietqr network issue
                  (e.currentTarget as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=FOODZONE-CANTEEN-PAY-${orderData.totalAmount}-${transferContent}`;
                }}
              />

              {/* Logo in center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-extrabold text-[10px] shadow-md border-2 border-white ${
                    isMomo ? 'bg-pink-600' : 'bg-blue-600'
                  }`}
                >
                  {isMomo ? 'MoMo' : 'MB'}
                </div>
              </div>
            </div>

            <div className="mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Napas 24/7 • Miễn Phí Chuyển Khoản</span>
            </div>
          </div>

          {/* Amount to pay */}
          <div className="mt-4 text-center">
            <div className="text-xs text-slate-500 font-semibold">Số tiền cần thanh toán</div>
            <div className="text-2xl font-black text-orange-600 tracking-tight mt-0.5">
              {orderData.totalAmount.toLocaleString('vi-VN')}đ
            </div>
          </div>
        </div>

        {/* Bank & Transfer details */}
        <div className="p-5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 font-medium">Ngân hàng thụ hưởng:</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-blue-600" /> {BANK_CONFIG.bankName}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 font-medium">Số tài khoản:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-slate-900 text-sm">
                {BANK_CONFIG.accountNo}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(BANK_CONFIG.accountNo, 'acc')}
                className="p-1 text-slate-400 hover:text-orange-600 transition cursor-pointer"
                title="Sao chép số tài khoản"
              >
                {copiedField === 'acc' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 font-medium">Chủ tài khoản:</span>
            <span className="font-bold text-slate-800 uppercase">{BANK_CONFIG.accountHolder}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80">
            <span className="text-amber-900 font-bold">Nội dung chuyển:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-amber-900 text-sm">
                {transferContent}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(transferContent, 'memo')}
                className="p-1 text-amber-700 hover:text-orange-600 transition cursor-pointer"
                title="Sao chép nội dung"
              >
                {copiedField === 'memo' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="p-5 pt-0 space-y-2">
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Đang xác thực thanh toán...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Tôi Đã Chuyển Khoản Thành Công</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400">
            Hệ thống căn tin tự động kiểm tra giao dịch và đẩy đơn vào nhà bếp ngay lập tức.
          </p>
        </div>
      </div>
    </div>
  );
};
