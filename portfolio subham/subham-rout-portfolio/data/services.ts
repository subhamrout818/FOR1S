import { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    id: 'editing',
    title: 'Cinematic Editing',
    description:
      'Beat-locked cuts, narrative flow, and visual storytelling. Every frame intentional, every transition purposeful.',
    details: [
      'Multi-camera synchronization',
      'Narrative pacing and structure',
      'Custom transitions and effects',
      'Speed ramping and slow motion',
      'J-cuts and L-cuts for seamless audio/video',
      'Complex timeline management',
    ],
  },
  {
    id: 'color',
    title: 'Color Grading',
    description:
      'Color science meets creative vision. Premium grading that tells your story and sets your content apart.',
    details: [
      'Log color space management',
      'Custom LUT creation and application',
      'Skin tone preservation',
      'Cinematic color palettes',
      'HDR and wide color gamut grading',
      'Reference cinematography analysis',
    ],
  },
  {
    id: 'sound',
    title: 'Sound Design',
    description:
      'Audio that matches visual quality. Comprehensive sound design, mixing, and optimization for all platforms.',
    details: [
      'Dialogue mixing and clarity',
      'Sound effects selection and timing',
      'Music sync and licensing assistance',
      'Foley and ambient atmosphere creation',
      'Platform-specific loudness optimization',
      'Immersive spatial audio setup',
    ],
  },
  {
    id: 'vfx',
    title: 'Motion Graphics & VFX',
    description:
      'Custom animations, visual effects, and motion design that elevates your content to premium quality.',
    details: [
      'Title and text animation design',
      'Lower thirds and graphics packages',
      'Particle effects and compositing',
      'Green screen removal and replacement',
      'Slow-motion effect creation',
      '3D motion graphics and modeling',
    ],
  },
  {
    id: 'optimization',
    title: 'Platform Optimization',
    description:
      'Deliver stunning content across all platforms. Optimized specs for social, broadcast, streaming, and cinema.',
    details: [
      'YouTube and social media optimization',
      'Streaming platform specs (Netflix, Apple TV)',
      'Cinema DCP and broadcast delivery',
      'Mobile-first editing for short-form',
      'Aspect ratio and format adaptation',
      'Bitrate and codec optimization',
    ],
  },
  {
    id: 'consulting',
    title: 'Creative Consulting',
    description:
      'Strategy, direction, and creative leadership. Help shape your vision into a cohesive visual story.',
    details: [
      'Project planning and storyboarding',
      'Visual reference research',
      'Cinematography collaboration',
      'Color palette and mood development',
      'Pacing and narrative structure review',
      'Post-production workflow optimization',
    ],
  },
];

export const EDITING_SOFTWARE = [
  'Adobe Premiere Pro',
  'Final Cut Pro',
  'DaVinci Resolve',
  'Avid Media Composer',
];

export const COLOR_GRADING_TOOLS = [
  'DaVinci Resolve Studio',
  'Adobe Premiere Pro',
  'ARRI Look Library',
  'Fujifilm ACROS',
  'Custom LUT Creation',
];

export const VFX_TOOLS = [
  'Adobe After Effects',
  'Nuke',
  'Cinema 4D',
  'Motion (Apple)',
  'Blender',
];

export const AUDIO_TOOLS = [
  'Adobe Audition',
  'Pro Tools',
  'Logic Pro',
  'Reaper',
  'Dolby Atmos preparation',
];
