import prisma from "../../prisma";

class _JourneyService {
  async getUserJourney(id: string) {
    return await prisma.journey.findMany({ where: { id } });
  }

  async createJourney(data: any) {
    return await prisma.journey.create({
      data: data,
    });
  }
}

export const JourneyService = new _JourneyService();
