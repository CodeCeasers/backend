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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express = require('express');
const zod = require('zod');
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.userRoute = express.Router();
exports.userRoute.get('/', (req, res) => {
    res.json({
        msg: 'On api/v1/user'
    });
});
const userZodVerify = zod.object({
    email: zod.string(),
    password: zod.string().min(3),
    name: zod.string().optional(),
    role: zod.string()
});
exports.userRoute.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const verifyZod = userZodVerify.safeParse(req.body);
    if (!verifyZod.success) {
        res.status(404).json({
            msg: "Zod cannot verify the data"
        });
        return;
    }
    const findUser = yield prisma.user.findFirst({
        where: {
            email: req.body.email
        }
    });
    if (findUser != null) {
        res.status(411).json({
            msg: "User already exist"
        });
        return;
    }
    try {
        const newUser = yield prisma.user.create({
            data: {
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                role: req.body.role,
            }
        });
        const userDetails = {
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
        };
        // generate token
        // token = jwt.sign(userDetails, process.env.JWT_SECRET)
        res.status(200).json({
            msg: "User Created",
            user: userDetails
        });
    }
    catch (err) {
        res.status(411).json({
            msg: err.message
        });
        return;
    }
}));
