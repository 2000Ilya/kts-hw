import React, { useState } from "react";

import { Button } from "components/Button";
import Card from "components/Card";
import Input from "components/Input";
import { Loader, LoaderSize } from "components/Loader";
import { MultiDropdown, Option } from "components/MultiDropdown";

type UIKitProps = {};

export const UIKit: React.FC<UIKitProps> = (props: UIKitProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [dropdownValue, setDropdownValue] = useState<Option[]>([]);
  const options: Option[] = [
    { key: "INR", value: "Market- INR" },
    { key: "RUB", value: "Market- RUB" },
    { key: "USD", value: "Market- USD" },
    { key: "TRY", value: "Market- TRY" },
  ];

  const pluralizeOptions = (elements: Option[]) =>
    elements.length ? elements.map((el: Option) => el.key).join() : "";

  return (
    <>
      <Loader size={LoaderSize.l} />
      <Loader />
      <Loader size={LoaderSize.s} />

      <Input
        value={inputValue}
        onChange={setInputValue}
        placeholder={"Search Cryptocurrency"}
      />

      <Button>Cancel</Button>

      <MultiDropdown
        options={options}
        value={dropdownValue}
        onChange={(value: Option[]) => {
          setDropdownValue(value);
        }}
        disabled={false}
        pluralizeOptions={pluralizeOptions}
      />
      <Card
        image={"https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC--big.svg"}
        title={"Bitcoin"}
        subtitle={"BTC"}
        currentPrice={"₹2,509.75"}
        priceChangePercentage={"+9.77%"}
      />
    </>
  );
};
