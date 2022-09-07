import ApiStore from "@store/ApiStore";
import { HTTPMethod } from "@store/ApiStore/types";
import rootStore from "@store/RootStore";
import { Meta } from "@utils/meta";
import { ILocalStore } from "@utils/useLocalStore";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";

import {
  CoinItemModel,
  normalizeCoinItem,
} from "../../models/shared/coinGecko/coinItem";
import {
  CollectionModel,
  getInitialCollectionModel,
  linearizeCollection,
  normalizeCollection,
} from "../../models/shared/collection";
import { GetCoinsListParams, ICoinsListStore } from "./types";

const BASE_URL = "https://api.coingecko.com/api/v3";

type PrivateFields = "_list" | "_meta" | "_pageNumber";

export default class CoinsListStore implements ICoinsListStore, ILocalStore {
  private readonly apiStore = new ApiStore(BASE_URL);

  private _list: CollectionModel<string, CoinItemModel> = {
    order: [],
    entities: {},
  };
  private _meta: Meta = Meta.initial;
  private _pageNumber: number = 1;

  constructor() {
    makeObservable<CoinsListStore, PrivateFields>(this, {
      _list: observable.ref,
      _meta: observable,
      _pageNumber: observable,
      list: computed,
      meta: computed,
      nextPage: action,
    });
  }

  get list(): CoinItemModel[] {
    return linearizeCollection(this._list);
  }

  get meta(): Meta {
    return this._meta;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }

  nextPage() {
    this._pageNumber = this.pageNumber + 1;
  }

  async getCoinsList(params: GetCoinsListParams): Promise<void> {
    this._meta = Meta.loading;
    this._list = getInitialCollectionModel();

    const response = await this.apiStore.request<CoinItemModel[]>({
      headers: { Accept: "*/*" },
      endpoint: "/coins/markets",
      data: params.queryParameters,
      method: HTTPMethod.GET,
    });

    runInAction(() => {
      if (!response.success) {
        this._meta = Meta.error;
      }

      try {
        const list: CoinItemModel[] = [];
        for (const item of response.data) {
          list.push(normalizeCoinItem(item));
        }

        this._meta = Meta.sucsess;
        this._list = normalizeCollection(list, (listItem) => listItem.id);
        return;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        this._meta = Meta.error;
        this._list = getInitialCollectionModel();
      }
    });
  }

  async fetchMoreCoins(params: GetCoinsListParams): Promise<void> {
    this._meta = Meta.loading;

    const response = await this.apiStore.request<CoinItemModel[]>({
      headers: { Accept: "*/*" },
      endpoint: "/coins/markets",
      data: { ...params.queryParameters, page: this.pageNumber },
      method: HTTPMethod.GET,
    });

    runInAction(() => {
      if (!response.success) {
        this._meta = Meta.error;
      }

      try {
        const list: CoinItemModel[] = this.list;
        for (const item of response.data) {
          list.push(normalizeCoinItem(item));
        }

        this._meta = Meta.sucsess;
        this._list = normalizeCollection(list, (listItem) => listItem.id);
        return;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        this._meta = Meta.error;
        this._list = getInitialCollectionModel();
      }
    });
  }

  destroy(): void {
    this._qPReaction();
  }

  private readonly _qPReaction: IReactionDisposer = reaction(
    () => rootStore.query.getParam("search"),
    (search) => {
      // eslint-disable-next-line no-console
      console.log(search);
    }
  );
}
