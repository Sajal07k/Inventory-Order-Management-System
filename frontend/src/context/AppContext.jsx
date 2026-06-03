import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  const loadAll = async () => {
    setLoading(true)
    try {
      const [productsRes, customersRes, ordersRes] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getOrders(),
      ])
      setProducts(productsRes)
      setCustomers(customersRes)
      setOrders(ordersRes)
    } catch (error) {
      setNotification({ type: 'error', message: error.message || 'Unable to load data' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    window.setTimeout(() => setNotification(null), 3500)
  }

  return (
    <AppContext.Provider
      value={{
        products,
        customers,
        orders,
        loading,
        notification,
        loadAll,
        notify,
      }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
