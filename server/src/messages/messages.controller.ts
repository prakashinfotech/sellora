import { Controller, Post, Get, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  send(
    @CurrentUser() user: { id: number },
    @Body() body: { receiverId: number; adId: number; message: string },
  ) {
    return this.messagesService.send(user.id, body.receiverId, body.adId, body.message);
  }

  @Get()
  getConversations(@CurrentUser() user: { id: number }) {
    return this.messagesService.getConversations(user.id);
  }

  @Get('thread')
  getThread(
    @CurrentUser() user: { id: number },
    @Query('otherUserId', ParseIntPipe) otherUserId: number,
    @Query('adId', ParseIntPipe) adId: number,
  ) {
    return this.messagesService.getThread(user.id, otherUserId, adId);
  }
}
