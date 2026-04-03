import { RecordType } from '@prisma/client';

export interface RecordFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: RecordType;
  userId?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
