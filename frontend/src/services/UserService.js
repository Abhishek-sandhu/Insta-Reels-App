// UserService.js
import { api } from './api'

export const UserService = {
  searchUsers: (query) => api.get('/users/search', { params: { q: query } }),
  getUser: (id) => api.get(`/users/${id}`),
}
