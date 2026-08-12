import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from '../database/models/message.model';
import { User } from '../database/models/user.model';
import { Ad } from '../database/models/ad.model';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message) private messageModel: typeof Message) {}

  async send(senderId: number, receiverId: number, adId: number, body: string) {
    return this.messageModel.create({ senderId, receiverId, adId, body } as any);
  }

  async getConversations(userId: number) {
    const messages = await this.messageModel.findAll({
      where: { senderId: userId } as any,
      include: [
        { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] },
        { model: Ad, attributes: ['id', 'title', 'images', 'price'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const received = await this.messageModel.findAll({
      where: { receiverId: userId } as any,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
        { model: Ad, attributes: ['id', 'title', 'images', 'price'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return { sent: messages, received };
  }

  async getThread(userId: number, otherUserId: number, adId: number) {
    const { Op } = require('sequelize');
    return this.messageModel.findAll({
      where: {
        adId,
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      } as any,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
      ],
      order: [['createdAt', 'ASC']],
    });
  }
}
