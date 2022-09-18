import qs from "qs";

import {
  ApiResponse,
  HTTPMethod,
  IApiStore,
  RequestParams,
  StatusHTTP,
} from "./types";

export default class ApiStore implements IApiStore {
  readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<SuccessT, ErrorT = any, ReqT = {}>(
    params: RequestParams<ReqT>
  ): Promise<ApiResponse<SuccessT, ErrorT>> {
    const url = `${this.baseUrl}${params.endpoint}${
      params.method === HTTPMethod.GET ? `?${qs.stringify(params.data)}` : ""
    }`;

    const commonRequestParams = {
      headers: params.headers,
      method: params.method,
    };

    const requestParams =
      params.method === HTTPMethod.GET
        ? commonRequestParams
        : {
            ...commonRequestParams,
            body: JSON.stringify(params.data),
          };

    try {
      const response = await fetch(url, requestParams);

      if (response.ok) {
        return {
          success: true,
          data: await response.json(),
          status: response.status,
        };
      }

      return {
        success: false,
        data: await response.json(),
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        data: error,
        status: StatusHTTP.UNEXPECTED_ERROR,
      };
    }
  }
}
