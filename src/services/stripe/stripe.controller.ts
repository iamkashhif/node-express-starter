import { Request, Response } from "express";
import Users from "../../models/users.model";
import jwt from "jsonwebtoken";
import * as StripeProvider from './stripe.provider';
import { TGenResObj } from "../../utils/commonInterface.util";


export const stripeController = {

  createSubscription: async (req: Request, res: Response) => {
    const { code, data } : TGenResObj = await StripeProvider.createSubscription(req);
    res.status(code).json(data);
    return;
  },

}