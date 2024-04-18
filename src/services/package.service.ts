import prisma from "../../prisma";

class _PackageService {
  async getAllPackagesOfCreator(query: any) {
    return await prisma.package.findMany({ where: query, include: { tier: true } });
  }

  async getOnePackage(query: any) {
    return await prisma.package.findUnique({ where: query, include: { tier: true } });
  }

  async createOnePackage(dataValues: any) {
    const { tier, name, price, description, userId } = dataValues;
    return await prisma.package.create({
      data: {
        name,
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

  async linkPatronCreator(patronId: string, creatorId: string, type: any, packageId?: string) {
    const currentDate = new Date();

    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    return await prisma.patronCreator.create({
      data: {
        patronId,
        creatorId,
        packageId,
        status: "ACTIVE",
        type,
        expiry: expiryDate,
      },
    });
  }

  async getAllPurchasedByPatron(patronId: string, creatorId: string) {
    return await prisma.patronCreator.findMany({
      where: { patronId, creatorId },
      include: {
        package: {
          include: { tier: true },
        },
      },
    });
  }
}

export const PackageService = new _PackageService();
