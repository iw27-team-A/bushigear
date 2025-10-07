'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/type';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_jp: '',
    name_cn: '',
    category: '',
    brand: '',
    price: '',
    image: '',
    description_en: '',
    description_jp: '',
    description_cn: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name_en: product.name_en,
      name_jp: product.name_jp,
      name_cn: product.name_cn,
      category: product.category,
      brand: product.brand,
      price: product.price.toString(),
      image: product.image,
      description_en: product.description_en,
      description_jp: product.description_jp,
      description_cn: product.description_cn,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_jp: '',
      name_cn: '',
      category: '',
      brand: '',
      price: '',
      image: '',
      description_en: '',
      description_jp: '',
      description_cn: '',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="p-8">読み込み中...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">商品管理ダッシュボード</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          新しい商品を追加
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingProduct ? '商品を編集' : '新しい商品を追加'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">英語名</label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">日本語名</label>
              <input
                type="text"
                value={formData.name_jp}
                onChange={(e) => setFormData({ ...formData, name_jp: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">中国語名</label>
              <input
                type="text"
                value={formData.name_cn}
                onChange={(e) => setFormData({ ...formData, name_cn: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">カテゴリー</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">選択してください</option>
                <option value="gloves">グローブ</option>
                <option value="mitts">ミット</option>
                <option value="protectors">プロテクター</option>
                <option value="fuku">道着</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ブランド</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">価格 (円)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">画像URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">英語説明</label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full p-2 border rounded h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">日本語説明</label>
              <textarea
                value={formData.description_jp}
                onChange={(e) => setFormData({ ...formData, description_jp: e.target.value })}
                className="w-full p-2 border rounded h-24"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">中国語説明</label>
              <textarea
                value={formData.description_cn}
                onChange={(e) => setFormData({ ...formData, description_cn: e.target.value })}
                className="w-full p-2 border rounded h-24"
                required
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingProduct ? '更新' : '追加'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日本語名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリー</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ブランド</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">価格</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">画像</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.name_jp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.brand}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ¥{product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <img src={product.image} alt={product.name_jp} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            商品がありません
          </div>
        )}
      </div>
    </div>
  );
}