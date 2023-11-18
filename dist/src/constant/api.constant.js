"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorCode = exports.errorMessage = void 0;
exports.errorMessage = {
    USER_EXISTS: "USER_EXISTS",
    MISSING_PARAMS: "MISSING_PARAMS",
    USER_NOT_ROUND: "USER_NOT_ROUND",
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_SERVER: "INTERNAL_SERVER",
};
exports.errorCode = {
    GENERIC: 400,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
};
