import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PricingModule } from './pricing/pricing.module';
import { DatabaseModule } from './database/database.module';
import { DesignFileModule } from './design-file/design-file.module';

@Module({
  imports: [DatabaseModule, PricingModule, DesignFileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
