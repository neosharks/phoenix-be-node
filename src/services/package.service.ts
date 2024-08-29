import { db } from "../models/sequelize";
const { Package, Tier, PatronCreator } = db;

class _PackageService {
  async getAllPackagesOfCreator(query: any, skip: number = 0, take: number = 10) {
    try {
      return await Package.findAll({
        where: {
          creator: { username: query.username },
        },
        include: [{ model: Tier }],
        offset: skip,
        limit: take,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOnePackage(query: any) {
    try {
      return await Package.findOne({ where: query, include: [{ model: Tier }] });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createOnePackage(dataValues: any) {
    try {
      const { tier, name, price, description, creatorId } = dataValues;
      const newPackage = await Package.create({
        name,
        price,
        description,
        creatorId,
      });
      if (tier && tier.length > 0) {
        await newPackage.setTiers(tier);
      }
      return newPackage;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updatePackage(props: any, dataValues: any) {
    try {
      return await Package.update(dataValues, { where: props });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllTiers(skip: number = 0, take: number = 10) {
    try {
      return await Tier.findAll({
        offset: skip,
        limit: take,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createOneTier(data: any) {
    try {
      return await Tier.create(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async linkPatronCreator(patronId: any, creatorId: any, type: any, packageId?: any) {
    try {
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      return await PatronCreator.create({
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
      console.error(error);
      throw error;
    }
  }

  async getAllPurchasedByPatron(patronId: any, creatorId: any) {
    try {
      return await PatronCreator.findAll({
        where: { patronId, creatorId },
        include: [
          {
            model: Package,
            include: [{ model: Tier }],
          },
        ],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const PackageService = new _PackageService();
