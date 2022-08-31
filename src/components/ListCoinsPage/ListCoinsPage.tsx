import React, { useEffect, useState } from "react";

import "./ListCoinsPage.scss";
import Button from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Loader, LoaderSize } from "@components/Loader";
import { CoinItem } from "@store/CoinGeckoStore/types";
import coinGeckoStore from "@store/coinGeckoStoreInstance";
import roundNumber from "@utils/roundNumber";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

const ListCoinsPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [coinsList, setCoinsList] = useState<CoinItem[]>([]);
  const [page, setPage] = useState<number>(1);

  const setNextPage = () => {
    setPage((pageNumber) => pageNumber + 1);
  };

  const fetchCoinsData = async () => {
    return await coinGeckoStore.getCoinsList({
      queryParameters: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page,
        sparkline: false,
      },
    });
  };

  useEffect(() => {
    const firstDataFetch = async () => {
      const coinsData = await fetchCoinsData();
      setCoinsList(coinsData.success ? coinsData.data : []);
      setNextPage();
      // eslint-disable-next-line no-console
      console.log(coinsData.success ? coinsData.data : []);
    };

    firstDataFetch();

    return () => {
      setCoinsList([]);
    };
  }, []);

  const fetchMoreCoins = async () => {
    await setTimeout(async () => {
      const coinsData = await fetchCoinsData();
      const nextCoins = coinsData.success ? coinsData.data : [];
      setCoinsList((coins) => coins.concat(nextCoins));
      setNextPage();
    }, 2000);
  };

  return (
    <div className={"list-coins-page"}>
      <div className={"search-bar-container"}>
        <Input
          placeholder={"Search Cryptocurrency"}
          value={inputValue}
          onChange={setInputValue}
        />
        <Button>cancel</Button>
      </div>
      {coinsList.length > 0 ? (
        <div className={"coins-list-container"} id={"coins-list"}>
          <InfiniteScroll
            dataLength={coinsList.length}
            next={fetchMoreCoins}
            hasMore={true}
            loader={
              <div className={"flex-align-center"} style={{ height: "4rem" }}>
                <Loader size={LoaderSize.s} />
              </div>
            }
            scrollableTarget={"coins-list"}
          >
            {coinsList.map((coinItem) => (
              <Link to={`/coins/${coinItem.id}`}>
                <Card
                  key={coinItem.id}
                  image={coinItem.image}
                  title={coinItem.name}
                  subtitle={coinItem.symbol}
                  currentPrice={`${roundNumber(coinItem.current_price)}`}
                  priceChangePercentage={`${roundNumber(
                    coinItem.price_change_percentage_24h
                  )}%`}
                />
              </Link>
            ))}
          </InfiniteScroll>
        </div>
      ) : (
        <div className={"fullfilled-container flex-align-center"}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ListCoinsPage;
