import axios from "axios";
import OpenPaymentDataset from "../../models/openPaymentDataset.model";

export function extractNames(query: string): { firstName: string; lastName: string } {
  if (!query) {
    throw new Error("Search query cannot be empty");
  }

  const nameParts = query.trim().split(/\s+/); // Split by spaces, handling multiple spaces
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || ''; // Handle the rest as last name

  return { firstName, lastName };
}

export function dataSetDetect(dataset: string) {

  if (!dataset) {
    throw new Error("Unable to get the dataset");
  }

  const dataSets = [
    {
      type: 'prescriber',
      value: '6ed6ae76-2999-49da-b0b2-d7df150ac754'
    },
    {
      type: 'company',
      value: '1cf0c6c0-c377-466e-b78f-037b442559f8'
    },
    {
      type: 'hospital',
      value: '8219fcb3-fb3d-4b51-9f65-be8a048c0608'
    }
  ];

  return dataSets.find((item) => item.type === dataset)?.value;
}

export async function getListOfGeneralPaymentRecords(type: string, year: string, profileId: string, page: number, pageSize: number) {
  try {
    const getDatasetIdBasedOnTypeAndYear: any = await OpenPaymentDataset.findOne({ temporal: { $regex: `^${year}` } });

    console.log("getDatasetIdBasedOnTypeAndYear", getDatasetIdBasedOnTypeAndYear);

    if (!getDatasetIdBasedOnTypeAndYear) {
      return;
    }

    const checkPropertyName = getThePropertyNameForGeneralPaymentRecords(type);

    let url = `https://openpaymentsdata.cms.gov/api/1/datastore/query/${getDatasetIdBasedOnTypeAndYear.identifier}/0?keys=true&limit=${Number(pageSize)}&offset=${(Number(page) - 1) * Number(pageSize)}&conditions[0][property]=${checkPropertyName}&conditions[0][value]=${profileId}&conditions[0][operator]==`;

    const getPaymentData = await axios.get(
      url
    );

    return getPaymentData.data;
  } catch (error) {
    throw error;
  }
}

export function extractFormattedData(getDatasets: any) {
  return getDatasets.map((item: { identifier: any; temporal: any; title: any; }) => ({
    identifier: item.identifier,
    temporal: item.temporal,
    type: item.title,
  }));
}

export function getThePropertyNameForGeneralPaymentRecords(type: string) {
  if (!type) {
    throw new Error("Unable to get the dataset");
  }

  const dataSets = [
    {
      type: 'prescriber',
      property: 'covered_recipient_profile_id'
    },
    {
      type: 'company',
      property: 'applicable_manufacturer_or_applicable_gpo_making_payment_id'
    },
    {
      type: 'hospital',
      property: 'teaching_hospital_ccn'
    }
  ];

  return dataSets.find((item) => item.type === type)?.property;

}

export function extractSpecificData(data: any) {
  return {
    count: data.count,
    data: data.results
  };
}