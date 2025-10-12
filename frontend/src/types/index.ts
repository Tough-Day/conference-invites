export type FieldType = 'TEXT' | 'EMAIL' | 'PHONE' | 'URL' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'RADIO';

export interface FormField {
  id?: string;
  fieldName: string;
  label: string;
  fieldType: FieldType;
  placeholder?: string;
  required: boolean;
  order: number;
  validation?: any;
  options?: string[]; // For SELECT and RADIO field types
  isActive?: boolean; // Field lifecycle - false means archived/deprecated
  originalFieldId?: string; // Links to original field when versioned
}

export interface Conference {
  id: string;
  name: string;
  slug: string;
  description?: string;
  formInstructions?: string;
  logoUrl?: string;
  primaryColor?: string;
  formUrl?: string;
  shortUrl?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  formFields: FormField[];
  _count?: {
    submissions: number;
  };
}

export interface Submission {
  id: string;
  conferenceId: string;
  formData: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  submittedAt: string;
  conference?: {
    name: string;
    slug: string;
  };
}

export interface AnalyticsSummary {
  pageViews: number;
  qrScans: number;
  submissions: number;
  conversionRate: string;
}
