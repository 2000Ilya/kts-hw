import React, { useEffect, useState } from "react";

import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Loader, LoaderSize } from "@components/Loader";
import CoinsListStore from "@store/CoinGeckoStore/CoinsListStore";
import { Meta } from "@utils/meta";
import roundNumber from "@utils/roundNumber";
import { useLocalStore } from "@utils/useLocalStore";
import classNames from "classnames";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

import styles from "./ListCoinsPage.module.scss";

const ListCoinsPage: React.FC = React.memo(() => {
  const [inputValue, setInputValue] = useState<string>("");
  const coinsListStore = useLocalStore(() => new CoinsListStore());

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
          onChange={setInputValue}
        />
        <Button>Search</Button>
      </div>
      {coinsListStore.meta === Meta.sucsess ? (
        <div
          className={classNames(styles["coins-list-container"])}
          id={"coins-list"}
        >
          <InfiniteScroll
            dataLength={coinsListStore.list.length}
            next={() =>
              coinsListStore.fetchMoreCoins({
                queryParameters: {
                  vs_currency: "usd",
                  order: "market_cap_desc",
                  per_page: 10,
                  sparkline: false,
                },
              })
            }
            hasMore={true}
            loader={
              <div
                className={classNames(
                  styles["flex-align-center"],
                  styles["list-coins-page__loader-container"]
                )}
              >
                <Loader size={LoaderSize.s} />
              </div>
            }
            scrollableTarget={"coins-list"}
          >
            {coinsListStore.list.map((coinItem) => (
              <Link to={`/coins/${coinItem.id}`}>
                <Card
                  key={coinItem.id}
                  image={coinItem.image}
                  title={coinItem.name}
                  subtitle={coinItem.symbol}
                  currentPrice={`${roundNumber(coinItem.currentPrice)}`}
                  priceChangePercentage={`${roundNumber(
                    coinItem.priceChangePercentage24h
                  )}%`}
                />
              </Link>
            ))}
          </InfiniteScroll>
        </div>
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
