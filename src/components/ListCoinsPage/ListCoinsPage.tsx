import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@components/Button";
import Input from "@components/Input";
import List from "@components/List/List";
import { Loader } from "@components/Loader";
import CoinsListStore from "@store/CoinGeckoStore/CoinsListStore";
import { Meta } from "@utils/meta";
import { useLocalStore } from "@utils/useLocalStore";
import classNames from "classnames";
import { createSearchParams, useSearchParams } from "react-router-dom";

import styles from "./ListCoinsPage.module.scss";

const ListCoinsPage: React.FC = React.memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState<string>("");
  const coinsListStore = useLocalStore(() => new CoinsListStore());

  const handleSearchInputChange = useCallback(
    (text: string): void => {
      setSearchParams(createSearchParams({ search: text }));
      setInputValue(text);
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
          value={inputValue}
          onChange={handleSearchInputChange}
        />
        <Button>Search</Button>
      </div>
      {coinsListStore.meta === Meta.sucsess ? (
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
});

export default ListCoinsPage;
