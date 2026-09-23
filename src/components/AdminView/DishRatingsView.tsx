import React, { useState, useMemo } from 'react';
import {
  Star,
  Search,
  Filter,
  TrendingUp,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  User,
  Calendar,
  ThumbsUp,
  Tag,
  ArrowUpDown,
  Utensils,
  ChevronDown,
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { Dish, DishReview } from '../../types';

export const DishRatingsView: React.FC = () => {
  const { dishes, reviews, replyToReview } = useCanteen();

  const [activeTab, setActiveTab] = useState<'dishes' | 'reviews'>('dishes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating_desc' | 'rating_asc' | 'reviews_desc' | 'name'>('rating_desc');
  const [selectedDishForReviews, setSelectedDishForReviews] = useState<string>('all');

  // Admin reply draft states
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Overall metrics calculation
  const metrics = useMemo(() => {
    if (dishes.length === 0) {
      return { avgScore: 0, totalReviewsCount: 0, positiveRate: 100, topDish: null };
    }

    const totalReviews = dishes.reduce((sum, d) => sum + (d.reviewCount || 0), 0);
    const weightedRatingSum = dishes.reduce(
      (sum, d) => sum + d.rating * Math.max(d.reviewCount || 1, 1),
      0
    );
    const totalWeights = dishes.reduce((sum, d) => sum + Math.max(d.reviewCount || 1, 1), 0);
    const avgScore = Number((weightedRatingSum / totalWeights).toFixed(2));

    const sortedDishes = [...dishes].sort((a, b) => b.rating - a.rating);
    const topDish = sortedDishes[0] || null;

    // Positive rate (reviews >= 4 stars)
    const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
    const positiveRate =
      reviews.length > 0 ? Math.round((positiveReviews / reviews.length) * 100) : 98;

    return {
      avgScore,
      totalReviewsCount: totalReviews,
      positiveRate,
      topDish,
    };
  }, [dishes, reviews]);

  // Filter and sort dishes
  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => {
        const matchCategory =
          selectedCategory === 'all'
            ? true
            : selectedCategory === 'combos'
            ? dish.category === 'combos' || dish.isCombo
            : dish.category === selectedCategory;

        const matchSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating_desc') return b.rating - a.rating;
        if (sortBy === 'rating_asc') return a.rating - b.rating;
        if (sortBy === 'reviews_desc') return (b.reviewCount || 0) - (a.reviewCount || 0);
        return a.name.localeCompare(b.name);
      });
  }, [dishes, selectedCategory, searchQuery, sortBy]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchStar = starFilter === 'all' || review.rating === starFilter;
      const matchDish =
        selectedDishForReviews === 'all' || review.dishId === selectedDishForReviews;
      const matchSearch =
        review.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.dishName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStar && matchDish && matchSearch;
    });
  }, [reviews, starFilter, selectedDishForReviews, searchQuery]);

  const handleSendReply = (reviewId: string) => {
    const text = replyDrafts[reviewId]?.trim();
    if (!text) return;
    replyToReview(reviewId, text);
    setReplyDrafts((prev) => ({ ...prev, [reviewId]: '' }));
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
            <Sparkles className="w-4 h-4" /> Báo Cáo Chất Lượng & Phản Hồi Sinh Viên
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>⭐</span> Quản Lý Điểm Đánh Giá Món Ăn
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Theo dõi điểm đánh giá trung bình từng món ăn và lắng nghe góp ý thực tế từ học sinh.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dishes'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Bảng Điểm Từng Món ({dishes.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Nhận Xét Của Sinh Viên ({reviews.length})
          </button>
        </div>
      </div>

      {/* Hero Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Điểm trung bình toàn căn tin */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>ĐIỂM TRUNG BÌNH TOÀN CĂN TIN</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-4 h-4 fill-amber-500" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{metrics.avgScore}</span>
            <span className="text-sm font-bold text-slate-400">/ 5.0 sao</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600">
            <div className="flex text-amber-400">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} className="text-sm">
                  {s}
                </span>
              ))}
            </div>
            <span className="ml-1 text-slate-500 font-semibold">• Mức độ rất cao</span>
          </div>
        </div>

        {/* Card 2: Tổng lượt đánh giá */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>TỔNG LƯỢT ĐÁNH GIÁ</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {metrics.totalReviewsCount.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs font-semibold text-slate-500">lượt phản hồi</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-bold text-blue-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tăng 18% so với tuần trước</span>
          </div>
        </div>

        {/* Card 3: Tỷ lệ hài lòng (4-5 sao) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>TỶ LỆ HÀI LÒNG (4-5★)</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ThumbsUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{metrics.positiveRate}%</span>
            <span className="text-xs font-semibold text-slate-500">phản hồi tích cực</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đạt chuẩn vệ sinh & khẩu vị</span>
          </div>
        </div>

        {/* Card 4: Món được đánh giá cao nhất */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>MÓN ĐƯỢC KHEN NGỢI NHẤT</span>
            <span className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Utensils className="w-4 h-4" />
            </span>
          </div>
          <div className="truncate font-black text-sm text-slate-900 mt-1">
            {metrics.topDish?.name || 'Cơm Sườn Cốt Lết'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-black px-2 py-0.5 rounded-lg">
              <Star className="w-3 h-3 fill-amber-500" /> {metrics.topDish?.rating || 4.9}★
            </span>
            <span className="text-xs text-slate-500">
              ({metrics.topDish?.reviewCount || 148} đánh giá)
            </span>
          </div>
        </div>
      </div>

      {/* View 1: Bảng Điểm Đánh Giá Trung Bình Của Từng Món Ăn */}
      {activeTab === 'dishes' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm món ăn theo tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="lunch">Cơm Trưa & Món Nóng</option>
                <option value="combos">Combo Tiết Kiệm</option>
                <option value="snacks">Đồ Ăn Vặt</option>
                <option value="drinks">Đồ Uống & Trà Sữa</option>
                <option value="desserts">Tráng Miệng</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
              >
                <option value="rating_desc">Điểm sao cao nhất (5★ → 1★)</option>
                <option value="rating_asc">Điểm sao thấp nhất (1★ → 5★)</option>
                <option value="reviews_desc">Nhiều lượt đánh giá nhất</option>
                <option value="name">Tên món A-Z</option>
              </select>
            </div>
          </div>

          {/* Dishes Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Món Ăn</th>
                    <th className="py-3.5 px-4">Danh Mục</th>
                    <th className="py-3.5 px-4">Giá Bán</th>
                    <th className="py-3.5 px-4 text-center">Điểm Đánh Giá TB</th>
                    <th className="py-3.5 px-4 text-center">Số Lượt Đánh Giá</th>
                    <th className="py-3.5 px-4">Mức Độ Hài Lòng</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDishes.map((dish) => {
                    const isExcellent = dish.rating >= 4.8;
                    const isGood = dish.rating >= 4.5 && dish.rating < 4.8;
                    const isFair = dish.rating < 4.5;

                    return (
                      <tr key={dish.id} className="hover:bg-slate-50/70 transition">
                        {/* Dish Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.img}
                              alt={dish.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-extrabold text-slate-900 text-sm">{dish.name}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                                {dish.description}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                            {dish.categoryName}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {dish.price.toLocaleString('vi-VN')}đ
                        </td>

                        {/* Average Rating with Stars */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span className="text-sm font-black text-amber-900">{dish.rating}</span>
                            <span className="text-[10px] text-amber-700 font-semibold">/ 5.0</span>
                          </div>
                        </td>

                        {/* Review count */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-slate-900 text-sm">
                            {(dish.reviewCount || 0).toLocaleString('vi-VN')}
                          </span>
                          <span className="text-[11px] text-slate-500 ml-1">lượt</span>
                        </td>

                        {/* Rating Classification */}
                        <td className="py-3.5 px-4">
                          {isExcellent ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              ⭐ Xuất sắc
                            </span>
                          ) : isGood ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                              Rất tốt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Cần giữ vị chuẩn
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedDishForReviews(dish.id);
                              setActiveTab('reviews');
                            }}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            Xem nhận xét →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Danh Sách Chi Tiết Nhận Xét Của Sinh Viên */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Controls Bar for Reviews */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter by Star */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Lọc theo sao:
              </span>
              {(['all', 5, 4, 3, 2] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStarFilter(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    starFilter === s
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s === 'all' ? 'Tất cả' : `${s} ★`}
                </button>
              ))}
            </div>

            {/* Filter by specific Dish */}
            <div className="flex items-center gap-2">
              <select
                value={selectedDishForReviews}
                onChange={(e) => setSelectedDishForReviews(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none max-w-xs truncate"
              >
                <option value="all">Tất cả món ăn</option>
                {dishes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.rating}★)
                  </option>
                ))}
              </select>

              {selectedDishForReviews !== 'all' && (
                <button
                  onClick={() => setSelectedDishForReviews('all')}
                  className="text-xs text-orange-600 font-bold hover:underline"
                >
                  Xóa lọc món
                </button>
              )}
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">Không tìm thấy nhận xét phù hợp</h3>
              <p className="text-xs text-slate-500 mt-1">
                Hãy thử chọn bộ lọc khác hoặc kiểm tra lại tên món ăn.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => {
                const isReplying = activeReplyId === review.id;
                const draftText = replyDrafts[review.id] || '';

                return (
                  <div
                    key={review.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
                  >
                    {/* Review Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                          {review.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {review.studentName}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              (Mã đơn: <span className="text-orange-600 font-mono">{review.orderId}</span>)
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}{' '}
                            {new Date(review.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Stars & Dish Name */}
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-xs font-black text-amber-900">
                            {review.rating}.0
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 mt-0.5">
                          {review.dishName}
                        </span>
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      "{review.comment}"
                    </p>

                    {/* Review Tags */}
                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {review.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-lg border border-orange-200"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Admin Reply Section */}
                    {review.adminReply ? (
                      <div className="mt-3 p-3.5 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-purple-900">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            Phản hồi từ Ban Quản Lý Căn Tin:
                          </span>
                          <span className="text-[10px] text-purple-600 font-semibold">
                            Chính thức
                          </span>
                        </div>
                        <p className="text-purple-800 text-xs leading-relaxed">
                          {review.adminReply}
                        </p>
                      </div>
                    ) : isReplying ? (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <label className="block text-xs font-bold text-slate-700">
                          Nhập phản hồi gửi đến sinh viên {review.studentName}:
                        </label>
                        <textarea
                          rows={2}
                          value={draftText}
                          onChange={(e) =>
                            setReplyDrafts({ ...replyDrafts, [review.id]: e.target.value })
                          }
                          placeholder="Cảm ơn bạn đã phản hồi! Căn tin xin ghi nhận và..."
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveReplyId(null)}
                            className="px-3 py-1.5 text-xs text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => handleSendReply(review.id)}
                            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Send className="w-3 h-3" /> Gửi phản hồi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => setActiveReplyId(review.id)}
                          className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Phản hồi nhận xét này
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
