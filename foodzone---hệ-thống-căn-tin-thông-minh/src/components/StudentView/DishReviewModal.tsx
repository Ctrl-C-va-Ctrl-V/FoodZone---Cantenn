import React, { useState } from 'react';
import {
  Star,
  X,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { OrderItem } from '../../types';

interface DishReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  item: OrderItem | null;
}

export const DishReviewModal: React.FC<DishReviewModalProps> = ({
  isOpen,
  onClose,
  orderId,
  item,
}) => {
  const { submitReview } = useCanteen();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !item) return null;

  const quickTags = [
    'Ngon miệng',
    'Nóng hổi',
    'Đậm đà',
    'Đầy đặn no bụng',
    'Giao nhanh',
    'Hợp khẩu vị',
    'Giá sinh viên',
    'Đóng gói sạch sẽ',
  ];

  const ratingDescriptions: Record<number, { text: string; color: string }> = {
    1: { text: 'Rất tệ - Không hài lòng', color: 'text-red-500' },
    2: { text: 'Chưa ngon - Cần cải thiện', color: 'text-orange-500' },
    3: { text: 'Bình thường - Tạm được', color: 'text-amber-500' },
    4: { text: 'Ngon miệng - Hài lòng', color: 'text-emerald-500' },
    5: { text: 'Xuất sắc! - Rất ngon & đáng tiền', color: 'text-orange-600 font-black' },
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitReview({
      orderId,
      dishId: item.dishId,
      dishName: item.dishName,
      rating,
      comment: comment.trim() || 'Món ăn rất ngon, đóng gói nóng hổi vừa miệng!',
      tags: selectedTags,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  const activeStarScore = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-orange-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Đánh Giá Món Ăn
              </h3>
              <p className="text-[11px] text-slate-500">
                Đơn hàng: <span className="font-bold text-orange-600">{orderId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Cảm ơn bạn đã gửi đánh giá!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Đánh giá của bạn giúp căn tin nâng cao chất lượng món ăn và phục vụ các bạn sinh viên
              tốt hơn mỗi ngày.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Dish Info Card */}
            <div className="flex items-center gap-3 p-3 bg-orange-50/60 border border-orange-200/60 rounded-2xl">
              <img
                src={item.img}
                alt={item.dishName}
                className="w-14 h-14 rounded-xl object-cover border border-orange-200 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 truncate">{item.dishName}</h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  Số lượng: x{item.quantity} • {item.price.toLocaleString('vi-VN')}đ
                </div>
                <span className="inline-block mt-1 text-[10px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                  Đã thưởng thức
                </span>
              </div>
            </div>

            {/* Interactive Star Rating */}
            <div className="text-center space-y-2 py-2">
              <div className="text-xs font-bold text-slate-600">
                Chất lượng món ăn như thế nào? (Chọn 1 đến 5 sao)
              </div>

              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeStarScore;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 cursor-pointer transition hover:scale-125 active:scale-95 focus:outline-none"
                    >
                      <Star
                        className={`w-9 h-9 transition ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow-xs'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className={`text-xs font-bold transition ${ratingDescriptions[activeStarScore].color}`}>
                {ratingDescriptions[activeStarScore].text}
              </div>
            </div>

            {/* Quick praise tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-orange-600" />
                Điểm nổi bật của món:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                Nhận xét chi tiết của bạn:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ví dụ: Thịt sườn ướp rất vừa miệng, cơm dẻo nóng, nước chấm chua ngọt ăn kèm rất ngon..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs text-slate-800 transition resize-none"
              />
            </div>

            {/* Submit buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Để sau
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Gửi Đánh Giá Ngay
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
