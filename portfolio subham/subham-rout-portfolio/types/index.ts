/* Navigation & Layout Types */
export interface NavLink {
  label: string;
  href: string;
  id: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  founded: number;
  location: string;
  email: string;
  phone?: string;
}

/* Portfolio & Projects Types */
export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  thumbnail?: string;
  videoSrc?: string;
  tags: string[];
  featured: boolean;
  metadata?: string;
}

export type ProjectCategory =
  | 'anime'
  | 'automotive'
  | 'real-estate'
  | 'concert'
  | 'movie'
  | 'person'
  | 'game'
  | 'all';

export interface CategoryDetail {
  num: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
  stats: Array<{
    value: string;
    label: string;
  }>;
}

/* Pricing Types */
export interface PricingTier {
  id: string;
  name: string;
  price: number | string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta?: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  duration?: string;
}

/* Service Types */
export interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  details?: string[];
}

/* FAQ Types */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

/* Testimonial Types */
export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

/* Animation Types */
export interface ParticleConfig {
  count: number;
  speed: number;
  friction: number;
  repulsion: number;
  radius: number;
  mouseInfluence: number;
  lineDistance: number;
}

export interface AnimationMetrics {
  duration: number;
  delay?: number;
  ease?: string;
  stagger?: number | ((index: number) => number);
}

/* Form Types */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface FormError {
  field: string;
  message: string;
}

/* Modal Types */
export interface ModalState {
  isOpen: boolean;
  content?: React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'error';
}

/* Hook Types */
export interface UseGSAPContext {
  ctx: gsap.Context | null;
  scope: React.RefObject<HTMLDivElement>;
  isReady: boolean;
}

export interface UseParallaxOptions {
  strength?: number;
  offset?: number;
  triggerHook?: number;
}

export interface UseMagneticOptions {
  range?: number;
  speed?: number;
  friction?: number;
}

/* Button Variants */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'magnetic';
export type ButtonSize = 'sm' | 'md' | 'lg';

/* Component Props */
export interface CardProps {
  title: string;
  description?: string;
  image?: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  variant?: 'center' | 'left';
  animated?: boolean;
}

/* Utility Types */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullableArray<T> = Array<Exclude<T, null | undefined>>;
