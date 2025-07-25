import { Router } from "express";
import { getOrders } from "../controllers/index.controllers.js";

const cloudKitchenRouter = Router();

cloudKitchenRouter.get("/", getOrders);

export default cloudKitchenRouter;