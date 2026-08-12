import { api } from '../common/axiosInstance';

export interface AdFilters {
  search?: string;
  categoryId?: number;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CreateAdPayload {
  title: string;
  description?: string;
  price: number;
  images?: string[];
  categoryId: number;
  city?: string;
  state?: string;
}

export const fetchAllAds = async (filters: AdFilters = {}) => {
  try {
    const response = await api.get('/ads', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching ads:', error);
    throw error;
  }
};

export const fetchAdById = async (id: number) => {
  try {
    const response = await api.get(`/ads/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ad detail:', error);
    throw error;
  }
};

export const fetchMyAds = async () => {
  try {
    const response = await api.get('/ads/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching my ads:', error);
    throw error;
  }
};

export const createAd = async (data: CreateAdPayload) => {
  try {
    const response = await api.post('/ads', data);
    return response.data;
  } catch (error) {
    console.error('Error creating ad:', error);
    throw error;
  }
};

export const updateAd = async (id: number, data: Partial<CreateAdPayload> & { status?: string }) => {
  try {
    const response = await api.patch(`/ads/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating ad:', error);
    throw error;
  }
};

export const deleteAd = async (id: number) => {
  try {
    const response = await api.delete(`/ads/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting ad:', error);
    throw error;
  }
};
