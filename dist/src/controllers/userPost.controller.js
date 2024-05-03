"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPostConter = void 0;
const userPost_service_1 = require("../services/userPost.service");
const user_service_1 = require("../services/user.service");
const patronCreator_service_1 = require("../services/patronCreator.service");
const prisma_1 = __importDefault(require("../../prisma"));
const api_constant_1 = require("../constant/api.constant");
const s3upload_core_1 = require("../core/s3upload.core");
const image_lib_1 = require("../lib/image.lib");
const helper_lib_1 = require("../lib/helper.lib");
const notification_service_1 = require("../services/notification.service");
class _UserPostController {
  getAllUserPostByUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { author } = req.query;
        if (!author)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
        const foundUser = yield user_service_1.UserService.getOneUser({ username: author });
        if (!foundUser)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.NOT_FOUND });
        let returnPosts = yield userPost_service_1.UserPostService.getAllUserPostByUser({
          authorId: foundUser.id,
        });
        if (!returnPosts)
          return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
        if (returnPosts.length > 0) {
          returnPosts = yield Promise.all(
            returnPosts.map((ele) =>
              __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (
                  ((_a = ele === null || ele === void 0 ? void 0 : ele.image) === null ||
                  _a === void 0
                    ? void 0
                    : _a.length) > 0
                ) {
                  if (ele.visibility !== "PAID_MEMBER")
                    ele.image = yield (0, s3upload_core_1.getObjectSignedUrl)(ele.image);
                  else ele.image = yield (0, image_lib_1.getBlurredImage)(ele.image);
                }
                return ele;
              }),
            ),
          );
        }
        return res
          .status(200)
          .send({ message: api_constant_1.successMessages.SUCCESS, data: returnPosts });
      } catch (error) {
        console.log("Error: ", error);
        return res
          .status(api_constant_1.errorCode.INTERNAL_SERVER)
          .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
      }
    });
  }
  getAllPostForUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = res.locals.user;
        let returnPosts = [];
        const foundPatronCreator = yield patronCreator_service_1.PatronCreatorService.getAll({
          patronId: id,
        });
        for (let i = 0; i < foundPatronCreator.length; i++) {
          const ele = foundPatronCreator[i];
          const allPostsByUser = yield userPost_service_1.UserPostService.getAllUserPostByUser({
            authorId: ele.creatorId,
          });
          returnPosts = [...returnPosts, ...allPostsByUser];
        }
        const allUserPosts = yield userPost_service_1.UserPostService.getAllUserPostByUser({
          authorId: id,
        });
        returnPosts = [...returnPosts, ...allUserPosts];
        if (returnPosts.length === 0)
          return res.status(200).send({ message: api_constant_1.errorMessage.NOT_FOUND });
        returnPosts = returnPosts.sort(function (a, b) {
          return b.updatedAt - a.updatedAt;
        });
        if (returnPosts.length > 0) {
          returnPosts = yield Promise.all(
            returnPosts.map((ele) =>
              __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (
                  ((_a = ele === null || ele === void 0 ? void 0 : ele.image) === null ||
                  _a === void 0
                    ? void 0
                    : _a.length) > 0
                ) {
                  if (!ele.isPrivate)
                    ele.image = yield (0, s3upload_core_1.getObjectSignedUrl)(ele.image);
                  else ele.image = yield (0, image_lib_1.getBlurredImage)(ele.image);
                }
                return ele;
              }),
            ),
          );
        }
        return res
          .status(200)
          .send({ message: api_constant_1.successMessages.SUCCESS, data: returnPosts });
      } catch (error) {
        console.log("Error: ", error);
        return res
          .status(api_constant_1.errorCode.INTERNAL_SERVER)
          .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
      }
    });
  }
  getSingleUserPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.query;
        if (!id)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
        const found = yield userPost_service_1.UserPostService.getOneUserPost({ id });
        // if (found?.isPrivate && found?.image) found.image = await getBlurredImage(found.image);
        if (found === null || found === void 0 ? void 0 : found.image)
          found.image = yield yield (0, s3upload_core_1.getObjectSignedUrl)(found.image);
        if (!found) return res.status(404).send({ message: api_constant_1.errorMessage.NOT_FOUND });
        return res
          .status(201)
          .send({ message: api_constant_1.successMessages.SUCCESS, data: found });
      } catch (error) {
        console.log("Error: ", error);
        return res
          .status(api_constant_1.errorCode.INTERNAL_SERVER)
          .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
      }
    });
  }
  likePostToggle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { postId } = req.body;
        const { id } = res.locals.user;
        if (!postId)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
        const foundPost = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
        if (!foundPost)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.NOT_FOUND });
        const userIndex = foundPost.likedBy.findIndex((user) => user.id === id);
        if (userIndex === -1) {
          yield prisma_1.default.userPost.update({
            where: { id: postId },
            data: { likedBy: { connect: { id: id } } },
          });
          yield notification_service_1.NotificationService.createOneNotification({
            aboutUserId: id,
            notifiedUserId: foundPost.authorId,
            message: ` have liked on your post`,
            link: postId,
            type: "NEW_LIKE",
          });
        } else {
          yield prisma_1.default.userPost.update({
            where: { id: postId },
            data: { likedBy: { disconnect: { id: id } } },
          });
        }
        res.status(201).send({ message: api_constant_1.successMessages.CREATED });
      } catch (error) {
        console.log("Error: ", error);
        return res
          .status(api_constant_1.errorCode.INTERNAL_SERVER)
          .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
      }
    });
  }
  voteOnPoll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { pollId, selectedId } = req.body;
        const { id } = res.locals.user;
        if (!pollId || !selectedId)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
        const foundPoll = yield userPost_service_1.UserPostService.getOnePoll({ id: pollId });
        if (!foundPoll)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.NOT_FOUND });
        const userIndex = foundPoll.selectedOptions.findIndex((user) => user.userId === id);
        if (userIndex === -1) {
          yield prisma_1.default.poll.update({
            where: { id: pollId },
            data: { selectedOptions: [...foundPoll.selectedOptions, { userId: id, selectedId }] },
          });
        } else {
          foundPoll.selectedOptions[userIndex].selectedId = selectedId;
          yield prisma_1.default.poll.update({
            where: { id: pollId },
            data: { selectedOptions: [...foundPoll.selectedOptions] },
          });
        }
        res.status(201).send({ message: api_constant_1.successMessages.CREATED });
      } catch (error) {
        console.log("Error: ", error);
        return res
          .status(api_constant_1.errorCode.INTERNAL_SERVER)
          .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
      }
    });
  }
  update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { postId, updates } = req.body;
        if (!postId)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
        const foundPost = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
        if (!foundPost)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.NOT_FOUND });
        yield userPost_service_1.UserPostService.updateOneUserPost({ id: postId }, updates);
        res.status(201).send({ message: api_constant_1.successMessages.UPDATED });
      } catch (error) {
        console.log("Error: ", error);
        return res
          .status(api_constant_1.errorCode.INTERNAL_SERVER)
          .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
      }
    });
  }
  createOneUserPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const body = req.body;
        const { description, type, visibility, videoUrl, title, packages } = body;
        const image = req.file;
        const { id } = res.locals.user;
        const payload = { authorId: id };
        if (
          !description ||
          !id ||
          !type ||
          !visibility ||
          (type === "IMAGE" && !image) ||
          (type === "VIDEO" && !videoUrl)
        )
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
        if (visibility === "PAID_MEMBER" && (!packages || packages.length === 0))
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
        if (type === "POLL") {
          const { options } = req.body;
          let redefinedOptions = options.map((ele) => {
            return { id: (0, helper_lib_1.generateRandomAlpaNumberic)(5), optionText: ele };
          });
          const response = yield userPost_service_1.UserPostService.createPoll({
            options: redefinedOptions,
            selectedOptions: [],
            authorId: id,
            description,
            title,
          });
          payload.pollId = response.id;
        }
        if (type === "IMAGE" && image)
          if (image) payload.image = yield (0, s3upload_core_1.GetUploadedFile)(image);
        const created = yield userPost_service_1.UserPostService.createOneUserPost(
          Object.assign(Object.assign({}, payload), {
            description,
            type,
            visibility,
            videoUrl,
            title,
            packages: visibility === "PAID_MEMBER" ? packages : [],
          }),
        );
        if (created.image)
          created.image = yield (0, s3upload_core_1.getObjectSignedUrl)(created.image);
        return res
          .status(201)
          .send({ message: api_constant_1.successMessages.CREATED, data: created });
      } catch (error) {
        console.log(error);
        console.log("Error: ", error);
        return res
          .status(api_constant_1.errorCode.INTERNAL_SERVER)
          .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
      }
    });
  }
  commentOnPostByUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { description, authorId, userPostId } = req.body;
        const { id } = res.locals.user;
        if (!description || !authorId || !userPostId)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
        const created = yield userPost_service_1.UserPostService.createOneComment({
          description,
          authorId,
          userPostId,
        });
        yield notification_service_1.NotificationService.createOneNotification({
          aboutUserId: id,
          notifiedUserId: authorId,
          message: `${created.firstName + " " + created.lastName} have commented on your post`,
          link: userPostId,
          type: "NEW_COMMENT",
        });
        res.status(201).send({ message: api_constant_1.successMessages.SUCCESS, data: created });
      } catch (error) {
        console.log("Error: ", error);
        return res
          .status(api_constant_1.errorCode.INTERNAL_SERVER)
          .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
      }
    });
  }
  delete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { postId } = req.body;
        const { id } = res.locals.user;
        if (!postId)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.MISSING_PARAMS });
        const foundPost = yield userPost_service_1.UserPostService.getOneUserPost({ id: postId });
        if (!foundPost)
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.NOT_FOUND });
        if (id !== foundPost.authorId) {
          return res
            .status(api_constant_1.errorCode.GENERIC)
            .send({ message: api_constant_1.errorMessage.NOT_ALLOWED });
        }
        yield userPost_service_1.UserPostService.delete(postId);
        res.status(201).send({ message: api_constant_1.successMessages.SUCCESS });
      } catch (error) {
        console.log("Error: ", error);
        return res
          .status(api_constant_1.errorCode.INTERNAL_SERVER)
          .json({ message: api_constant_1.errorMessage.INTERNAL_SERVER, error: error });
      }
    });
  }
}
exports.UserPostController = new _UserPostController();
