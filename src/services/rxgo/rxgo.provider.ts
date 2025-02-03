import { Request, Response } from "express";
import { GenResObj } from "../../utils/responseFormatter.util";
import { HttpStatusCodes as Code } from "../../utils/Enums.util";
import axios from "axios";
import { durgSearchValidator } from "./rxgo.validate";
import { ZodError } from "zod";
import { ZODErrorMessage } from "../../utils/zodErrorHandler.util";

export const durgSearch = async (req: Request) => {
  try {

    durgSearchValidator.parse(req.query);

    const { search, page } = req.query;
    const payload = req.query;

    const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?page=${page || 1}&pagesize=10${search ? `&drug_name=${search}` : ""}`;
    const splsResponse = await axios.get(url);
    const splsData = splsResponse.data.data;

    // Process in chunks to avoid flooding the server
    const chunkSize = 5;
    const chunks = Array.from({ length: Math.ceil(splsData.length / chunkSize) }, (_, i) =>
      splsData.slice(i * chunkSize, (i + 1) * chunkSize)
    );

    const mergedData: any[] = [];

    await Promise.all(
      chunks.map(async (chunk) => {
        const mediaAndNdcPromises = chunk.map((item: { setid: string }) =>
          Promise.all([
            axios.get(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${item.setid}/media.json`).catch(() => null),
            axios.get(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${item.setid}/ndcs.json`).catch(() => null),
          ])
        );

        const mediaAndNdcResponses = await Promise.all(mediaAndNdcPromises);

        const chunkData = chunk.map((item: any, index: number) => ({
          ...item,
          media: mediaAndNdcResponses[index][0]?.data?.data?.media || null,
          ndsc: mediaAndNdcResponses[index][1]?.data?.data?.ndcs || null,
        }));

        mergedData.push(...chunkData);
      })
    );

    return GenResObj(Code.CREATED, true, "Data fetched successfully", mergedData);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage: any = ZODErrorMessage(error)
      return GenResObj(
        Code.INTERNAL_SERVER, true, errorMessage
      );
    }
    return GenResObj(
      Code.INTERNAL_SERVER, true, (error as Error).message
    );
  }
};

export const durgSearchById = async (req: Request) => {
  try {
    const { setid } = req.params;

    const url = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/${setid}.xml`;

    const splsResponse = await axios.get(url);

    return GenResObj(Code.CREATED, true, "Data fetched successfully", splsResponse.data);
  } catch (error) {
    console.log("error", error);
    return GenResObj(
      Code.INTERNAL_SERVER,  true, (error as Error).message
    );
  }
};