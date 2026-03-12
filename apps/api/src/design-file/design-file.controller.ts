import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DesignFileService } from './design-file.service';
import { CreateDesignFileDto } from './dto/create-design-file.dto';

@Controller('design-files')
export class DesignFileController {
    constructor(private readonly designFileService: DesignFileService) { }

    @Post()
    async create(@Body() data: CreateDesignFileDto) {
        return this.designFileService.create(data);
    }

    @Get('order-item/:id')
    async findByOrderItem(@Param('id') orderItemId: string) {
        return this.designFileService.findAllByOrderItem(orderItemId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.designFileService.findOne(id);
    }
}
