import { prisma } from '../config/database';

export class WebsiteRepository {
  // Sections
  static async getSections(companyId: string) {
    return prisma.websiteSection.findMany({
      where: { companyId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  static async getSection(id: string) {
    return prisma.websiteSection.findUnique({ where: { id } });
  }

  static async createSection(data: {
    companyId: string;
    sectionType: string;
    layoutVariant?: string;
    content: any;
    sortOrder?: number;
  }) {
    const maxOrder = await prisma.websiteSection.aggregate({
      where: { companyId: data.companyId },
      _max: { sortOrder: true },
    });
    return prisma.websiteSection.create({
      data: {
        companyId: data.companyId,
        sectionType: data.sectionType,
        layoutVariant: data.layoutVariant || 'default',
        content: data.content || {},
        sortOrder: data.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  static async updateSection(id: string, data: {
    sectionType?: string;
    layoutVariant?: string;
    content?: any;
    sortOrder?: number;
    isVisible?: boolean;
  }) {
    return prisma.websiteSection.update({ where: { id }, data });
  }

  static async deleteSection(id: string) {
    return prisma.websiteSection.delete({ where: { id } });
  }

  static async reorderSections(updates: { id: string; sortOrder: number }[]) {
    const tx = updates.map((u) =>
      prisma.websiteSection.update({ where: { id: u.id }, data: { sortOrder: u.sortOrder } })
    );
    return prisma.$transaction(tx);
  }

  // Theme
  static async getTheme(companyId: string) {
    return prisma.websiteTheme.findUnique({ where: { companyId } });
  }

  static async upsertTheme(companyId: string, data: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    borderRadius?: string;
    buttonStyle?: string;
    animationStyle?: string;
  }) {
    return prisma.websiteTheme.upsert({
      where: { companyId },
      create: { companyId, ...data },
      update: data,
    });
  }
}
