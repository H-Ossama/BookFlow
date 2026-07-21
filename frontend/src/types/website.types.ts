export interface WebsiteTheme {
  id: string;
  companyId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle: string;
  animationStyle: string;
}

export interface WebsiteSection {
  id: string;
  companyId: string;
  sectionType: string;
  layoutVariant: string;
  sortOrder: number;
  content: Record<string, any>;
  isVisible: boolean;
}

export type SectionType =
  | 'navbar' | 'hero' | 'services' | 'booking'
  | 'gallery' | 'testimonials' | 'contact' | 'footer'
  | 'pricing' | 'faq' | 'team' | 'cta';

export const SECTION_LABELS: Record<SectionType, string> = {
  navbar: 'Navigation',
  hero: 'Hero',
  services: 'Services',
  booking: 'Booking',
  gallery: 'Gallery',
  testimonials: 'Testimonials',
  contact: 'Contact',
  footer: 'Footer',
  pricing: 'Pricing',
  faq: 'FAQ',
  team: 'Team',
  cta: 'Call to Action',
};

export const SECTION_VARIANTS: Record<SectionType, string[]> = {
  navbar: ['default', 'centered', 'minimal'],
  hero: ['hero1', 'hero2', 'hero3', 'hero4'],
  services: ['cards', 'list', 'minimal'],
  booking: ['default', 'split', 'minimal'],
  gallery: ['grid', 'masonry', 'carousel', 'full'],
  testimonials: ['cards', 'slider', 'quote', 'grid'],
  contact: ['default', 'split', 'minimal'],
  footer: ['default', 'minimal', 'columns'],
  pricing: ['cards', 'horizontal', 'minimal', 'premium'],
  faq: ['default', 'simple'],
  team: ['grid', 'carousel', 'list'],
  cta: ['default', 'split', 'centered'],
};
