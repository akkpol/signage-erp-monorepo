export class CreateDesignFileDto {
  organizationId: string;
  orderItemId: string;
  externalLink: string;
  uploadedById: string;
  notes?: string;
  tags?: string[];
}
