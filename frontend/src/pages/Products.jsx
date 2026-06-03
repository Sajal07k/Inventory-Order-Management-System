import { useMemo, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import api from '../services/api'

export default function Products() {
  const { products, loadAll, notify } = useAppContext()
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity_in_stock: '' })
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === editingId) ?? null,
    [editingId, products]
  )

  const resetForm = () => {
    setForm({ name: '', sku: '', price: '', quantity_in_stock: '' })
    setEditingId(null)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        quantity_in_stock: Number(form.quantity_in_stock),
      }
      if (editingId) {
        await api.updateProduct(editingId, payload)
        notify('Product updated successfully.')
      } else {
        await api.createProduct(payload)
        notify('Product created successfully.')
      }
      resetForm()
      loadAll()
    } catch (error) {
      notify(error.response?.data?.detail || error.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity_in_stock: product.quantity_in_stock,
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.deleteProduct(id)
      notify('Product deleted successfully.')
      loadAll()
    } catch (error) {
      notify(error.response?.data?.detail || error.message, 'error')
    }
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Product' : 'Add Product'}</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">SKU</label>
              <input
                required
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Price</label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Stock Quantity</label>
                <input
                  required
                  type="number"
                  min="0"
                  name="quantity_in_stock"
                  value={form.quantity_in_stock}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={submitting} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
              {editingId ? (
                <button type="button" onClick={resetForm} className="rounded-full border border-slate-200 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Product List</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3">Name</th>
                  <th className="py-3">SKU</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Stock</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100">
                    <td className="py-3">{product.name}</td>
                    <td className="py-3">{product.sku}</td>
                    <td className="py-3">${product.price}</td>
                    <td className="py-3">{product.quantity_in_stock}</td>
                    <td className="py-3 space-x-2">
                      <button onClick={() => handleEdit(product)} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
