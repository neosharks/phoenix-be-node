import { Request, Response } from "express";
import { errorCode, errorMessage, successMessages } from "../constant/api.constant";
import { CombinedCommunityService } from "../services/combinedCommunity.service";
import { UserService } from "../services/user.service";

class _CombinedCommunityController {
  async getOne(req: Request, res: Response) {
    try {
      let { id }: any = req.query;
      if (!id) return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const found = await CombinedCommunityService.getOneByProps({ id: parseInt(id) });
      if (!found) res.status(404).send({ message: errorMessage.NOT_FOUND });
      return res.status(200).send({ message: successMessages.FETCHED, data: found });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const found = await CombinedCommunityService.getAllByProps({});
      return res.status(200).send({ message: successMessages.FETCHED, data: found });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async getAllByCreatorCommunity(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      const found = await CombinedCommunityService.getAllCommunityCreator({
        userId: id,
        isActive: true,
      });
      return res.status(200).send({ message: successMessages.FETCHED, data: found });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { id } = res.locals.user;
      let { name, tags, creators, description }: any = req.body;
      if (!name || !creators)
        return res.status(errorCode.GENERIC).send({ message: errorMessage.MISSING_PARAMS });
      const createdRes = await CombinedCommunityService.createOne({
        name,
        tags,
        createdById: id,
        description,
      });
      await CombinedCommunityService.createOneCommunityCreator({
        userId: id,
        communityId: createdRes.id,
        status: "ACCEPTED",
      });
      for (let i = 0; i < creators.length; i++) {
        const foundUser = await UserService.getOneUser({ id: creators[i] });
        if (!foundUser || !foundUser.isCreator) continue;
        const foundCommunityCreator = await CombinedCommunityService.getOneCommunityCreator({
          userId: creators[i],
          communityId: createdRes.id,
          isActive: true,
        });
        if (foundCommunityCreator) continue;
        await CombinedCommunityService.createOneCommunityCreator({
          userId: creators[i],
          communityId: createdRes.id,
        });
      }

      return res.status(200).send({ message: successMessages.CREATED });
    } catch (error) {
      console.log("ERROR: ", error);
      return res
        .status(errorCode.INTERNAL_SERVER)
        .json({ message: errorMessage.INTERNAL_SERVER, error: error });
    }
  }
}

export const CombinedCommunityController = new _CombinedCommunityController();
