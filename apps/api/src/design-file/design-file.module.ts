import { Module } from '@nestjs/common';
import { DesignFileService } from './design-file.service';
import { DesignFileController } from './design-file.controller';

@Module({
    controllers: [DesignFileController],
    providers: [DesignFileService],
    exports: [DesignFileService],
})
export class DesignFileModule { }
