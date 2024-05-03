import prisma from "../../prisma";

class _PackageService {
  async getAllPackagesOfCreator(query: any) {
    try {
      return await prisma.package.findMany({ where: query, include: { tier: true } });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getOnePackage(query: any) {
    try {
      return await prisma.package.findUnique({ where: query, include: { tier: true } });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createOnePackage(dataValues: any) {
    try {
      const { tier, name, price, description, creatorId } = dataValues;
      return await prisma.package.create({
        data: {
          name,
          price,
          description,
          creatorId,
          tier: {
            connect: tier.map((ele: any) => {
              return { id: ele };
            }),
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updatePackage(props: any, dataValues: any) {
    try {
      return await prisma.package.update({ where: props, data: dataValues });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //------------------------

  async getAllTiers() {
    try {
      return await prisma.tier.findMany({});
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createOneTier(data: any) {
    try {
      return await prisma.tier.create({ data: data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async linkPatronCreator(patronId: string, creatorId: string, type: any, packageId?: string) {
    try {
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
          expiry: type !== "FREE" ? expiryDate : null,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllPurchasedByPatron(patronId: string, creatorId: string) {
    try {
      return await prisma.patronCreator.findMany({
        where: { patronId, creatorId },
        include: {
          package: {
            include: { tier: true },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const PackageService = new _PackageService();
