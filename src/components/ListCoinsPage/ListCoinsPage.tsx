import React, { useEffect, useState } from "react";

import "./ListCoinsPage.scss";
import Button from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Loader } from "@components/Loader";
import { CoinItem } from "@store/CoinGeckoStore/types";
import coinGeckoStore from "@store/coinGeckoStoreInstance";
import roundNumber from "@utils/roundNumber";
import { Link } from "react-router-dom";

const ListCoinsPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [coinsList, setCoinsList] = useState<CoinItem[]>([]);

  useEffect(() => {
    const fetchCoinsData = async () => {
      const result = await coinGeckoStore.getCoinsList({
        queryParameters: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      });
      setCoinsList(result.success ? result.data : []);
      // eslint-disable-next-line no-console
      console.log(result.success ? result.data : []);
    };
    fetchCoinsData();

    return () => {
      setCoinsList([]);
    };
  }, []);

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
        <div className={"coins-list"}>
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
