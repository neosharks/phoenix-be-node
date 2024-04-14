import prisma from "../../prisma";

class _PatronCreatorService {
  async getFirst(query: any) {
    return await prisma.patronCreator.findFirst({ where: query });
  }

  async getOne(query: any) {
    return await prisma.patronCreator.findUnique({ where: query });
  }

  async getAll(query: any) {
    return await prisma.patronCreator.findMany({
      where: query,
      include: {
        package: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true,
            username: true,
            industry: true,
          },
        },
        patron: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true,
            username: true,
            industry: true,
          },
        },
      },
    });
  }

  async linkPatronCreator(creatorId: string, patronId: string, packageId: string) {
    const currentTimestamp = Date.now();
    const dateObject = new Date(currentTimestamp);
    return await prisma.patronCreator.create({
      data: { patronId, packageId, creatorId, expiry: dateObject },
    });
  }
}

export const PatronCreatorService = new _PatronCreatorService();
