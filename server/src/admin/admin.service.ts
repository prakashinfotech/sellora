import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from '../database/models/user.model';
import { Ad } from '../database/models/ad.model';
import { Category } from '../database/models/category.model';
import { Payment } from '../database/models/payment.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User)     private userModel:     typeof User,
    @InjectModel(Ad)       private adModel:       typeof Ad,
    @InjectModel(Category) private categoryModel: typeof Category,
    @InjectModel(Payment)  private paymentModel:  typeof Payment,
  ) {}

  // ── Dashboard ────────────────────────────────────────────────────────────
  async getStats() {
    const [totalUsers, totalAds, activeAds, totalPayments, revenue] =
      await Promise.all([
        this.userModel.count(),
        this.adModel.count(),
        this.adModel.count({ where: { status: 'active' } }),
        this.paymentModel.count({ where: { status: 'paid' } }),
        this.paymentModel.sum('amount', { where: { status: 'paid' } }),
      ]);

    const recentAds = await this.adModel.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });

    const recentUsers = await this.userModel.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'createdAt', 'role'],
    });

    return {
      totalUsers,
      totalAds,
      activeAds,
      totalPayments,
      revenue: revenue || 0,
      recentAds,
      recentUsers,
    };
  }

  // ── Users ─────────────────────────────────────────────────────────────────
  async getUsers(page = 1, limit = 20, search?: string) {
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name:  { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const { rows, count } = await this.userModel.findAndCountAll({
      where,
      attributes: { exclude: ['passwordHash', 'resetOtp', 'resetOtpExpiry'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });
    return { data: rows, total: count, page, limit };
  }

  async banUser(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    const newRole = user.role === 'banned' ? 'user' : 'banned';
    await user.update({ role: newRole });
    return { id: user.id, role: newRole };
  }

  async makeAdmin(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    await user.update({ role: 'admin' });
    return { id: user.id, role: 'admin' };
  }

  // ── Ads ───────────────────────────────────────────────────────────────────
  async getAds(page = 1, limit = 20, search?: string, status?: string) {
    const where: any = {};
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (status) where.status = status;

    const { rows, count } = await this.adModel.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });
    return { data: rows, total: count, page, limit };
  }

  async updateAdStatus(id: number, status: string) {
    const ad = await this.adModel.findByPk(id);
    if (!ad) throw new NotFoundException('Ad not found');
    await ad.update({ status });
    return ad;
  }

  async deleteAd(id: number) {
    const ad = await this.adModel.findByPk(id);
    if (!ad) throw new NotFoundException('Ad not found');
    await ad.destroy();
    return { deleted: true };
  }

  // ── Categories ────────────────────────────────────────────────────────────
  async getCategories() {
    return this.categoryModel.findAll({ order: [['name', 'ASC']] });
  }

  async createCategory(data: { name: string; slug: string; icon?: string }) {
    return this.categoryModel.create(data as any);
  }

  async updateCategory(id: number, data: { name?: string; slug?: string; icon?: string }) {
    const cat = await this.categoryModel.findByPk(id);
    if (!cat) throw new NotFoundException('Category not found');
    return cat.update(data);
  }

  async deleteCategory(id: number) {
    const cat = await this.categoryModel.findByPk(id);
    if (!cat) throw new NotFoundException('Category not found');
    await cat.destroy();
    return { deleted: true };
  }

  // ── Payments ──────────────────────────────────────────────────────────────
  async getPayments(page = 1, limit = 20) {
    const { rows, count } = await this.paymentModel.findAndCountAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Ad,   attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });
    return { data: rows, total: count, page, limit };
  }
}
