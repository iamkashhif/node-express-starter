import { NextFunction, Request, Response } from "express";
import * as UserProvider from './user.provider';
import { TGenResObj } from "../../utils/commonInterface.util";
import { changePasswordValidatorType, forgetPasswordValidator, getAllUserType, getUserDetailsType, resetPasswordValidatorType, signInValidator, signUpValidator, updateUserType, userListingAndSearchValidator, verifyUserValidator, verifyUserValidatorType } from "./user.validate";


export const userControler = {

  signupUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req
      signUpValidator.parse(body);

      const { code, data }: TGenResObj = await UserProvider.signupUser(body);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  signinUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      signInValidator.parse(body);

      const { code, data }: TGenResObj = await UserProvider.signinUser(body);
      res.status(code).json(data);
      return;

    } catch (error) {
      next(error);
    }
  },

  verifyUser: async (req: Request, res: Response, next: NextFunction) => {
    try {

      const payload = {
        ...req.params,
      } as verifyUserValidatorType;

      verifyUserValidator.parse(payload);

      const { code, data }: TGenResObj = await UserProvider.verifyUser(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  forgetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { body } = req;
  
      forgetPasswordValidator.parse(body);
  
      const { code, data }: TGenResObj = await UserProvider.forgetPassword(body);
      res.status(code).json(data);
      return
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {

      const payload = {
        ...req.params,
        ...req.body,
      } as resetPasswordValidatorType;

      const { code, data }: TGenResObj = await UserProvider.resetPassword(payload);
      res.status(code).json(data);
      return; 
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req: Request, res: Response, next : NextFunction) => {
    try {

      const payload = {
        ...req.body,
      } as changePasswordValidatorType;

      const { code, data }: TGenResObj = await UserProvider.changePassword(payload);
      res.status(code).json(data);
      return; 
    } catch (error) {
      next(error);
    }
  },

  getUserDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {

      const payload = {
        ...req.user
      } as getUserDetailsType;

      const { code, data }: TGenResObj = await UserProvider.getUserDetails(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {

      const payload = {
        ...req.body,
        ...req.user,
        profilePicture: req.file?.path
      } as updateUserType;
      
      const { code, data }: TGenResObj = await UserProvider.updateUser(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getAllUser: async (req: Request, res: Response, next: NextFunction) => {
    try {

      const payload = {
        ...req.user,
        ...req.query
      } as getAllUserType;

      const { code, data }: TGenResObj = await UserProvider.getAllUser(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

}