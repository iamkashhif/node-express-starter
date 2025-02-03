import { Request, Response } from "express";
import Users from "../../models/users.model";
import jwt from "jsonwebtoken";
import * as UserProvider from './rxgo.provider';
import { TGenResObj } from "../../utils/commonInterface.util";


export const dailyMedController = {

  durgSearch: async (req: Request, res: Response) => {
    const { code, data } : TGenResObj = await UserProvider.durgSearch(req);
    res.status(code).json(data);
    return;
  },

  durgSearchById: async (req: Request, res: Response) => {
    const { code, data } : TGenResObj = await UserProvider.durgSearchById(req);
    res.status(code).json(data);
    return;
  },

}