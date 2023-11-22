import prisma from "../../prisma";

class _PackageService {
  async getAllPackagesOfCreator(query: any) {
    return await prisma.package.findMany({ where: query, include: { tier: true } });
  }

  async getAllPatronCreatorByUser() {
    return await prisma.patronCreator.findMany();
  }

  async getOnePackage(query: any) {
    return await prisma.package.findUnique({ where: query, include: { tier: true } });
  }

  async createOnePackage(dataValues: any) {
    const { tier, name, price, description, userId } = dataValues;
    return await prisma.package.create({
      data: {
        name,
        image: "https://random.imagecdn.app/500/150",
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

  async linkPatronCreator(patronId: string, creatorId: string, packageId: string, expiry: any) {
    return await prisma.patronCreator.create({
      data: { patronId, creatorId, packageId, expiry: new Date() },
    });
  }
}

export const PackageService = new _PackageService();
