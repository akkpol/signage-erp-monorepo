// ============================================
// CORE DOMAIN TYPES
// ============================================

/**
 * หน่วยวัด (Unit of Measurement)
 */
export enum UnitType {
    METER = 'METER',           // เมตร
    SQUARE_METER = 'SQUARE_METER', // ตารางเมตร
    PIECE = 'PIECE',           // ชิ้น
    SET = 'SET',               // ชุด
    HOUR = 'HOUR',             // ชั่วโมง
}

/**
 * วัสดุ (Material)
 */
export interface PricingTier {
    id: string;
    minQuantity: number;
    discountPercent: number;
}

export interface Material {
    id: string;
    name: string;
    type: string;              // VINYL, SUBSTRATE, etc.
    costPrice: number;         // ต้นทุน
    sellingPrice: number;      // ราคาขาย
    wasteFactor: number;       // เผื่อเสีย (e.g. 1.15)
    unit: string;
    inStock: number;
    pricingTiers?: PricingTier[];
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * ประเภทสินค้า/ป้าย (Product Type)
 */
export enum ProductType {
    FLEX_BANNER = 'FLEX_BANNER',       // ป้าย Flex
    INKJET = 'INKJET',                 // ป้าย Inkjet
    LED_SIGN = 'LED_SIGN',             // ป้าย LED
    ACRYLIC_SIGN = 'ACRYLIC_SIGN',     // ป้ายอะคริลิค
    STICKER = 'STICKER',               // สติ๊กเกอร์
    CUSTOM = 'CUSTOM',                 // สั่งทำพิเศษ
}

/**
 * สินค้า (Product)
 */
export interface Product {
    id: string;
    type: ProductType;
    name: string;
    description?: string;
    defaultMaterialId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// PRICING ENGINE TYPES
// ============================================

/**
 * ประเภทค่าแรง (Labor Type)
 */
export enum LaborType {
    DESIGN = 'DESIGN',           // ค่าออกแบบ
    PRINTING = 'PRINTING',       // ค่าพิมพ์
    INSTALLATION = 'INSTALLATION', // ค่าติดตั้ง
    TRANSPORT = 'TRANSPORT',     // ค่าขนส่ง
    OTHER = 'OTHER',             // อื่นๆ
}

/**
 * ค่าแรง (Labor Cost)
 */
export interface LaborCost {
    type: LaborType;
    description?: string;
    amount: number;              // จำนวนเงิน
    unit?: UnitType;             // หน่วย (ถ้ามี)
    quantity?: number;           // จำนวน (ถ้ามี)
}

/**
 * ข้อมูลการคำนวณราคา (Pricing Input)
 */
export interface PricingInput {
    productType: ProductType;
    materialId: string;
    width?: number;              // ความกว้าง (เมตร)
    height?: number;             // ความสูง (เมตร)
    quantity: number;            // จำนวน
    laborCosts: LaborCost[];     // ค่าแรงต่างๆ
    discountPercent?: number;    // ส่วนลด (%)
    marginPercent?: number;      // มาร์จิ้น (%)
}

/**
 * รายละเอียดการคำนวณราคา (Pricing Breakdown)
 */
export interface PricingBreakdown {
    materialCost: number;        // ค่าวัสดุ
    laborCost: number;           // ค่าแรงรวม
    subtotal: number;            // ราคาก่อนส่วนลด
    discount: number;            // ส่วนลด
    total: number;               // ราคารวม
    laborDetails: LaborCost[];   // รายละเอียดค่าแรง
}

/**
 * ผลลัพธ์การคำนวณราคา (Pricing Result)
 */
export interface PricingResult {
    input: PricingInput;
    breakdown: PricingBreakdown;
    calculatedAt: Date;
}

// ============================================
// CUSTOMER TYPES
// ============================================

/**
 * ลูกค้า (Customer)
 */
export interface Customer {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    taxId?: string;              // เลขประจำตัวผู้เสียภาษี
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// QUOTE & ORDER TYPES
// ============================================

/**
 * สถานะใบเสนอราคา (Quote Status)
 */
export enum QuoteStatus {
    DRAFT = 'DRAFT',             // ร่าง
    SENT = 'SENT',               // ส่งแล้ว
    APPROVED = 'APPROVED',       // อนุมัติ
    REJECTED = 'REJECTED',       // ปฏิเสธ
    EXPIRED = 'EXPIRED',         // หมดอายุ
}

/**
 * รายการในใบเสนอราคา (Quote Item)
 */
export interface QuoteItem {
    id: string;
    productType: ProductType;
    materialId: string;
    materialName: string;
    width?: number;
    height?: number;
    quantity: number;
    unitPrice: number;           // ราคาต่อหน่วย
    totalPrice: number;          // ราคารวม
    laborCosts: LaborCost[];
    notes?: string;
}

/**
 * ใบเสนอราคา (Quote)
 */
export interface Quote {
    id: string;
    quoteNumber: string;         // เลขที่ใบเสนอราคา
    customerId: string;
    customerName: string;
    status: QuoteStatus;
    items: QuoteItem[];
    subtotal: number;
    discount: number;
    total: number;
    validUntil?: Date;           // วันหมดอายุ
    notes?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * สถานะใบสั่งงาน (Order Status)
 */
export enum OrderStatus {
    PENDING = 'PENDING',         // รอดำเนินการ
    IN_PRODUCTION = 'IN_PRODUCTION', // กำลังผลิต
    COMPLETED = 'COMPLETED',     // เสร็จแล้ว
    DELIVERED = 'DELIVERED',     // ส่งมอบแล้ว
    CANCELLED = 'CANCELLED',     // ยกเลิก
}

/**
 * ใบสั่งงาน (Order)
 */
export interface Order {
    id: string;
    orderNumber: string;         // เลขที่ใบสั่งงาน
    quoteId?: string;            // อ้างอิงจากใบเสนอราคา
    customerId: string;
    customerName: string;
    status: OrderStatus;
    items: QuoteItem[];          // ใช้โครงสร้างเดียวกับ QuoteItem
    subtotal: number;
    discount: number;
    total: number;
    dueDate?: Date;              // วันครบกำหนด
    notes?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// PRODUCTION TYPES
// ============================================

/**
 * สถานะงานผลิต (Production Job Status)
 */
export enum ProductionStatus {
    PENDING = 'PENDING',         // รอผลิต
    IN_PROGRESS = 'IN_PROGRESS', // กำลังผลิต
    COMPLETED = 'COMPLETED',     // เสร็จแล้ว
    ON_HOLD = 'ON_HOLD',         // พักงาน
}

/**
 * งานผลิต (Production Job)
 */
export interface ProductionJob {
    id: string;
    orderId: string;
    orderNumber: string;
    status: ProductionStatus;
    items: QuoteItem[];          // รายการที่ต้องผลิต
    assignedTo?: string;         // มอบหมายให้ใคร
    startDate?: Date;
    dueDate?: Date;
    completedDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// USER TYPES
// ============================================

/**
 * บทบาทผู้ใช้ (User Role)
 */
export enum UserRole {
    ADMIN = 'ADMIN',             // ผู้ดูแลระบบ
    SALES = 'SALES',             // เซลล์
    ACCOUNTANT = 'ACCOUNTANT',   // บัญชี
    DESIGNER = 'DESIGNER',       // กราฟิก
    PRODUCTION = 'PRODUCTION',   // ฝ่ายผลิต
}

/**
 * ผู้ใช้ (User)
 */
export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
