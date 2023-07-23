import prisma from "../../prisma";

class _PackageService {
  async getAllUserPackages(query: any) {
    return await prisma.package.findMany({ where: query, include: { tiers: true } });
  }

  async getPackage(query: any) {
    return await prisma.package.findFirst({ where: query, include: { tiers: true } });
  }

  async createOnePackage(data: any) {
    return await prisma.package.create({ data: data });
  }

  //------------------------

  async getAllTiers() {
    return await prisma.tier.findMany({});
  }

  async createOneTier(data: any) {
    return await prisma.tier.create({ data: data });
  }
}

export const PackageService = new _PackageService();
