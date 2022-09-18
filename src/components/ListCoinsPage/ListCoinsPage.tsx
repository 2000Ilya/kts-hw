import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@components/Button";
import Input from "@components/Input";
import List from "@components/List/List";
import { Loader } from "@components/Loader";
import CoinsListStore from "@store/CoinGeckoStore/CoinsListStore";
import { Meta } from "@utils/meta";
import { useLocalStore } from "@utils/useLocalStore";
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
        <div className={classNames(styles["search-bar-container"])}>
          <Input
            placeholder={"Search Cryptocurrency"}
            value={coinsListStore.searchValue}
            onChange={handleSearchInputChange}
          />
          <Button>Search</Button>
        </div>
        <div className={classNames(styles["tabs-container"])}>
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
      </div>
      {coinsListStore.meta === Meta.sucsess ||
      coinsListStore.list.length > 0 ? (
        <List
          hasMore={!isCoinsSearching}
          loadMore={loadMoreCoins}
          list={coinsListStore.list}
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
