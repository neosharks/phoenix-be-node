import prisma from "../../prisma";
import { userCommonObject } from "../lib/commonObjects.lib";

class _CombinedCommunityService {
  async getOneByProps(query: any) {
    try {
      return await prisma.combinedCommunity.findUnique({
        where: query,
        include: {
          UserPost: {
            include: {
              comments: {
                include: {
                  author: {
                    select: userCommonObject,
                  },
                },
              },
              likedBy: {
                select: userCommonObject,
              },
              author: {
                select: userCommonObject,
              },
            },
          },
          createdBy: {
            select: userCommonObject,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllByProps(query: any) {
    try {
      return await prisma.combinedCommunity.findMany({
        where: query,
        include: {
          createdBy: {
            select: userCommonObject,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getOneCommunityCreator(query: any) {
    try {
      return await prisma.communityCreator.findFirst({
        where: query,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllCommunityCreator(query: any) {
    try {
      return await prisma.communityCreator.findMany({
        where: query,
        include: {
          community: {
            select: {
              name: true,
              id: true,
              description: true,
              tags: true,
              createdBy: { select: userCommonObject },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async createOne(data: any) {
    try {
      return await prisma.combinedCommunity.create({ data: data });
    } catch (error) {
      throw error;
    }
  }

  async createOneCommunityCreator(data: any) {
    try {
      return await prisma.communityCreator.create({ data: data });
    } catch (error) {
      throw error;
    }
  }

  async updateOne(query: any, data: any) {
    try {
      return await prisma.combinedCommunity.update({ where: query, data: data });
    } catch (error) {
      throw error;
    }
  }

  async deleteOneUser(id: any) {
    try {
      return await prisma.combinedCommunity.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}

export const CombinedCommunityService = new _CombinedCommunityService();
