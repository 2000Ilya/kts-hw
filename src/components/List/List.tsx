import React from "react";

import Card from "@components/Card";
import { Loader, LoaderSize } from "@components/Loader";
import roundNumber from "@utils/roundNumber";
import classNames from "classnames";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { CoinItemModel } from "../../models/shared/coinGecko/coinItem";

import styles from "./List.module.scss";

type ListProps = {
  list: CoinItemModel[];
  loadMore: () => Promise<void> | void;
  hasMore: boolean;
};

const List = ({ list, loadMore, hasMore }: ListProps) => {
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
                  ? `${roundNumber(coinItem.currentPrice)}`
                  : null
              }
              priceChangePercentage={
                coinItem.priceChangePercentage24h !== null
                  ? `${roundNumber(coinItem.priceChangePercentage24h)}%`
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
