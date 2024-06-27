"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const redis_1 = require("../utils/redis");
// Get User by Id
const getUserById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userJson = yield redis_1.redis.get(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(200).send({
            success: true,
            user,
        });
    }
});
exports.getUserById = getUserById;
// Get All Users
const getAllUsersService = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find().sort({ createdAt: -1 });
    res.status(200).send({
        success: true,
        users,
    });
});
exports.getAllUsersService = getAllUsersService;
// update User Role Service
const updateUserRoleService = (res, id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findByIdAndUpdate(id, { role }, { new: true });
    res.status(200).send({
        success: true,
        user,
    });
});
exports.updateUserRoleService = updateUserRoleService;
