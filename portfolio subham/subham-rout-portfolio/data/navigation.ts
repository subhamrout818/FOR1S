import { NavLink, CompanyInfo } from '@/types';

export const NAVIGATION_LINKS: NavLink[] = [
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'pricing', label: 'Pricing', href: '#pricing' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const COMPANY_INFO: CompanyInfo = {
  name: 'SUBHAM ROUT',
  tagline: 'Cinema Editor',
  description:
    'Cinematic video editor specializing in emotional storytelling, beat-locked editing, and high-energy productions.',
  founded: 2020,
  location: 'Remote',
  email: 'hello@subhamrout.com',
  phone: '+1 (555) 123-4567',
};

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
];
