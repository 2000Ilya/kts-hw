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
import _ from "lodash";

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
  | "_category"
  | "_selectedCurrency"
  | "_currencyList";

export default class CoinsListStore implements ICoinsListStore, ILocalStore {
  private readonly apiStore = new ApiStore(BASE_URL);
  private readonly defaultQueryParams = {
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
  private _selectedCurrency: string = "usd";
  private _currencyList: string[] = [];

  constructor(inputValue: string, category: string) {
    makeObservable<CoinsListStore, PrivateFields>(this, {
      _list: observable.ref,
      _currencyList: observable.ref,
      _meta: observable,
      _selectedCurrency: observable,
      _pageNumber: observable,
      _searchValue: observable,
      _category: observable,
      list: computed,
      meta: computed,
      addPage: action,
      getCoinsList: action,
      getCurrencyList: action,
      setInputValue: action,
      setCategory: action,
      clearCoins: action,
      setCurrency: action,
    });

    this._searchValue = inputValue;
    this._category = category;
    this.getCurrencyList();
    this.getCoinsList();
  }

  get list(): CoinItemModel[] {
    return linearizeCollection(this._list);
  }

  get currencyList(): string[] {
    return this._currencyList;
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

  get selectedCurrency(): string {
    return this._selectedCurrency;
  }

  setCurrency(currency: string) {
    if (this._selectedCurrency !== currency) {
      this._selectedCurrency = currency;
      this.clearCoins();
      this.getCoinsList();
    }
  }

  setInputValue(inputValue: string) {
    if (inputValue !== this.searchValue) {
      this._searchValue = inputValue;
      this._category = "";
      this._selectedCurrency = "usd";
      this.clearCoins();
      this.getCoinsList();
    }
  }

  setCategory(category: string) {
    if (category !== this.category || this._searchValue !== "") {
      this._category = category;
      this._searchValue = "";
      this._selectedCurrency = "usd";
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
        vs_currency: this._selectedCurrency,
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

  async getCurrencyList(): Promise<void> {
    this._meta = Meta.loading;
    this._currencyList = [];

    const response = await this.apiStore.request<string[]>({
      headers: { Accept: "*/*" },
      endpoint: `/simple/supported_vs_currencies`,
      data: {},
      method: HTTPMethod.GET,
    });

    runInAction(() => {
      if (response.success) {
        this._meta = Meta.success;
        this._currencyList = response.data;
        return;
      }

      this._meta = Meta.error;
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
    _.debounce((search) => {
      if (search !== undefined && typeof search === "string") {
        this._searchValue = search;
      }
    }, 500)
  );
}
