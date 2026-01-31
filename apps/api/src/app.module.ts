import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PricingModule } from './pricing/pricing.module';

@Module({
  imports: [PricingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
