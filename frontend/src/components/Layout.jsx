import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Customers', path: '/customers' },
  { label: 'Orders', path: '/orders' },
]

export default function Layout({ children }) {
  const { notification } = useAppContext()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-4 py-4 lg:px-6">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Inventory & Orders</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Management Dashboard</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white'
                    : 'rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
                }>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        {notification ? (
          <div className={`mb-4 rounded-2xl p-4 text-sm shadow ${notification.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {notification.message}
          </div>
        ) : null}

        <main>{children}</main>
      </div>
    </div>
  )
}
