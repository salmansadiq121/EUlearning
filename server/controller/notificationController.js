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
exports.updateNotificationStatus = exports.getNotification = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const node_cron_1 = __importDefault(require("node-cron"));
// Get ALL Notification
exports.getNotification = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notificationModel_1.default
            .find()
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            notification,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// Update Notification Status
exports.updateNotificationStatus = (0, catchAsyncErrors_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notificationModel_1.default.findByIdAndUpdate(req.params.id);
        if (!notification) {
            return next(new ErrorHandler_1.default("Notification not found", 400));
        }
        else {
            notification.status
                ? (notification.status = "read")
                : notification === null || notification === void 0 ? void 0 : notification.status;
        }
        yield notification.save();
        const notifications = yield notificationModel_1.default
            .find()
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            notifications,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// Delete Notification
node_cron_1.default.schedule("0 0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    yield notificationModel_1.default.deleteMany({
        status: "read",
        createdAt: { $lt: thirtyDaysAgo },
    });
    console.log("Read notification deleted");
}));
