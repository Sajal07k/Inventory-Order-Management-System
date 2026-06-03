import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import api from '../services/api'

const emptyItem = { product_id: '', quantity: 1 }

export default function Orders() {
  const { products, customers, orders, loadAll, notify } = useAppContext()
  const [items, setItems] = useState([emptyItem])
  const [customerId, setCustomerId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const customerOptions = useMemo(() => customers, [customers])

  const handleItemChange = (index, field, value) => {
    setItems((current) => current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)))
  }

  const addItem = () => {
    setItems((current) => [...current, emptyItem])
  }

  const removeItem = (index) => {
    setItems((current) => current.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!customerId || items.length === 0) {
      notify('Select a customer and at least one product.', 'error')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        customer_id: Number(customerId),
        items: items
          .filter((item) => item.product_id && item.quantity > 0)
          .map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          })),
      }
      await api.createOrder(payload)
      notify('Order created successfully.')
      setCustomerId('')
      setItems([emptyItem])
      loadAll()
    } catch (error) {
      notify(error.response?.data?.detail || error.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Create Order</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Customer</label>
            <select
              required
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-900">
              <option value="">Select customer</option>
              {customerOptions.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-[1fr_120px_80px] items-end">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Product</label>
                  <select
                    required
                    value={item.product_id}
                    onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-900">
                    <option value="">Select item</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Quantity</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
                <button type="button" onClick={() => removeItem(index)} className="rounded-full bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-200">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="rounded-full bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
            Add Another Product
          </button>
          <button type="submit" disabled={submitting} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            Create Order
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Order History</h2>
            <p className="text-sm text-slate-500">Recent orders and details.</p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Total</th>
                <th className="py-3">Items</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100">
                  <td className="py-3">#{order.id}</td>
                  <td className="py-3">{order.customer_id}</td>
                  <td className="py-3">${order.total_amount}</td>
                  <td className="py-3">{order.items.length}</td>
                  <td className="py-3">
                    <Link to={`/orders/${order.id}`} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
