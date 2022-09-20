import React, { useEffect } from "react";

import ArrowLeftIcon from "@components/ArrowLeftIcon";
import { Loader, LoaderSize } from "@components/Loader";
import CoinInfoStore from "@store/CoinGeckoStore/CoinInfoStore";
import { Meta } from "@utils/meta";
import roundNumber from "@utils/roundNumber";
import { useLocalStore } from "@utils/useLocalStore";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from "./CoinInfoPage.module.scss";
import {
  coinInfoValueStringConstructor,
  priceStringConstructor,
} from "@utils/valueStringConstructors";

const CoinInfoPage = () => {
  const coinInfoStore = useLocalStore(() => new CoinInfoStore());
  const { id } = useParams<{ id: string }>();
  const price: number | undefined =
    coinInfoStore.coin?.market_data.current_price.usd;
  const priceDiff: number | undefined =
    coinInfoStore.coin?.market_data.price_change_24h;
  const percentageDiff: number | undefined =
    coinInfoStore.coin?.market_data.price_change_percentage_24h;

  useEffect(() => {
    coinInfoStore.getCoin({
      coinName: id,
      queryParameters: {},
    });
  }, [coinInfoStore]);

  useEffect(() => {}, [coinInfoStore.meta]);

  return (
    <div className={classNames(styles["coin-info-page"])}>
      <div className={classNames(styles["coin-info-page__header-group"])}>
        <Link to={"/coins"} className={classNames(styles["coin-info__back"])}>
          <ArrowLeftIcon />
        </Link>
        <div className={classNames(styles["coin-info-page__info-group"])}>
          {coinInfoStore.coin && (
            <img
              className={classNames(styles["coin-info-page__coin-image"])}
              src={coinInfoStore.coin.image.large}
            />
          )}

          {coinInfoStore.meta === Meta.loading && !coinInfoStore.coin && (
            <Loader size={LoaderSize.s} />
          )}

          <div
            className={classNames(styles["coin-info-page__coin-name-group"])}
          >
            <h2 className={classNames(styles["coin-info-page__coin-name"])}>
              {coinInfoStore.coin && coinInfoStore.coin.name}
              <span
                className={classNames(styles["coin-info-page__coin-symbol"])}
              >
                {coinInfoStore.coin && `(${coinInfoStore.coin.symbol})`}
              </span>
            </h2>
          </div>
        </div>
      </div>
      <div className={classNames(styles["coin-info-page__coin-value-group"])}>
        <h1 className={classNames(styles["coin-info-page__coin-value"])}>
          {coinInfoStore.coin !== null &&
            priceStringConstructor("$", `${price}`)}

          {priceDiff !== undefined && percentageDiff !== undefined && (
            <span
              className={classNames(
                styles["coin-info-page__coin-diff"],
                percentageDiff >= 0
                  ? styles["coin-info-page__value-growing"]
                  : styles["coin-info-page__value-dropping"]
              )}
            >
              {coinInfoValueStringConstructor(priceDiff, percentageDiff)}
            </span>
          )}
        </h1>
      </div>
    </div>
  );
};

export default observer(CoinInfoPage);
