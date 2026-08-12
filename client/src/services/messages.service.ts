import { api } from '../common/axiosInstance';;

export interface SendMessagePayload {
  receiverId: number;
  adId: number;
  message: string;
}

export const sendMessage = (data: SendMessagePayload) =>
  api.post('/messages', data).then((r) => r.data);

export const getConversations = () =>
  api.get('/messages').then((r) => r.data);

export const getThread = (otherUserId: number, adId: number) =>
  api.get(`/messages/thread?otherUserId=${otherUserId}&adId=${adId}`).then((r) => r.data);
