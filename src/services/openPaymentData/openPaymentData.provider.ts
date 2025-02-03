import { Request } from "express";
import { GenResObj } from "../../utils/responseFormatter.util";
import { HttpStatusCodes as Code } from "../../utils/Enums.util";
import axios from "axios";
import { dataSetDetect, extractFormattedData, extractNames, extractSpecificData, getListOfGeneralPaymentRecords } from "./openPaymentData.helper";
import OpenPaymentDataset from "../../models/openPaymentDataset.model";
import { ZodError } from "zod";
import { ZODErrorMessage } from "../../utils/zodErrorHandler.util";
import { generalPaymentAcrossYearsValidator, openPaymentDataValidator } from "./openPaymentData.validate";

export const search = async (req: Request) => {
  try {

    openPaymentDataValidator.parse(req.query);

    const { search, page = 1, pageSize = 10, type = "prescriber" } = req.query;

    const checkDataset = dataSetDetect(type as string);

    let url = `https://openpaymentsdata.cms.gov/api/1/datastore/query/${checkDataset}/0?keys=true&`;

    url += `limit=${Number(pageSize)}&offset=${(Number(page) - 1) * Number(pageSize)}`;

    switch (type) {

      // Search the records by prescriber
      case 'prescriber':

        const { country, city, npiNumber } = req.query;

        const searchNames = extractNames(search as string);

        if (searchNames.firstName) {
          url += `&conditions[0][property]=covered_recipient_profile_first_name&conditions[0][value]=${searchNames.firstName}*&conditions[0][operator]=match`;
        }

        if (searchNames.lastName) {
          url += `&conditions[1][property]=covered_recipient_profile_last_name&conditions[1][value]=${searchNames.lastName}*&conditions[1][operator]=match`
        }

        if (country) {
          url += `&conditions[1][property]=covered_recipient_profile_country_name&conditions[1][value]=${country}*&conditions[1][operator]=match`
        }

        if (city) {
          url += `&conditions[1][property]=covered_recipient_profile_city&conditions[1][value]=${city}*&conditions[1][operator]=match`
        }

        if (npiNumber) {
          url += `&conditions[1][property]=covered_recipient_npi&conditions[1][value]=${npiNumber}*&conditions[1][operator]=match`
        }

        break;

      // Search the records by hospital
      case 'hospital':

        url += `&conditions[0][property]=teaching_hospital_name&conditions[0][value]=${search}*&conditions[0][operator]=match`;

        break;

      // Search the records by company
      case 'company':

        url += `&conditions[0][property]=amgpo_making_payment_name&conditions[0][value]=${search}*&conditions[0][operator]=match`;

        break;

      default:
        break;
    }

    const searchPrescriber = await axios.get(
      url
    );

    if (searchPrescriber.data) {}
      const formattedData = extractSpecificData(searchPrescriber.data);

    return GenResObj(Code.OK, true, "Data fetched successfully", formattedData || searchPrescriber.data);

  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage: any = ZODErrorMessage(error)
      return GenResObj(
        Code.INTERNAL_SERVER, true, errorMessage
      );
    }
    return GenResObj(
      Code.INTERNAL_SERVER, true, "Internal server error", error
    );
  }
};

export const generalPaymentAcrossYears = async (req: Request) => {
  try {

    generalPaymentAcrossYearsValidator.parse(req.params);

    const { profileId } = req.params;
    let { type = 'prescriber', page=1, pageSize=10 } = req.query;

    page = Number(page);
    pageSize = Number(pageSize);

    let url = 'https://openpaymentsdata.cms.gov/api/1/entities/';

    switch (type) {
      case 'prescriber':
        url += `individual-providers/`
        break;

      case 'company':
        url += `companies/`
        break;

      case 'hospital':
        url += `hospitals/`
        break;

      default:
        break;
    }

    if (profileId) {
      url += profileId;
    }

    const getPaymentData = await axios.get(
      url
    );

    if (getPaymentData) {
      console.log(getPaymentData?.data?.currentFilters);
    }

    const getList = await getListOfGeneralPaymentRecords(type as string, getPaymentData?.data?.currentFilters?.year, profileId, page, pageSize);

    console.log("getList", getList);

    if (getPaymentData.data) {
      const formattedData = extractSpecificData(getPaymentData.data);
    }

    return GenResObj(Code.OK, true, "Data fetched successfully", getPaymentData.data || getPaymentData.data);

  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage: any = ZODErrorMessage(error)
      return GenResObj(
        Code.INTERNAL_SERVER, true, errorMessage
      );
    }
    return GenResObj(
      Code.INTERNAL_SERVER, true, "Internal server error", error
    );
  }
};

export const addDataSetAndSync = async (req: Request) => {
  try {

    const url = 'https://openpaymentsdata.cms.gov/api/1/metastore/schemas/dataset/items'

    const getDatasets = await axios.get(
      url
    );

    if (getDatasets.data) {

      const filteredData = extractFormattedData(getDatasets.data);
      const insertDataset = await OpenPaymentDataset.insertMany(filteredData);

    }

    return GenResObj(Code.OK, true, "Data synced succefuuly");

  } catch (error) {
    console.log(error);
    return GenResObj(
      Code.INTERNAL_SERVER, true, "Internal server error", error
    );
  }
}