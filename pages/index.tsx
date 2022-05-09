import axios, { AxiosError } from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { ZodFormattedError } from "zod";
import {
  CreateShortInput,
  TCreateShortInput,
  TCreateShortOutput,
} from "../validations/createshort";
import { ClipboardText, SpinnerGap } from "phosphor-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

const HomePage: NextPage = () => {
  const [formbody, setFormBody] = useState<Partial<TCreateShortInput>>();
  const [formerror, setFormError] =
    useState<ZodFormattedError<TCreateShortInput>>();

  useEffect(() => {
    const result = CreateShortInput.safeParse(formbody);
    const error = result.success ? undefined : result.error.format();
    setFormError(error);
  }, [formbody]);

  function onURLChange(url: string) {
    const protocols = ["https://", "http://"];
    const startsWithProtocol = protocols.some((protocol) =>
      url.startsWith(protocol)
    );
    setFormBody({ long: startsWithProtocol ? url : `https://${url}` });
  }

  const { isLoading, mutate, data } = useMutation<
    TCreateShortOutput,
    AxiosError,
    TCreateShortInput
  >(async (input) => (await axios.post("/api/short", input)).data, {
    onError: () => {
      toast.error("Something went wrong 😔");
    },
  });

  function tryMutate() {
    if (isLoading || !formbody || formerror) {
      return;
    }
    mutate(formbody as TCreateShortInput);
  }

  function fullURL(short: string) {
    const currentHost = `${location.protocol}//${location.host}`;
    return `${currentHost}/${short}`;
  }

  return (
    <div className="w-[460px] sm:w-[500px] md:w-[520px] lg:w-[560px] xl:w-[640px] 2xl:w-[720px] mx-auto">
      <div className="p-5 border rounded border-neutral-600 mt-24 bg-neutral-800">
        <input
          type="text"
          placeholder="https://youtube.com"
          className="w-full p-2 text-3xl"
          onKeyDown={(e) => e.code === "Enter" && tryMutate()}
          onChange={(e) => onURLChange(e.target.value)}
        />
        {formerror?.long?._errors.map((err, i) => (
          <p key={i} className="text-red-500">
            • {err}
          </p>
        ))}
        <button
          className={`w-full mt-5 text-2xl p-2 rounded
          ${isLoading && "animate-pulse"}
          ${!formerror && !isLoading && "hover:bg-cyan-600"}
          ${formerror ? "bg-cyan-900" : "bg-cyan-700"}`}
          disabled={isLoading || !!formerror}
          onClick={tryMutate}
        >
          {isLoading ? (
            <>
              <SpinnerGap className="inline-block animate-spin mr-2" />
              shrinking...
            </>
          ) : (
            "tiny it!"
          )}
        </button>
      </div>
      <AnimatePresence>
        {data?.short && (
          <motion.div
            className="p-5 border rounded border-neutral-600 mt-12 bg-neutral-800"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
          >
            <p className="text-xl inline-block">{fullURL(data.short)}</p>
            <button
              className="float-right hover:bg-neutral-700 p-1 rounded"
              onClick={() => navigator.clipboard.writeText(fullURL(data.short))}
            >
              <ClipboardText className="text-xl" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
