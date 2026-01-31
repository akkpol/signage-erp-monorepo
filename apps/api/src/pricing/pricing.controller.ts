import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PricingService } from './pricing.service';
import type { PricingInput, PricingResult } from '@signage-erp/types';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) { }

  @Post('calculate')
  async calculate(@Body() input: PricingInput): Promise<PricingResult> {
    // Validate input
    const errors = this.pricingService.validateInput(input);
    if (errors.length > 0) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Calculate price
    return await this.pricingService.calculatePrice(input);
  }
}
