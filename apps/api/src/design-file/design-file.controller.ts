import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { DesignFileService } from './design-file.service';

@Controller('design-files')
export class DesignFileController {
    constructor(private readonly designFileService: DesignFileService) { }

    @Post()
    async create(
        @Body()
        data: {
            organizationId: string;
            orderItemId: string;
            externalLink: string;
            uploadedById: string;
            notes?: string;
            tags?: string[];
        },
    ) {
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
