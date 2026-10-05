import React, { useState } from 'react';
import { Search, Flame, CheckCircle2, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { useCanteen } from '../../context/CanteenContext';

export const StockManagementView: React.FC = () => {
  const { dishes, toggleDishStock } = useCanteen();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'inStock' | 'outOfStock'>('all');

  const filteredDishes = dishes.filter((dish) => {
    const matchSearch =
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (filterType === 'inStock') return dish.inStock;
    if (filterType === 'outOfStock') return !dish.inStock;
    return true;
  });

  const inStockCount = dishes.filter((d) => d.inStock).length;
  const outOfStockCount = dishes.filter((d) => !d.inStock).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>⚡</span> Cập Nhật Trạng Thái Món Ăn (Kho Bếp)
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Bật hoặc tắt trạng thái món ăn ngay tức thì để học sinh không đặt phải món đã hết nguyên liệu.
          </p>
        </div>

        {/* Counts */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            Còn món: {inStockCount}
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-800 text-xs font-bold border border-red-200">
            Hết món: {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tên món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Tất cả ({dishes.length})
          </button>
          <button
            onClick={() => setFilterType('inStock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === 'inStock'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Đang phục vụ ({inStockCount})
          </button>
          <button
            onClick={() => setFilterType('outOfStock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === 'outOfStock'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Đang hết ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Dish table / grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className={`bg-white rounded-2xl p-4 border transition flex items-center justify-between gap-3 shadow-xs ${
              dish.inStock
                ? 'border-slate-200 hover:border-emerald-300'
                : 'border-red-200 bg-red-50/20'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={dish.img}
                alt={dish.name}
                className={`w-14 h-14 rounded-xl object-cover shrink-0 border ${
                  dish.inStock ? 'border-slate-200' : 'border-red-300 opacity-60'
                }`}
              />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-orange-600 uppercase">
                  {dish.categoryName}
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{dish.name}</h4>
                <div className="text-xs font-black text-slate-700 mt-0.5">
                  {dish.price.toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => toggleDishStock(dish.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0 ${
                dish.inStock
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-xs'
              }`}
            >
              {dish.inStock ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Còn Bán
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" /> Báo Hết
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
