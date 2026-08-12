import { api } from '../common/axiosInstance';

export const fetchFavourites = async () => {
  try {
    const response = await api.get('/favourites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favourites:', error);
    throw error;
  }
};

export const toggleFavourite = async (adId: number) => {
  try {
    const response = await api.post(`/favourites/${adId}/toggle`);
    return response.data;
  } catch (error) {
    console.error('Error toggling favourite:', error);
    throw error;
  }
};
