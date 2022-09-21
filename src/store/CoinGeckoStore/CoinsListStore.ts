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
  normalizeCoinItemSearched,
} from "../../models/shared/coinGecko/coinItem";
import {
  CollectionModel,
  getInitialCollectionModel,
  linearizeCollection,
  normalizeCollection,
} from "../../models/shared/collection";
import {
  ApiReqCoinsListBySearchData,
  ApiReqCoinsListData,
  GetCoinsListParams,
  ICoinsListStore,
} from "./types";

const BASE_URL = "https://api.coingecko.com/api/v3";

type PrivateFields =
  | "_list"
  | "_meta"
  | "_pageNumber"
  | "_searchValue"
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
  private _searchValue: string;
  private _category: string;

  constructor(inputValue: string, category: string) {
    makeObservable<CoinsListStore, PrivateFields>(this, {
      _list: observable.ref,
      _meta: observable,
      _pageNumber: observable,
      _searchValue: observable,
      _category: observable,
      list: computed,
      meta: computed,
      addPage: action,
      getCoinsList: action,
      setInputValue: action,
      setCategory: action,
      clearCoins: action,
    });

    this._searchValue = inputValue;
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

  get searchValue(): string {
    return this._searchValue;
  }

  get category(): string {
    return this._category;
  }

  setInputValue(inputValue: string) {
    if (inputValue !== this.searchValue) {
      this._searchValue = inputValue;
      this._category = "";
      this.clearCoins();
      this.getCoinsList();
    }
  }

  setCategory(category: string) {
    if (category !== this.category) {
      this._category = category;
      this._searchValue = "";
      this.clearCoins();
      this.getCoinsList();
    }
  }

  addPage() {
    this._pageNumber = this.pageNumber + 1;
  }

  clearCoins() {
    this._pageNumber = 1;
    this._list = getInitialCollectionModel();
  }

  async getCoinsList(params?: GetCoinsListParams): Promise<void> {
    this._meta = Meta.loading;
    let data: ApiReqCoinsListData | ApiReqCoinsListBySearchData;
    let endpoint: string;
    if (this.searchValue === "") {
      data = {
        ...this.defaultQueryParams,
        ...params?.queryParameters,
        page: this.pageNumber,
      };
      if (this.category) {
        data.category = this.category;
      }
      endpoint = "/coins/markets";
    } else {
      data = {
        query: this.searchValue,
      };
      endpoint = "/search";
    }

    const response = await this.apiStore.request<CoinItemModel[]>({
      headers: { Accept: "*/*" },
      endpoint,
      data,
      method: HTTPMethod.GET,
    });

    this.addPage();

    runInAction(() => {
      if (!response.success) {
        this._meta = Meta.error;
      }

      try {
        const list: CoinItemModel[] = this.list;
        let responseData;
        if (this.searchValue === "") {
          responseData = response.data;
        } else {
          responseData = response.data.coins;
        }
        for (const item of responseData) {
          if (this.searchValue === "") {
            list.push(normalizeCoinItem(item));
          } else {
            list.push(normalizeCoinItemSearched(item));
          }
        }

        this._meta = Meta.success;
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
    this._qPCategoryReaction();
    this._qPSearchReaction();
  }

  private readonly _qPCategoryReaction: IReactionDisposer = reaction(
    () => {
      return rootStore.query.getParam("category");
    },
    (category) => {
      if (category !== undefined && typeof category === "string") {
        this._category = category;
      }
    }
  );

  private readonly _qPSearchReaction: IReactionDisposer = reaction(
    () => {
      const search = rootStore.query.getParam("search");
      return search;
    },
    (search) => {
      if (search !== undefined && typeof search === "string") {
        this._searchValue = search;
      }
    }
  );
}
