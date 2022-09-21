import ApiStore from "@store/ApiStore";
import { HTTPMethod } from "@store/ApiStore/types";
import chartDataParse from "@utils/chartDataParse";
import { Meta } from "@utils/meta";
import { ILocalStore } from "@utils/useLocalStore";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import {
  Chart,
  ChartDataParsed,
  Coin,
  GetCoinParams,
  ICoinInfoStore,
} from "./types";

const BASE_URL = "https://api.coingecko.com/api/v3";

type PrivateFields = "_coin" | "_meta" | "_chartData" | "_coinName";

export default class CoinInfoStore implements ICoinInfoStore, ILocalStore {
  private readonly apiStore = new ApiStore(BASE_URL);

  private _coin: Coin | null = null;
  private _chartData: ChartDataParsed[] | null = null;
  private _coinName: string;
  private _meta: Meta = Meta.initial;

  constructor(coinName: string) {
    makeObservable<CoinInfoStore, PrivateFields>(this, {
      _coin: observable,
      _chartData: observable,
      _coinName: observable,
      _meta: observable,
      coin: computed,
      meta: computed,
      getCoin: action,
      getChartData: action,
      getData: action,
    });

    this._coinName = coinName;
    this.getData({ coinName, queryParameters: {} });
  }

  get coin(): Coin | null {
    return this._coin;
  }

  get chartData(): ChartDataParsed[] | null {
    return this._chartData;
  }

  get meta(): Meta {
    return this._meta;
  }

  async getData(params: GetCoinParams) {
    await this.getCoin(params);
    await this.getChartData(params);
  }

  async getCoin(params: GetCoinParams): Promise<void> {
    this._meta = Meta.loading;
    this._coin = null;

    const response = await this.apiStore.request<Coin>({
      headers: { Accept: "*/*" },
      endpoint: `/coins/${params.coinName}`,
      data: params.queryParameters,
      method: HTTPMethod.GET,
    });

    runInAction(() => {
      if (response.success) {
        this._meta = Meta.success;
        this._coin = response.data;
        return;
      }

      this._meta = Meta.error;
    });
  }

  async getChartData(params: GetCoinParams): Promise<void> {
    this._meta = Meta.loading;
    this._chartData = null;
    const fullParams = {
      ...params.queryParameters,
      vs_currency: "usd",
      days: 1,
    };

    const response = await this.apiStore.request<Chart>({
      headers: { Accept: "*/*" },
      endpoint: `/coins/${params.coinName}/market_chart`,
      data: fullParams,
      method: HTTPMethod.GET,
    });

    runInAction(() => {
      if (response.success) {
        this._meta = Meta.success;
        this._chartData = chartDataParse(response.data.prices);
        return;
      }

      this._meta = Meta.error;
    });
  }

  destroy(): void {
    this._coin = null;
    this._chartData = null;
    this._meta = Meta.initial;
  }
}
