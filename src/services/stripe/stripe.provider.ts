import { Request, Response } from "express";
import { GenResObj } from "../../utils/responseFormatter.util";
import { HttpStatusCodes as Code } from "../../utils/Enums.util";
import UserSubscription from "../../models/userSubscription.model";
import Users from "../../models/users.model"
import { createStripeCustomer, createStripeSubscription } from "./stripe.helper";
import Stripe from "stripe";
import { TPaymentMethodType } from "./stripe.interface";

const stripe = new Stripe(
  process.env.STRIPE_CLIENT_SECRET || ''
);

export const createSubscription = async (req: Request) => {
  try {

    const { plan, paymentMethod } = req.body;
    const checkUser = await Users.findById(req.user.userId);

    if (!checkUser) {
      throw new Error("User not found");
    }

    const checkIfSubscriptionExist = await UserSubscription.findOne({
      where: {
        userId: req.user.userId,
        status: true
      }
    });

    if (checkIfSubscriptionExist) {
      throw new Error("Subscription already active for this customer");
    }

    let customerId = checkUser.stripeCustomerId;
    if (!checkUser.stripeCustomerId) {
      const create = await createStripeCustomer(checkUser.email);
      customerId = create.id;
    }

    const subscription = await createStripeSubscription({
      customerId: customerId || '',
      planId: plan,
      paymentMethod: paymentMethod
    });

    await UserSubscription.create({
      userId: req.user.userId,
      stripeSubscriptionId: subscription.id,
      status: true,
      plan: plan,
      paymentMethod: paymentMethod,
      startDate: new Date(),
    });

    return GenResObj(Code.CREATED, true, "Subscription created successfully", subscription);

  } catch (error) {
    console.log(error);
    return GenResObj(
      Code.INTERNAL_SERVER, true, "Something went wrong"
    );
  }
}

export const cancelSubscription = async (req: Request) => {
  try {

    const userId = req.user.userId;

    const checkSubscription = await UserSubscription.findOne({
      userId: userId,
      status: true
    });

    if (!checkSubscription) {
      return GenResObj(Code.NOT_FOUND, false, "Subscription not found");
    }

    if (checkSubscription.status) {
      return GenResObj(Code.BAD_REQUEST, false, "Subscription already cancelled");
    }

    const cancel = await stripe.subscriptions.deleteDiscount(checkSubscription.stripeSubscriptionId || '');

    return GenResObj(Code.OK, true, "Subscription cancelled successfully");

  } catch (error) {
    return GenResObj(
      Code.INTERNAL_SERVER, true, "Something went wrong"
    );
  }
}

export const createCard = async (req: Request) => {
  try {

    const { token } = req.body;

    const checkUser = await Users.findById(req.user.userId);
    if (!checkUser) return GenResObj(Code.NOT_FOUND, false, "User not found");

    const currentDate: Date = new Date();
    await stripe.customers.createSource(
      checkUser.stripeCustomerId || '',
      {
        source: token,
        metadata: { status: "Active", lastUpdated: currentDate.toUTCString() },
      }
    );

    return GenResObj(Code.OK, true, "Card added successfully");
  } catch (error) {
    return GenResObj(Code.INTERNAL_SERVER, false, (error as Error).message);
  }
};

export const getListOfPaymentMethod = async (req: Request) => {
  try {
    let { type, customerId } = req.body;

    const checkUser = await Users.findById(req.user.userId);
    if (!checkUser) return GenResObj(Code.NOT_FOUND, false, "User not found");

    const stripeCustomer = await stripe.customers.retrieve(
      checkUser.stripeCustomerId || ''
    );

    const paymentMethodsByList: any = await stripe.paymentMethods.list({
      customer: checkUser.stripeCustomerId,
      type: type as TPaymentMethodType,
    });

    const enhancedPaymentMethods = paymentMethodsByList.data.map((paymentMethod: { card: { exp_month: number; exp_year: number; }; }) => {
      const { exp_month, exp_year } = paymentMethod.card;

      // Get current date
      const now = new Date();
      const currentMonth = now.getUTCMonth() + 1; // Months are 0-indexed
      const currentYear = now.getUTCFullYear();

      // Check if the card is expired
      const isExpired =
        exp_year < currentYear ||
        (exp_year === currentYear && exp_month < currentMonth);

      // Add `isExpired` flag
      return {
        ...paymentMethod,
        card: {
          ...paymentMethod.card,
          isExpired,
        },
      };
    });

    if ("default_source" in stripeCustomer && stripeCustomer.default_source) {
      for (const method of enhancedPaymentMethods) {
        method.isDefault = method.id === stripeCustomer.default_source;
      }
    }

    return GenResObj(
      Code.OK,
      true,
      "List of payment methods fetched successfully.",
      { data: enhancedPaymentMethods }
    );
  } catch (error) {
    return GenResObj(Code.INTERNAL_SERVER, false, "Something went wrong");
  }
};