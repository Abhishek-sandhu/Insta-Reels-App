import { api } from './api'

export const PostService = {
  list: () => api.get('/posts'),
  create: (payload) => api.post('/posts', payload),
  uploadMedia: (formData) =>
    api.post('/posts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  remove: (id) => api.delete(`/posts/${id}`),
  getComments: (postId) => api.get(`/posts/${postId}/comments`),
  addComment: (postId, text) => api.post(`/posts/${postId}/comments`, { text }),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
}
