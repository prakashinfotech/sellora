import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favourite } from '../database/models/favourite.model';
import { Ad } from '../database/models/ad.model';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectModel(Favourite) private favouriteModel: typeof Favourite,
    @InjectModel(Ad) private adModel: typeof Ad,
  ) {}

  async toggle(userId: number, adId: number) {
    const existing = await this.favouriteModel.findOne({ where: { userId, adId } });
    if (existing) {
      await existing.destroy();
      return { saved: false };
    }
    await this.favouriteModel.create({ userId, adId } as any);
    return { saved: true };
  }

  async findByUser(userId: number) {
    return this.favouriteModel.findAll({
      where: { userId },
      include: [{ model: Ad }],
    });
  }
}
