// Sanity types
export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  code: string;
  icon?: string;
  backgroundColor?: string;
  description?: string;
  order: number;
}

export interface ProductLine {
  _id: string;
  title: string;
  slug: { current: string };
  logo?: string;
  logoColor?: string;
  backgroundColor?: string;
  description?: string;
  order: number;
  category: Category;
}

export interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  sku?: string;
  image?: string;
  imageColor?: string;
  imageBW?: string;
  order: number;
  commonMarkets?: string[];
  applications?: string;
  flowDirection?: string;
  micronRatings?: string;
  standardEfficiency?: string;
  mediaOptions?: string[];
  hardwareOptions?: string[];
  diameter?: string;
  standardLengths?: string;
  flowRateMin?: number;
  flowRateMax?: number;
  dirtLoadingMin?: number;
  dirtLoadingMax?: number;
  surfaceArea?: string;
  maxDifferentialPressure?: string;
  vesselTechnology?: string;
  pdfContent?: PDFContent[];
  productLine?: ProductLine;
}

export interface PDFContent {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileRef: string;
  order: number;
  category?: string;
}

export interface Slide {
  _id: string;
  title: string;
  slug: { current: string };
  order: number;
  layout: 'full' | 'split' | 'custom';
  backgroundImage?: string;
  backgroundColor?: string;
  content?: any[];
  videoUrl?: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  category?: string;
  excerpt?: string;
  featuredImage?: string;
  content?: any[];
  relatedPdfs?: PDFContent[];
  publishedAt?: string;
}

// Supabase types
export interface EmailLog {
  id: string;
  created_at: string;
  sender_email: string;
  recipient_email: string;
  product_id?: string;
  pdf_content_ids?: string[];
  status: 'sent' | 'failed' | 'bounced';
  resend_email_id?: string;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface Reminder {
  id: string;
  created_at: string;
  scheduled_at: string;
  user_email: string;
  recipient_email?: string;
  subject: string;
  message?: string;
  product_id?: string;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  sent_at?: string;
  error_message?: string;
}
