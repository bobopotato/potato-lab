import cookieParser from "cookie-parser";
import { Router } from "express";
import { refreshToken, setCookie, signIn, signUp } from "./auth.controller";
import multer from "multer";

const authRouter = Router();
const upload = multer();

authRouter.use(cookieParser());

authRouter.post("/sign-up", upload.single("image"), signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/refreshToken", refreshToken);
authRouter.get("/set-cookie", setCookie);

export default authRouter;
