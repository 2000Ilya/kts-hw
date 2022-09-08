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
    () => new CoinsListStore(searchParams.get("search") || "")
  );

  const handleSearchInputChange = useCallback(
    (text: string): void => {
      setSearchParams(text ? createSearchParams({ search: text }) : "");
      coinsListStore.setInputValue(text);
    },
    [searchParams]
  );

  useEffect(() => {
    coinsListStore.getCoinsList({
      queryParameters: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        sparkline: false,
      },
    });
  }, [coinsListStore]);

  return (
    <div className={classNames(styles["list-coins-page"])}>
      <div className={classNames(styles["search-bar-container"])}>
        <Input
          placeholder={"Search Cryptocurrency"}
          value={coinsListStore.inputValue}
          onChange={handleSearchInputChange}
        />
        <Button>Search</Button>
      </div>
      {coinsListStore.meta === Meta.sucsess ||
      coinsListStore.list.length > 0 ? (
        <List
          loadMore={() =>
            coinsListStore.fetchMoreCoins({
              queryParameters: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 10,
                sparkline: false,
              },
            })
          }
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
