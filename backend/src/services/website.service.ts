import { WebsiteRepository } from '../repositories/website.repository';
import { NotFoundError } from '../utils/errors';

const DEFAULT_BLUEPRINT = [
  { sectionType: 'navbar', layoutVariant: 'default', content: { logo: '', links: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] } },
  { sectionType: 'hero', layoutVariant: 'hero1', content: { title: 'Welcome to Your Business', subtitle: 'We provide exceptional services tailored to your needs. Book your appointment today and experience the difference.', buttonText: 'Book Now', buttonLink: '/book', backgroundImage: '' } },
  { sectionType: 'services', layoutVariant: 'cards', content: { title: 'Our Services', subtitle: 'Professional care tailored to you', services: [] } },
  { sectionType: 'booking', layoutVariant: 'default', content: { title: 'Book an Appointment', subtitle: 'Choose your service and pick a time that works for you.', buttonText: 'Book Now' } },
  { sectionType: 'gallery', layoutVariant: 'grid', content: { title: 'Our Work', subtitle: 'Take a look at what we do', images: [] } },
  { sectionType: 'testimonials', layoutVariant: 'cards', content: { title: 'What Our Clients Say', subtitle: 'Hear from our satisfied customers', testimonials: [] } },
  { sectionType: 'contact', layoutVariant: 'default', content: { title: 'Get in Touch', subtitle: 'We would love to hear from you', address: '', phone: '', email: '', showForm: true } },
  { sectionType: 'footer', layoutVariant: 'default', content: { description: 'Your trusted partner for exceptional service.', copyright: '', showPoweredBy: true } },
];

export class WebsiteService {
  static async getSections(companyId: string) {
    let sections = await WebsiteRepository.getSections(companyId);
    if (sections.length === 0) {
      sections = await WebsiteService.createBlueprint(companyId);
    }
    return sections;
  }

  static async createBlueprint(companyId: string) {
    const created = [];
    for (let i = 0; i < DEFAULT_BLUEPRINT.length; i++) {
      const section = DEFAULT_BLUEPRINT[i];
      const created_section = await WebsiteRepository.createSection({
        companyId,
        sectionType: section.sectionType,
        layoutVariant: section.layoutVariant,
        content: section.content,
        sortOrder: i,
      });
      created.push(created_section);
    }
    return created;
  }

  static async getSection(id: string) {
    const section = await WebsiteRepository.getSection(id);
    if (!section) throw new NotFoundError('Section not found');
    return section;
  }

  static async createSection(companyId: string, data: {
    sectionType: string;
    layoutVariant?: string;
    content?: any;
  }) {
    return WebsiteRepository.createSection({
      companyId,
      sectionType: data.sectionType,
      layoutVariant: data.layoutVariant,
      content: data.content || {},
    });
  }

  static async updateSection(id: string, data: {
    layoutVariant?: string;
    content?: any;
    sortOrder?: number;
    isVisible?: boolean;
  }) {
    await WebsiteService.getSection(id);
    return WebsiteRepository.updateSection(id, data);
  }

  static async deleteSection(id: string) {
    await WebsiteService.getSection(id);
    return WebsiteRepository.deleteSection(id);
  }

  static async reorderSections(updates: { id: string; sortOrder: number }[]) {
    return WebsiteRepository.reorderSections(updates);
  }

  // Theme
  static async getTheme(companyId: string) {
    const theme = await WebsiteRepository.getTheme(companyId);
    if (theme) return theme;
    return WebsiteRepository.upsertTheme(companyId, {});
  }

  static async updateTheme(companyId: string, data: any) {
    return WebsiteRepository.upsertTheme(companyId, data);
  }

  static async getFullWebsite(companyId: string) {
    const [sections, theme] = await Promise.all([
      WebsiteService.getSections(companyId),
      WebsiteService.getTheme(companyId),
    ]);
    return { sections, theme };
  }
}
