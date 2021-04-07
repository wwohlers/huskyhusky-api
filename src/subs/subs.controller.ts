import { Body, Controller, Delete, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { SubsService } from './subs.service';
import { SingleStringDto } from '../dto/single-string.dto';
import { IsAdminGuard } from '../users/guards/is-admin.guard';

@Controller('subs')
export class SubsController {
  constructor(
    private subsService: SubsService
  ) {}

  @Post()
  async subscribe(
    @Body(ValidationPipe) dto: SingleStringDto
  ) {
    return this.subsService.createSub(dto.value);
  }

  @Delete()
  async unsubscribe(
    @Body(ValidationPipe) dto: SingleStringDto
  ) {
    return this.subsService.removeSub(dto.value);
  }

  @UseGuards(IsAdminGuard)
  @Get()
  async getAllSubs() {
    return this.subsService.getAllSubs();
  }
}
