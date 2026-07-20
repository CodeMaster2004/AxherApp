export interface Discounts{
    discountId: number;
    discountType: string;
    amount: number;
    startDate: string; // formato "YYYY-MM-DD" para evitar problemas de timezone
    endDate: string;   // formato "YYYY-MM-DD"
    description: string;
}