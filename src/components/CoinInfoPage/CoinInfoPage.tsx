import React, { useEffect, useState } from "react";

import ArrowLeftIcon from "@components/ArrowLeftIcon";
import { Loader, LoaderSize } from "@components/Loader";
import { Coin } from "@store/CoinGeckoStore/types";
import coinGeckoStore from "@store/coinGeckoStoreInstance";
import roundNumber from "@utils/roundNumber";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import styles from "./CoinInfoPage.module.scss";

const CoinInfoPage = () => {
  const [coin, setCoin] = useState<Coin | null>(null);
  const [isImageLoading, setImageLoading] = useState<boolean>(true);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCoinData = async () => {
      const result = await coinGeckoStore.getCoin({
        coinName: id,
        queryParameters: {},
      });
      setCoin(result.success ? result.data : null);
    };
    fetchCoinData();

    return () => {
      setCoin(null);
    };
  }, []);
  return (
    <div className={classNames(styles["coin-info-page"])}>
      <div className={classNames(styles["coin-info-page__header-group"])}>
        <Link to={"/coins"} className={classNames(styles["coin-info__back"])}>
          <ArrowLeftIcon />
        </Link>
        <div className={classNames(styles["coin-info-page__info-group"])}>
          {coin && (
            <img
              className={classNames(styles["coin-info-page__coin-image"])}
              src={coin.image.large}
              onLoad={() => setImageLoading(false)}
            />
          )}

          {isImageLoading && !coin && <Loader size={LoaderSize.s} />}

          <div
            className={classNames(styles["coin-info-page__coin-name-group"])}
          >
            <h2 className={classNames(styles["coin-info-page__coin-name"])}>
              {coin && coin.name}
              <span
                className={classNames(styles["coin-info-page__coin-symbol"])}
              >
                {coin && `(${coin.symbol})`}
              </span>
            </h2>
          </div>
        </div>
      </div>
      <div className={classNames(styles["coin-info-page__coin-value-group"])}>
        <h1 className={classNames(styles["coin-info-page__coin-value"])}>
          {coin && `$${roundNumber(coin.market_data.current_price.usd)}`}
          <span className={classNames(styles["coin-info-page__coin-diff"])}>
            {coin &&
              `$${roundNumber(
                coin.market_data.price_change_24h
              )} (${roundNumber(
                coin.market_data.price_change_percentage_24h
              )}%)`}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default React.memo(CoinInfoPage);
