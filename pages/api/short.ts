import { NextApiHandler } from "next";
import {
  CreateShortInput,
  TCreateShortOutput,
  CreateShortOutput,
} from "../../validations/createshort";
import {
  TGetLongOutput,
  GetLongInput,
  GetLongOutput,
  TGetLongInput,
} from "../../validations/getlong";
import { nanoid } from "nanoid";
import { prisma } from "../../utils/prisma";

const handler: NextApiHandler<
  | TCreateShortOutput
  | TGetLongOutput
  | "Not Found"
  | "Bad Request"
  | "Internal Server Error"
> = async (req, res) => {
  if (req.method === "GET") {
    const validation = await GetLongInput.spa(req.query);

    if (!validation.success) {
      return res.status(400).send("Bad Request");
    }

    const shortener = await prisma.shortener.findUnique({
      where: {
        short: validation.data.short,
      },
    });

    if (!shortener) {
      return res.status(404).send("Not Found");
    }

    const json: TGetLongOutput = {
      long: shortener.long,
    };

    const result = await GetLongOutput.spa(json);

    return res.json(result.success ? result.data : "Internal Server Error");
  } else if (req.method === "POST") {
    const validation = await CreateShortInput.spa(req.body);

    if (!validation.success) {
      return res.status(400).send("Bad Request");
    }

    const short = nanoid(5);

    const shortener = await prisma.shortener.create({
      data: {
        short,
        long: validation.data.long,
      },
    });

    const json: TCreateShortOutput = {
      short: shortener.short,
    };

    const result = await CreateShortOutput.spa(json);

    return res.json(result.success ? result.data : "Internal Server Error");
  } else {
    return res.status(404).send("Not Found");
  }
};
export default handler;
