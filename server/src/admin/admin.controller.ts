import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin-jwt.guard';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  // Users
  @Get('users')
  getUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(+page, +limit, search);
  }

  @Patch('users/:id/ban')
  banUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.banUser(id);
  }

  @Patch('users/:id/make-admin')
  makeAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.makeAdmin(id);
  }

  // Ads
  @Get('ads')
  getAds(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAds(+page, +limit, search, status);
  }

  @Patch('ads/:id/status')
  updateAdStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.adminService.updateAdStatus(id, status);
  }

  @Delete('ads/:id')
  deleteAd(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteAd(id);
  }

  // Categories
  @Get('categories')
  getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  createCategory(@Body() body: { name: string; slug: string; icon?: string }) {
    return this.adminService.createCategory(body);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; slug?: string; icon?: string },
  ) {
    return this.adminService.updateCategory(id, body);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCategory(id);
  }

  // Payments
  @Get('payments')
  getPayments(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.adminService.getPayments(+page, +limit);
  }
}
