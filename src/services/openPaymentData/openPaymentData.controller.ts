import { Request, Response } from "express";
import * as UserProvider from './openPaymentData.provider';
import { TGenResObj } from "../../utils/commonInterface.util";

export const openPaymentDataController = {

  search: async (req: Request, res: Response) => {

    const { code, data } : TGenResObj = await UserProvider.search(req);
    res.status(code).json(data);
    return;
  },

  generalPaymentAcrossYears: async (req: Request, res: Response) => {

    const { code, data } : TGenResObj = await UserProvider.generalPaymentAcrossYears(req);
    res.status(code).json(data);
    return;
  },

  addDataSetAndSync: async (req: Request, res: Response) => {
    
    const { code, data } : TGenResObj = await UserProvider.addDataSetAndSync(req);
    res.status(code).json(data);
    return;
  },

}