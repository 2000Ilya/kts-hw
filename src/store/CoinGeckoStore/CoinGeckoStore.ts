import ApiStore from "../../shared/store/ApiStore";
import { HTTPMethod } from "../../shared/store/ApiStore/types";
import {
  ICoinGeckoStore,
  GetCoinsListParams,
  ApiResp,
  CoinItem,
  GetCoinParams,
  Coin,
} from "./types";

export default class CoinGeckoStore implements ICoinGeckoStore {
  private readonly apiStore = new ApiStore("https://api.coingecko.com/api/v3");

  async getCoinsList(params: GetCoinsListParams): Promise<ApiResp<CoinItem[]>> {
    return this.apiStore.request({
      headers: { Accept: "*/*" },
      endpoint: "/coins/markets",
      data: params.queryParameters,
      method: HTTPMethod.GET,
    });
  }

  async getCoin(params: GetCoinParams): Promise<ApiResp<Coin>> {
    return this.apiStore.request({
      headers: { Accept: "*/*" },
      endpoint: `/coins/${params.coinName}`,
      data: params.queryParameters,
      method: HTTPMethod.GET,
    });
  }
}
