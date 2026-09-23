import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  Clock,
  Star,
  Plus,
  Sparkles,
  ShoppingBag,
  Check,
  AlertCircle,
  TrendingUp,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { Dish, DishCategory } from '../../types';

interface MenuBrowsingProps {
  onOpenCart: () => void;
  filterOnlyCombos?: boolean;
}

export const MenuBrowsing: React.FC<MenuBrowsingProps> = ({ onOpenCart, filterOnlyCombos = false }) => {
  const { dishes, addToCart, cart } = useCanteen();
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>(
    filterOnlyCombos ? 'combos' : 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories: { id: DishCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất Cả Món', icon: '🍽️' },
    { id: 'lunch', label: 'Cơm Trưa & Món Nóng', icon: '🍚' },
    { id: 'combos', label: 'Combo Tiết Kiệm', icon: '🔥' },
    { id: 'snacks', label: 'Đồ Ăn Vặt', icon: '🍟' },
    { id: 'drinks', label: 'Đồ Uống & Trà Sữa', icon: '🧋' },
    { id: 'desserts', label: 'Tráng Miệng', icon: '🍮' },
  ];

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchCategory =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'combos'
          ? dish.category === 'combos' || dish.isCombo
          : dish.category === selectedCategory;

      const matchSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [dishes, selectedCategory, searchQuery]);

  const handleAddToCart = (dish: Dish) => {
    if (!dish.inStock) return;
    addToCart(dish);
    setJustAddedId(dish.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Campus Banner (only on full menu) */}
      {!filterOnlyCombos && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-xl shadow-orange-500/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" />
          <div className="relative p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
                <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                Căn tin Học Đường • Chuẩn Vị Sinh Viên
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Ăn Ngon, Nóng Hổi <br />
                <span className="text-amber-200">Giao Nhanh 10 Phút!</span>
              </h1>
              <p className="text-orange-50 text-sm sm:text-base leading-relaxed">
                Suất ăn dinh dưỡng chỉ từ 20.000đ - 35.000đ. Đặt món tiện lợi bằng mã VietQR, không cần xếp hàng chen chúc, shipper giao tận phòng KTX và giảng đường!
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <button
                  onClick={() => setSelectedCategory('combos')}
                  className="bg-white text-orange-700 hover:bg-orange-50 px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-md transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" /> Săn Combo Tiết Kiệm
                </button>
                <div className="text-xs text-orange-100 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-300" /> Miễn phí giao nội khu
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-300" /> Thanh toán QR tức thì
                  </span>
                </div>
              </div>
            </div>

            <div className="relative shrink-0 w-64 h-64 sm:w-72 sm:h-72 hidden md:block">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
                alt="Food Bowl"
                className="w-full h-full object-cover rounded-full border-4 border-white/80 shadow-2xl animate-spin-slow"
                style={{ animationDuration: '60s' }}
              />
              <div className="absolute -bottom-2 -left-2 bg-white text-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-slate-100">
                <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-base">
                  ⚡
                </span>
                <div>
                  <div className="text-slate-900 font-extrabold">Giao KTX 0đ</div>
                  <div className="text-slate-500 text-[10px]">Chỉ 5 - 10 phút</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header controls: Search & Category tabs */}
      <div className="sticky top-[102px] z-30 bg-slate-50/95 backdrop-blur-md py-3 -mx-4 px-4 border-b border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bim bim, bánh bao, sữa tươi, mì trộn..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick Search Tag Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 -mt-4">
        <span className="font-semibold text-slate-400">Gợi ý tìm nhanh:</span>
        {[
          { label: 'Bim bim giòn', query: 'bim bim' },
          { label: 'Bánh bao nóng', query: 'bánh bao' },
          { label: 'Sữa tươi', query: 'sữa' },
          { label: 'Mì trộn Indomie', query: 'mì trộn' },
          { label: 'Trà sữa', query: 'trà sữa' },
        ].map((tag) => (
          <button
            key={tag.query}
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery(tag.query);
            }}
            className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-slate-200 rounded-lg text-slate-600 font-medium transition cursor-pointer shadow-2xs"
          >
            {tag.label}
          </button>
        ))}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-orange-600 underline font-semibold ml-1 cursor-pointer"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Dishes Grid */}
      {filteredDishes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-3">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-800">Không tìm thấy món ăn nào</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            Thử tìm kiếm với từ khóa khác như "cơm", "mì", "trà" hoặc chọn xem tất cả danh mục món ăn nhé!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 bg-orange-50 text-orange-600 font-bold text-xs rounded-xl hover:bg-orange-100 transition cursor-pointer"
          >
            Xem toàn bộ thực đơn
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDishes.map((dish) => {
            const isAdded = justAddedId === dish.id;

            return (
              <div
                key={dish.id}
                className={`group bg-white rounded-2xl overflow-hidden border transition flex flex-col ${
                  dish.inStock
                    ? 'border-slate-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5'
                    : 'border-slate-200 opacity-75'
                }`}
              >
                {/* Image Container */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={dish.img}
                    alt={dish.name}
                    className={`w-full h-full object-cover transition duration-300 group-hover:scale-105 ${
                      !dish.inStock ? 'grayscale-40' : ''
                    }`}
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {dish.badge && (
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider ${
                          dish.badgeType === 'hot'
                            ? 'bg-red-500 text-white'
                            : dish.badgeType === 'sale'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {dish.badge}
                      </span>
                    )}
                    {!dish.inStock && (
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-900/90 text-white shadow-xs">
                        Tạm hết món
                      </span>
                    )}
                  </div>

                  {/* Prep time badge */}
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/70 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-300" />
                    <span>{dish.prepTimeMinutes}p</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wide">
                      {dish.categoryName}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 mt-0.5 group-hover:text-orange-600 transition">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {dish.description}
                    </p>

                    {/* Combo included list if combo */}
                    {dish.isCombo && dish.comboItems && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                        {dish.comboItems.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-50 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded-md"
                          >
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price and action button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                    <div>
                      <div className="text-base font-black text-orange-600">
                        {dish.price.toLocaleString('vi-VN')}đ
                      </div>
                      {dish.originalPrice && dish.originalPrice > dish.price && (
                        <div className="text-[11px] text-slate-400 line-through">
                          {dish.originalPrice.toLocaleString('vi-VN')}đ
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(dish)}
                      disabled={!dish.inStock}
                      className={`h-9 px-3.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs ${
                        !dish.inStock
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-600'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Đã Thêm!
                        </>
                      ) : !dish.inStock ? (
                        'Hết Món'
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Thêm Món
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Quick Bar when cart has items */}
      {cartTotalCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-sm relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {cartTotalCount}
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-400">Giỏ hàng của bạn:</div>
              <div className="font-extrabold text-base text-amber-300">
                {cartTotalPrice.toLocaleString('vi-VN')}đ
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCart}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            Xem Giỏ & Đặt <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
