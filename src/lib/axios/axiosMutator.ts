import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import AXIOS_INSTANCE from "./axiosClient";

export const axiosMutator = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
  ): Promise<T> => {
    const source = axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
      ...config,
      ...options,
      cancelToken: source.token,
    }).then(({ data }) => data);
  
    // @ts-expect-error - Adding cancel method to Promise for request cancellation
    promise.cancel = () => {
      source.cancel('Query was cancelled');
    };
  
    return promise;
  };
  
  // In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
  export type ErrorType<Error> = AxiosError<Error>;
  
  export type BodyType<BodyData> = BodyData;
  