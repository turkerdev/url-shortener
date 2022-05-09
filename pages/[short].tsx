import axios, { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { SpinnerGap } from "phosphor-react";
import { useQuery } from "react-query";
import { TGetLongOutput } from "../validations/getlong";

const RedirectPage: NextPage = () => {
  const router = useRouter();
  const { short } = router.query;

  const { isLoading, error, isError } = useQuery<TGetLongOutput, AxiosError>(
    "redirect",
    async () => (await axios.get(`/api/short/?short=${short}`)).data,
    {
      enabled: !!short,
      onSuccess: (data) => {
        location.href = data.long;
      },
    }
  );

  function isNotFound() {
    return error?.response?.status === 404;
  }

  if (isLoading) {
    return <SpinnerGap className="animate-spin text-7xl mx-auto mt-24" />;
  }

  if (isNotFound()) {
    return <p className="text-6xl text-center mt-24">Not Found 😔</p>;
  }

  if (isError) {
    return (
      <p className="text-4xl text-center mt-24">Something went wrong 😔</p>
    );
  }

  return <></>;
};

export default RedirectPage;
