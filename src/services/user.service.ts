import prisma from "../../prisma";

class _UserService {
  async getOneUser(query: any) {
    try {
      return await prisma.user.findUnique({ where: query });
    } catch (error) {
      throw error;
    }
  }

  async getAllLinks(query: any) {
    try {
      return await prisma.allLinks.findMany({
        where: query,
      });
    } catch (error) {
      throw error;
    }
  }

  async createLink(data: any) {
    try {
      return await prisma.allLinks.create({
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllUserByParams(query: any, skip: number = 0, take: number = 10) {
    try {
      return await prisma.user.findMany({
        where: query,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
          username: true,
          role: true,
          industry: true,
          coverImage: true,
        },
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllUser(skip: number = 0, take: number = 10) {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
          username: true,
          phoneNumber: true,
          role: true,
        },
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllTotalUser() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      throw error;
    }
  }

  async createOneUser(data: any) {
    try {
      return await prisma.user.create({ data: data });
    } catch (error) {
      throw error;
    }
  }

  async updateOneUser(query: any, data: any) {
    try {
      return await prisma.user.update({ where: query, data: data });
    } catch (error) {
      throw error;
    }
  }

  async deleteOneUser(id: any) {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(id: number, updatedEmail: string) {
    try {
      const deletedUser = await prisma.user.update({
        where: { id },
        data: {
          email: updatedEmail,
          status: "DELETED",
        },
      });

      await prisma.message.deleteMany({
        where: {
          senderId: id,
        },
      });

      // Delete Chats where user is a participant
      await prisma.chat.deleteMany({
        where: {
          OR: [{ participantOneId: id }, { participantTwoId: id }],
        },
      });

      // Delete Notifications related to the user
      await prisma.notification.deleteMany({
        where: {
          OR: [{ aboutUserId: id }, { notifiedUserId: id }],
        },
      });

      // Delete PatronCreator records for the user
      await prisma.patronCreator.deleteMany({
        where: {
          OR: [{ patronId: id }, { creatorId: id }],
        },
      });

      // Delete User Posts
      await prisma.userPost.deleteMany({
        where: {
          authorId: id,
        },
      });

      // Delete Polls created by the user
      await prisma.poll.deleteMany({
        where: {
          authorId: id,
        },
      });

      // Delete Post Comments authored by the user
      await prisma.postComment.deleteMany({
        where: {
          authorId: id,
        },
      });

      // Delete Packages created by the user
      await prisma.package.deleteMany({
        where: {
          creatorId: id,
        },
      });

      await prisma.classParticipants.deleteMany({
        where: {
          class: {
            creatorId: id,
          },
        },
      });

      // Ab Class delete karo
      await prisma.class.deleteMany({
        where: {
          creatorId: id,
        },
      });

      // Delete Class Messages created by the user
      await prisma.classMessage.deleteMany({
        where: {
          id: id,
        },
      });

      // Delete Payments associated with the user
      await prisma.payment.deleteMany({
        where: {
          id: id,
        },
      });

      // Delete Wallet Transactions involving the user
      await prisma.walletTransactions.deleteMany({
        where: {
          OR: [{ senderId: id }, { receiverId: id }],
        },
      });

      // Delete AllLinks related to the user
      await prisma.allLinks.deleteMany({
        where: {
          id: id,
        },
      });
      // Delete ClickStream entries related to the user
      await prisma.clickStream.deleteMany({
        where: {
          userId: id,
        },
      });

      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
}

export const UserService = new _UserService();
