import ApiStore from "store/ApiStore";
import { HTTPMethod } from "store/ApiStore/types";
import rootStore from "store/RootStore";
import { Meta } from "utils/meta";
import { ILocalStore } from "utils/useLocalStore";
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
import { ApiReqData, GetCoinsListParams, ICoinsListStore } from "./types";

const BASE_URL = "https://api.coingecko.com/api/v3";

type PrivateFields =
  | "_list"
  | "_meta"
  | "_pageNumber"
  | "_inputValue"
  | "_category";

export default class CoinsListStore implements ICoinsListStore, ILocalStore {
  private readonly apiStore = new ApiStore(BASE_URL);
  private readonly defaultQueryParams = {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 10,
    sparkline: false,
  };

  private _list: CollectionModel<string, CoinItemModel> =
    getInitialCollectionModel();
  private _meta: Meta = Meta.initial;
  private _pageNumber: number = 1;
  private _inputValue: string;
  private _category: string;

  constructor(inputValue: string, category: string) {
    makeObservable<CoinsListStore, PrivateFields>(this, {
      _list: observable.ref,
      _meta: observable,
      _pageNumber: observable,
      _inputValue: observable,
      _category: observable,
      list: computed,
      meta: computed,
      nextPage: action,
      getCoinsList: action,
      setInputValue: action,
      setCategory: action,
    });

    this._inputValue = inputValue;
    this._category = category;
    this.getCoinsList();
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

  get inputValue(): string {
    return this._inputValue;
  }

  get category(): string {
    return this._category;
  }

  setInputValue(inputValue: string) {
    this._inputValue = inputValue;
  }

  setCategory(category: string) {
    if (category !== this.category) {
      this._category = category;
      this._pageNumber = 1;
      this._list = getInitialCollectionModel();
      this.getCoinsList();
    }
  }

  nextPage() {
    this._pageNumber = this.pageNumber + 1;
  }

  async getCoinsList(params?: GetCoinsListParams): Promise<void> {
    this._meta = Meta.loading;
    let data: ApiReqData = {
      ...this.defaultQueryParams,
      ...params?.queryParameters,
      page: this.pageNumber,
    };

    if (this.category) {
      data.category = this.category;
    }

    const response = await this.apiStore.request<CoinItemModel[]>({
      headers: { Accept: "*/*" },
      endpoint: "/coins/markets",
      data,
      method: HTTPMethod.GET,
    });

    this.nextPage();

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
    this._list = getInitialCollectionModel();
    this._meta = Meta.initial;
    this._pageNumber = 1;
    this._qPReaction();
  }

  private readonly _qPReaction: IReactionDisposer = reaction(
    () => {
      const search = rootStore.query.getParam("search");
      const category = rootStore.query.getParam("category");
      return [search, category];
    },
    ([search, category]) => {
      if (category !== undefined && typeof category === "string") {
        this._category = category;
      }
    }
  );
}
