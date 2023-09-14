import prisma from "../../prisma";

class _PackageService {
  async getAllUserPackages(query: any) {
    return await prisma.package.findMany({ where: query, include: { tier: true } });
  }

  async getPackage(query: any) {
    return await prisma.package.findFirst({ where: query, include: { tier: true } });
  }

  async createOnePackage(dataValues: any) {
    const { tier, name, image, price, description, userId } = dataValues;
    return await prisma.package.create({
      data: {
        name,
        image,
        price,
        description,
        userId,
        tier: {
          connect: tier.map((ele: any) => {
            return { id: ele };
          }),
        },
      },
    });
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
