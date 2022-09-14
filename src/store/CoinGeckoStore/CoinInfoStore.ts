import ApiStore from "store/ApiStore";
import { HTTPMethod } from "store/ApiStore/types";
import { Meta } from "utils/meta";
import { ILocalStore } from "utils/useLocalStore";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import { Coin, GetCoinParams, ICoinInfoStore } from "./types";

const BASE_URL = "https://api.coingecko.com/api/v3";

type PrivateFields = "_coin" | "_meta";

export default class CoinInfoStore implements ICoinInfoStore, ILocalStore {
  private readonly apiStore = new ApiStore(BASE_URL);

  private _coin: Coin | null = null;
  private _meta: Meta = Meta.initial;

  constructor() {
    makeObservable<CoinInfoStore, PrivateFields>(this, {
      _coin: observable,
      _meta: observable,
      coin: computed,
      meta: computed,
      getCoin: action,
    });
  }

  get coin(): Coin | null {
    return this._coin;
  }

  get meta(): Meta {
    return this._meta;
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
        this._meta = Meta.sucsess;
        this._coin = response.data;
        return;
      }

      this._meta = Meta.error;
    });
  }

  destroy(): void {
    this._coin = null;
    this._meta = Meta.initial;
  }
}
