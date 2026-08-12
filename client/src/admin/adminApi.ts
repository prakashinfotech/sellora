import { api } from '../common/axiosInstance';

export const adminApi = {
  getStats:         ()                              => api.get('/admin/stats').then(r => r.data),
  getUsers:         (p = 1, s?: string)             => api.get('/admin/users',    { params: { page: p, search: s } }).then(r => r.data),
  banUser:          (id: number)                    => api.patch(`/admin/users/${id}/ban`).then(r => r.data),
  makeAdmin:        (id: number)                    => api.patch(`/admin/users/${id}/make-admin`).then(r => r.data),
  getAds:           (p = 1, s?: string, st?: string)=> api.get('/admin/ads',      { params: { page: p, search: s, status: st } }).then(r => r.data),
  updateAdStatus:   (id: number, status: string)    => api.patch(`/admin/ads/${id}/status`, { status }).then(r => r.data),
  deleteAd:         (id: number)                    => api.delete(`/admin/ads/${id}`).then(r => r.data),
  getCategories:    ()                              => api.get('/admin/categories').then(r => r.data),
  createCategory:   (d: any)                        => api.post('/admin/categories', d).then(r => r.data),
  updateCategory:   (id: number, d: any)            => api.patch(`/admin/categories/${id}`, d).then(r => r.data),
  deleteCategory:   (id: number)                    => api.delete(`/admin/categories/${id}`).then(r => r.data),
  getPayments:      (p = 1)                         => api.get('/admin/payments',  { params: { page: p } }).then(r => r.data),
};
