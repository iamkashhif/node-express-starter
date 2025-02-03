import Users from "../../models/users.model";
import { GenResObj } from "../../utils/responseFormatter.util";
import { HttpStatusCodes as Code } from "../../utils/Enums.util";
import { createToken, generateBcryptPassword, sendResetPasswordMail, sendVerificationCodeBasedOnPlatform, verifyJwtToken } from "./user.helper";
import bcrypt from "bcrypt";
import { TUserModel } from "./user.interface";
import { changePasswordValidatorType, forgetPasswordValidatorType, getAllUserType, getUserDetailsType, resetPasswordValidatorType, signInType, signUpType, updateUserType, verifyUserValidatorType } from "./user.validate";
import { upload } from "../../utils/cloudinary.util";

export const signupUser = async (payload: signUpType) => {
  try {

    const { email } = payload;

    const checkUser: any = await Users.findOne({ email: email.toLowerCase() });
    payload.password = await generateBcryptPassword(payload.password);

    if (checkUser) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        `User with email ${email} already exists`
      );
    }

    const createUser = await Users.create({ ...payload, role: "user" });

    await sendVerificationCodeBasedOnPlatform(createUser.fullName, email, createUser._id as string);

    return GenResObj(Code.CREATED, true, "User created successfully", createUser);

  } catch (error) {
    throw error;
  }
};

export const signinUser = async (payload: signInType) => {
  try {

    const { email, password } = payload;

    let checkAvlUser: any = await Users.findOne(
      { email: email.toLowerCase() },
      { password: 1, role: 1, isVerified: 1, _id: 1, fullName: 1 }
    );

    if (!checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    if (!checkAvlUser.isVerified) {
      return GenResObj(Code.BAD_REQUEST, false, "User is not verified. Please verify your email");
    }

    const checkPassword = await bcrypt.compare(
      password,
      checkAvlUser.password
    );

    if (!checkPassword) {
      return GenResObj(Code.BAD_REQUEST, false, "Invalid credentials");
    }

    let token;
    if (checkAvlUser && checkAvlUser._id) {
      token = createToken(checkAvlUser._id.toString(), checkAvlUser.role);
    }

    // Append token in checkAvlUser object
    const userResponse = { ...checkAvlUser.toObject(), token };
    delete userResponse.password;

    return GenResObj(
      Code.CREATED, true, "User logged in successfully", userResponse
    );
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async (payload: forgetPasswordValidatorType) => {
  try {

    const { email } = payload;

    const checkAvlUser = await Users.findOne(
      { email: email.toLowerCase() },
      { email: 1, fullName: 1 }
    );

    if (!checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    await sendResetPasswordMail(checkAvlUser.fullName, email, checkAvlUser._id as string);

    return GenResObj(
      Code.CREATED, true, "Password reset link sent successfully"
    );
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (payload: verifyUserValidatorType) => {
  try {

    const { code, userId } = payload;

    let checkAvlUser = await Users.findById(userId);

    if (!checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    if (checkAvlUser.isVerified) {
      return GenResObj(Code.BAD_REQUEST, false, "User already verified");
    }

    if (!await verifyJwtToken(code as string)) {
      return GenResObj(
        Code.BAD_REQUEST, true, "Invalid code"
      );
    }

    checkAvlUser.isVerified = true;
    await checkAvlUser.save();

    return GenResObj(
      Code.CREATED, true, "User verified successfully"
    );
  } catch (error) {
    throw error;
  }
};

export const verifyUserByOTP = async (payload: verifyUserValidatorType) => {
  try {

    const { code, userId } = payload;

    let checkAvlUser = await Users.findById(userId);

    if (!checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    const checkOTP = await Users.findOne({ otp: code, _id: userId, otpExpiryTime: { $gt: new Date() } });
    if (!checkOTP) {
      return GenResObj(Code.BAD_REQUEST, false, "Invalid OTP");
    }

    checkAvlUser.isVerified = true;
    await checkAvlUser.save();

    return GenResObj(
      Code.CREATED, true, "User verified successfully"
    );
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (payload: resetPasswordValidatorType) => {
  try {

    const { code, userId, newPassword } = payload;

    let checkAvlUser = await Users.findById(userId);

    if (!checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    if (!await verifyJwtToken(code as string)) {
      return GenResObj(
        Code.BAD_REQUEST, true, "Invalid code"
      );
    }

    checkAvlUser.password = newPassword;
    await checkAvlUser.save();

    return GenResObj(
      Code.CREATED, true, "Password reset successful"
    );

  } catch (error) {
    throw error;
  }
};

export const changePassword = async (payload: changePasswordValidatorType) => {
  try {

    const { userId, password } = payload;

    const checkUser = await Users.findById(userId);
    if (!checkUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    checkUser.password = await generateBcryptPassword(password);
    await checkUser.save();

    return GenResObj(
      Code.CREATED, true, "Password changed successfully"
    );

  } catch (error) {
    throw error;
  }
};

export const getUserDetails = async (payload: getUserDetailsType) => {
  try {

    const getUser = await Users.findOne({ _id: payload.userId }, { password: 0 });

    if (!getUser) {
      return GenResObj(
        Code.NO_CONTENT, true, "User info fetched successfully", getUser
      );
    }

    return GenResObj(
      Code.CREATED, true, "User info fetched successfully", getUser
    );
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (payload: updateUserType) => {
  try {

    const { userId } : updateUserType = payload;

    const checkUser: TUserModel | null = await Users.findOne({ _id: userId });

    const { uploadedImageUrl } = await upload(payload.profilePicture);
    if (uploadedImageUrl) {
      payload.profilePicture = uploadedImageUrl;
    }

    if (!checkUser) {
      return GenResObj(Code.BAD_REQUEST, false, 'User not found');
    }

    const updatedUser = await Users.findOneAndUpdate({ _id: userId }, { $set: payload }, { new: true });

    return GenResObj(Code.OK, true, 'User info updated successfully', updatedUser);

  } catch (error) {
    throw error;
  }
};

export const getAllUser = async (payload: getAllUserType) => {
  try {

    const { search, status, from, to }: any = payload;

    // Build filter conditionally
    let filter: any = { role: { $ne: 'admin' } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }
    if (from && to) {
      filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    }

    // Fetch users with the constructed filter
    const getUsers = await Users.find(filter);

    return GenResObj(Code.OK, true, 'User list fetched successfully', getUsers);

  } catch (error) {
    throw error;
  }
};