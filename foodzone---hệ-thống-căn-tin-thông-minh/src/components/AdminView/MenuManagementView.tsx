import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  CheckCircle2,
  XCircle,
  Sparkles,
  Utensils,
  Image as ImageIcon,
} from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';
import { Dish, DishCategory } from '../../types';

export const MenuManagementView: React.FC = () => {
  const { dishes, addDish, updateDish, deleteDish, toggleDishStock } = useCanteen();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DishCategory>('lunch');
  const [price, setPrice] = useState<number>(30000);
  const [originalPrice, setOriginalPrice] = useState<number>(35000);
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(5);
  const [badge, setBadge] = useState('');
  const [inStock, setInStock] = useState(true);

  const sampleImages = [
    { label: 'Cơm sườn', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=500' },
    { label: 'Cơm gà', url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=500' },
    { label: 'Mì trộn', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=500' },
    { label: 'Trà sữa', url: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=500' },
    { label: 'Trà đào', url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=500' },
    { label: 'Bánh flan', url: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&q=80&w=500' },
  ];

  const handleOpenAdd = () => {
    setEditingDish(null);
    setName('');
    setCategory('lunch');
    setPrice(30000);
    setOriginalPrice(35000);
    setDescription('');
    setImg(sampleImages[0].url);
    setPrepTimeMinutes(5);
    setBadge('');
    setInStock(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dish: Dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setCategory(dish.category);
    setPrice(dish.price);
    setOriginalPrice(dish.originalPrice || dish.price);
    setDescription(dish.description);
    setImg(dish.img);
    setPrepTimeMinutes(dish.prepTimeMinutes);
    setBadge(dish.badge || '');
    setInStock(dish.inStock);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const categoryNames: Record<DishCategory, string> = {
      lunch: 'Cơm Trưa',
      snacks: 'Ăn Vặt',
      drinks: 'Đồ Uống',
      desserts: 'Tráng Miệng',
      combos: 'Combo Tiết Kiệm',
    };

    if (editingDish) {
      updateDish(editingDish.id, {
        name: name.trim(),
        category,
        categoryName: categoryNames[category],
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        description: description.trim(),
        img: img.trim() || sampleImages[0].url,
        prepTimeMinutes,
        badge: badge.trim() || undefined,
        inStock,
      });
    } else {
      addDish({
        name: name.trim(),
        category,
        categoryName: categoryNames[category],
        price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        description: description.trim(),
        img: img.trim() || sampleImages[0].url,
        prepTimeMinutes,
        badge: badge.trim() || undefined,
        inStock,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (dish: Dish) => {
    if (confirm(`Bạn có chắc chắn muốn xóa món "${dish.name}" khỏi thực đơn?`)) {
      deleteDish(dish.id);
    }
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchSearch =
      dish.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🍲</span> Quản Lý Thực Đơn Căn Tin
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Thêm món mới, điều chỉnh giá bán, đổi hình ảnh và cấu hình tình trạng còn hàng.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-orange-500/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Thêm Món Mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm món ăn trong kho..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {(['all', 'lunch', 'snacks', 'drinks', 'desserts', 'combos'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'all'
                ? 'Tất cả'
                : cat === 'lunch'
                ? 'Cơm trưa'
                : cat === 'snacks'
                ? 'Ăn vặt'
                : cat === 'drinks'
                ? 'Đồ uống'
                : cat === 'desserts'
                ? 'Tráng miệng'
                : 'Combo'}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Món Ăn</th>
                <th className="py-3 px-4">Danh Mục</th>
                <th className="py-3 px-4">Giá Bán</th>
                <th className="py-3 px-4 text-center">Thời Gian Nấu</th>
                <th className="py-3 px-4 text-center">Trạng Thái Kho</th>
                <th className="py-3 px-4 text-center">Số Lượng Đã Bán</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={dish.img}
                        alt={dish.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {dish.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                          {dish.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg text-[11px]">
                      {dish.categoryName}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-black text-orange-600 text-sm">
                      {dish.price.toLocaleString('vi-VN')}đ
                    </span>
                    {dish.originalPrice && dish.originalPrice > dish.price && (
                      <span className="text-[10px] text-slate-400 line-through ml-1.5">
                        {dish.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    {dish.prepTimeMinutes} phút
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleDishStock(dish.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                        dish.inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {dish.inStock ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Còn món
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-600" /> Tạm hết
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    {dish.orderCount.toLocaleString('vi-VN')} suất
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(dish)}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 flex items-center justify-center transition cursor-pointer"
                        title="Chỉnh sửa món"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(dish)}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 flex items-center justify-center transition cursor-pointer"
                        title="Xóa món"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
              <h2 className="text-base font-black">
                {editingDish ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới Vào Căn Tin'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên món ăn *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-orange-500 outline-none"
                  placeholder="VD: Cơm sườn nướng mật ong..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DishCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="lunch">Cơm Trưa</option>
                    <option value="snacks">Ăn Vặt</option>
                    <option value="drinks">Đồ Uống</option>
                    <option value="desserts">Tráng Miệng</option>
                    <option value="combos">Combo Tiết Kiệm</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thời gian nấu (phút)</label>
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    min={1}
                    max={60}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá bán (VND) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    step={1000}
                    min={1000}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-orange-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá gốc (nếu giảm)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    step={1000}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả nguyên liệu / hương vị</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:border-orange-500 outline-none"
                  placeholder="Mô tả ngắn gọn về suất ăn..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn ảnh món ăn</label>
                <input
                  type="url"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px] focus:border-orange-500 outline-none"
                  placeholder="https://..."
                />
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {sampleImages.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImg(s.url)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-orange-50 text-[10px] rounded border border-slate-200 font-medium text-slate-600"
                    >
                      Ảnh {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 accent-orange-600 rounded"
                  />
                  <span>Sẵn sàng phục vụ (Còn hàng)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl shadow-md transition"
                >
                  {editingDish ? 'Lưu Thay Đổi' : 'Thêm Vào Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
