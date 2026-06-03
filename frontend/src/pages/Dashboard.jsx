import { useAppContext } from '../context/AppContext'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const { products, customers, orders, loading } = useAppContext()
  const lowStock = products.filter((product) => product.quantity_in_stock <= 10)

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total Products</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{products.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total Customers</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{customers.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total Orders</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{orders.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Low Stock Products</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{lowStock.length}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Low Stock Alerts</h2>
            <p className="mt-1 text-sm text-slate-500">Products with 10 or fewer units available.</p>
          </div>
          {loading ? <Spinner /> : null}
        </div>
        <div className="space-y-3">
          {lowStock.length > 0 ? (
            lowStock.map((product) => (
              <div key={product.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-sm text-rose-700">{product.quantity_in_stock} left</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">SKU: {product.sku}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">All products are stocked safely.</p>
          )}
        </div>
      </div>
    </section>
  )
}
