import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../database/models/category.model';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  findAll() {
    return this.categoryModel.findAll({
      where: { parentId: null },
      include: [{ model: Category, as: 'subcategories' }],
    });
  }

  findOne(slug: string) {
    return this.categoryModel.findOne({ where: { slug } });
  }
}
