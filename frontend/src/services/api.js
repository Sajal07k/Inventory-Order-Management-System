import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://inventory-order-management-system-lqz3.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

const api = {
  getProducts: () => apiClient.get('/products').then((res) => res.data),
  createProduct: (payload) => apiClient.post('/products', payload).then((res) => res.data),
  updateProduct: (id, payload) => apiClient.put(`/products/${id}`, payload).then((res) => res.data),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),

  getCustomers: () => apiClient.get('/customers').then((res) => res.data),
  createCustomer: (payload) => apiClient.post('/customers', payload).then((res) => res.data),
  deleteCustomer: (id) => apiClient.delete(`/customers/${id}`),

  getOrders: () => apiClient.get('/orders').then((res) => res.data),
  createOrder: (payload) => apiClient.post('/orders', payload).then((res) => res.data),
  getOrder: (id) => apiClient.get(`/orders/${id}`).then((res) => res.data),
  deleteOrder: (id) => apiClient.delete(`/orders/${id}`),
}

export default api
