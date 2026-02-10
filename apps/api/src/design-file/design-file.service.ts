import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DesignFileService {
    constructor(private prisma: PrismaService) { }

    /**
     * สร้าง DesignFile ใหม่พร้อมระบบตั้งชื่ออัตโนมัติ
     * รูปแบบ: {ORG}-{ORDER}-{SEQ}-V{VERSION}.ai
     */
    async create(data: {
        organizationId: string;
        orderItemId: string;
        externalLink: string;
        uploadedById: string;
        notes?: string;
        tags?: string[];
    }) {
        // 1. ดึงข้อมูลที่จำเป็นสำหรับการตั้งชื่อ (Organization Name, Order Number)
        const orderItem = await this.prisma.orderItem.findUnique({
            where: { id: data.orderItemId },
            include: {
                order: {
                    include: {
                        organization: true,
                    },
                },
            },
        });

        if (!orderItem) {
            throw new NotFoundException('OrderItem not found');
        }

        const orgPrefix = orderItem.order.organization.name
            .substring(0, 3)
            .toUpperCase();
        const orderNum = orderItem.order.orderNumber;

        // 2. หาจำนวนไฟล์ที่มีอยู่แล้วใน OrderItem นี้ เพื่อทำเลข Sequence (001, 002, ...)
        const existingFilesCount = await this.prisma.designFile.count({
            where: { orderItemId: data.orderItemId },
        });

        const seq = String(existingFilesCount + 1).padStart(3, '0');
        const version = 1;
        const extension = 'ai'; // Default extension for signage designs

        const fileName = `${orgPrefix}-${orderNum}-${seq}-V${version}.${extension}`;

        // 3. บันทึกลง Database
        return this.prisma.designFile.create({
            data: {
                organizationId: data.organizationId,
                orderItemId: data.orderItemId,
                fileName,
                externalLink: data.externalLink,
                version,
                status: 'draft',
                uploadedById: data.uploadedById,
                notes: data.notes,
                tags: data.tags || [],
            },
        });
    }

    async findAllByOrderItem(orderItemId: string) {
        return this.prisma.designFile.findMany({
            where: { orderItemId },
            orderBy: { version: 'desc' },
            include: {
                uploadedBy: {
                    select: { name: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const file = await this.prisma.designFile.findUnique({
            where: { id },
        });
        if (!file) throw new NotFoundException('Design file not found');
        return file;
    }
}
