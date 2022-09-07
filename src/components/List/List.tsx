import React from "react";

import Card from "@components/Card";
import { Loader, LoaderSize } from "@components/Loader";
import roundNumber from "@utils/roundNumber";
import classNames from "classnames";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { CoinItemModel } from "src/models/shared/coinGecko/coinItem";

import styles from "./List.module.scss";

type ListProps = { list: CoinItemModel[]; loadMore: () => Promise<void> };

const List = ({ list, loadMore }: ListProps) => {
  return (
    <div
      className={classNames(styles["coins-list-container"])}
      id={"coins-list"}
    >
      <InfiniteScroll
        dataLength={list.length}
        next={loadMore}
        hasMore={true}
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
  );
};

export default React.memo(List);
