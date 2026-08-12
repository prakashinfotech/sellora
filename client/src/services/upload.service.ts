import { api } from '../common/axiosInstance';

export const uploadImages = async (files: FileList): Promise<string[]> => {
  try {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    const response = await api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.urls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};
