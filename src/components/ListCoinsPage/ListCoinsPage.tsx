import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@components/Button";
import Input from "@components/Input";
import List from "@components/List/List";
import { Loader } from "@components/Loader";
import { MultiDropdown, Option } from "@components/MultiDropdown";
import CoinsListStore from "@store/CoinGeckoStore/CoinsListStore";
import { Meta } from "@utils/meta";
import { useLocalStore } from "@utils/useLocalStore";
import pluralizeOptions from "@utils/pluralizeOptions";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { createSearchParams, useSearchParams } from "react-router-dom";

import styles from "./ListCoinsPage.module.scss";

const ListCoinsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const coinsListStore = useLocalStore(
    () =>
      new CoinsListStore(
        searchParams.get("search") || "",
        searchParams.get("category") || ""
      )
  );

  const handleSearchInputChange = useCallback(
    (text: string): void => {
      let newParams = {};
      if (text) {
        const newSearchParams = text
          ? {
              search: text,
            }
          : {};
        newParams = { ...newSearchParams };
      }

      setSearchParams(createSearchParams(newParams));
      coinsListStore.setInputValue(text);
    },
    [searchParams]
  );

  const handleTabsSelect = useCallback(
    (category: string): void => {
      let newParams = {};
      if (category) {
        const newCategoryParams = category
          ? {
              category,
            }
          : {};
        newParams = { ...newCategoryParams };
      }

      setSearchParams(createSearchParams(newParams));
      coinsListStore.setCategory(category);
    },
    [searchParams]
  );

  const isCoinsSearching = coinsListStore.searchValue.length > 0;

  const loadMoreCoins = () => {
    if (!isCoinsSearching) {
      coinsListStore.getCoinsList();
    } else {
      return;
    }
  };

  useEffect(() => {
    return () => {
      coinsListStore.destroy();
    };
  }, []);

  return (
    <div className={classNames(styles["list-coins-page"])}>
      <div className={classNames(styles["list-coins-page__head-group"])}>
        <div
          className={classNames(
            styles["list-coins-page__search-bar-container"]
          )}
        >
          <Input
            placeholder={"Search Cryptocurrency"}
            value={coinsListStore.searchValue}
            onChange={handleSearchInputChange}
          />
          <Button>Search</Button>
        </div>
        <div
          className={classNames(styles["list-coins-page__options-container"])}
        >
          <div
            className={classNames(styles["list-coins-page__tabs-container"])}
          >
            <Button
              onClick={() => {
                handleTabsSelect("");
              }}
            >
              All
            </Button>
            <Button
              onClick={() => {
                handleTabsSelect("ethereum-ecosystem");
              }}
            >
              ETH-eco
            </Button>
          </div>
          <MultiDropdown
            options={coinsListStore.currencyList.map((e: string) => ({
              key: e,
              value: e,
            }))}
            value={[
              {
                key: coinsListStore.selectedCurrency,
                value: coinsListStore.selectedCurrency,
              },
            ]}
            onChange={(value: Option[]) => {
              coinsListStore.setCurrency(value[0].value);
            }}
            disabled={false}
            pluralizeOptions={pluralizeOptions}
            hasMultiSelect={false}
          />
        </div>
      </div>
      {coinsListStore.meta === Meta.success ||
      coinsListStore.list.length > 0 ? (
        <List
          hasMore={!isCoinsSearching}
          loadMore={loadMoreCoins}
          list={coinsListStore.list}
          currency={coinsListStore.selectedCurrency}
        />
      ) : (
        <div
          className={classNames(
            styles["fullfilled-container"],
            styles["flex-align-center"]
          )}
        >
          <Loader />
        </div>
      )}
    </div>
  );
};

export default observer(ListCoinsPage);
