import React from "react";

import Card from "@components/Card";
import { Loader, LoaderSize } from "@components/Loader";
import roundNumber from "@utils/roundNumber";
import classNames from "classnames";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { CoinItemModel } from "../../models/shared/coinGecko/coinItem";

import styles from "./List.module.scss";
import {
  percentageStringConstructor,
  priceStringConstructor,
} from "@utils/valueStringConstructors";
import getCurrencySign from "@utils/getCurrencySign";

type ListProps = {
  list: CoinItemModel[];
  loadMore: () => Promise<void> | void;
  hasMore: boolean;
  currency: string;
};

const List = ({ list, loadMore, hasMore, currency }: ListProps) => {
  return (
    <div
      className={classNames(styles["coins-list-container"])}
      id={"coins-list"}
    >
      <InfiniteScroll
        dataLength={list.length}
        next={loadMore}
        hasMore={hasMore}
        style={{
          overflow: "hidden",
        }}
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
        {list.map((coinItem) => (
          <Link to={`/coins/${coinItem.id}`} key={coinItem.id}>
            <Card
              image={coinItem.image}
              title={coinItem.name}
              subtitle={coinItem.symbol}
              currentPrice={
                coinItem.currentPrice !== null
                  ? priceStringConstructor(
                      getCurrencySign(currency),
                      coinItem.currentPrice
                    )
                  : null
              }
              priceChangePercentage={
                coinItem.priceChangePercentage24h !== null
                  ? percentageStringConstructor(
                      coinItem.priceChangePercentage24h
                    )
                  : null
              }
              isValueGrowing={
                coinItem.priceChangePercentage24h !== null
                  ? coinItem.priceChangePercentage24h >= 0
                  : null
              }
            />
          </Link>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default React.memo(List);
