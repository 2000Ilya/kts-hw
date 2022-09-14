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
      const category = searchParams.get("category");
      if (category || text) {
        const newSearchParams = text
          ? {
              search: text,
            }
          : {};
        const newCategoryParams = category
          ? {
              category,
            }
          : {};
        newParams = { ...newCategoryParams, ...newSearchParams };
      }

      setSearchParams(createSearchParams(newParams));
      coinsListStore.setInputValue(text);
    },
    [searchParams]
  );

  const handleTabsSelect = useCallback(
    (category: string): void => {
      let newParams = {};
      const search = searchParams.get("search");
      if (category || search) {
        const newSearchParams = search
          ? {
              search,
            }
          : {};
        const newCategoryParams = category
          ? {
              category,
            }
          : {};
        newParams = { ...newCategoryParams, ...newSearchParams };
      }

      setSearchParams(createSearchParams(newParams));
      coinsListStore.setCategory(category);
    },
    [searchParams]
  );

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
            value={coinsListStore.inputValue}
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
          loadMore={() => coinsListStore.getCoinsList()}
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
