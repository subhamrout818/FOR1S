import { PricingTier, ProcessStep } from '@/types';

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Edit',
    price: '$500',
    description: 'Perfect for short-form content and quick turnarounds.',
    features: [
      'Up to 5 minutes of edited content',
      'Basic color grading',
      '2 revision rounds',
      'Standard export formats',
      '5-7 day turnaround',
      'Email support',
    ],
    cta: 'Start Project',
  },
  {
    id: 'professional',
    name: 'Professional Film',
    price: '$1,500',
    description: 'Comprehensive editing for cinematic productions.',
    features: [
      'Up to 15 minutes of edited content',
      'Advanced color grading & LUT creation',
      '4 revision rounds',
      '4K + HDR exports',
      '10-14 day turnaround',
      'Video consultations',
      'Custom motion graphics',
      'Sound design integration',
    ],
    highlighted: true,
    cta: 'Get Started',
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: '$3,500+',
    description: 'Full-service cinematic production with complete creative control.',
    features: [
      'Unlimited edit duration',
      'Premium color science & cinematography',
      'Unlimited revisions',
      '6K + RAW format support',
      'Fast-track turnaround (5-7 days)',
      'Dedicated project manager',
      'Original motion graphics & VFX',
      'Complete audio post-production',
      'Priority support & consultations',
      'Exclusive presets & LUTs included',
    ],
    cta: 'Custom Quote',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'brief',
    title: 'Project Brief',
    description:
      'We begin with a detailed consultation to understand your vision, timeline, target audience, and creative goals. This sets the foundation for the entire project.',
    duration: '2-3 hours',
  },
  {
    id: 'concept',
    title: 'Creative Concept',
    description:
      'Using your brief as a guide, we develop a creative direction, color palette, pacing, and visual language that aligns with your brand and message.',
    duration: '1-2 days',
  },
  {
    id: 'assembly',
    title: 'Rough Assembly',
    description:
      'We organize all raw footage, perform initial cuts, sync audio, and create the narrative flow. This rough cut serves as our creative roadmap.',
    duration: '3-5 days',
  },
  {
    id: 'refine',
    title: 'Refinement & Revisions',
    description:
      'Your feedback shapes the next iterations. We refine pacing, transitions, and narrative elements until the edit feels perfect.',
    duration: '2-4 days',
  },
  {
    id: 'color',
    title: 'Color Grading',
    description:
      'This is where the magic happens. We apply color science, cinematic LUTs, and custom grading to create your unique visual signature.',
    duration: '3-5 days',
  },
  {
    id: 'sound',
    title: 'Sound Design & Mix',
    description:
      'Music selection, sound effects, dialogue mixing, and final audio polish ensure your edit sounds as stunning as it looks.',
    duration: '2-3 days',
  },
  {
    id: 'delivery',
    title: 'Final Delivery',
    description:
      'Multiple export formats, optimization for different platforms, and comprehensive documentation of all settings and custom assets.',
    duration: '1 day',
  },
];

export const PACKAGE_COMPARISON = {
  columns: ['Feature', 'Starter', 'Professional', 'Premium'],
  rows: [
    ['Edit Duration', 'Up to 5 min', 'Up to 15 min', 'Unlimited'],
    ['Color Grading', 'Basic', 'Advanced', 'Premium + Custom LUTs'],
    ['Revisions', '2 rounds', '4 rounds', 'Unlimited'],
    ['Export Formats', 'Standard', '4K + HDR', '6K + RAW'],
    ['Motion Graphics', 'Not included', 'Basic', 'Full custom'],
    ['Sound Design', 'Not included', 'Integration only', 'Full post-production'],
    ['Turnaround', '5-7 days', '10-14 days', '5-7 days fast-track'],
    ['Support', 'Email', 'Video calls', 'Dedicated manager'],
  ],
};
