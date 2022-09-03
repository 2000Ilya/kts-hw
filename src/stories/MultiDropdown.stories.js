import { useState } from "react";

import { MultiDropdown } from "../components/MultiDropdown";

export default {
  title: "MultiDropdown",
  component: MultiDropdown,
};

export const DefaultMultiDropdown = () => {
  const [dropdownValue, setDropdownValue] = useState([]);
  const options = [
    { key: "INR", value: "Market- INR" },
    { key: "RUB", value: "Market- RUB" },
    { key: "USD", value: "Market- USD" },
    { key: "TRY", value: "Market- TRY" },
  ];

  const pluralizeOptions = (elements) =>
    elements.length ? elements.map((el) => el.key).join() : "";

  return (
    <MultiDropdown
      options={options}
      value={dropdownValue}
      onChange={(value) => {
        setDropdownValue(value);
      }}
      disabled={false}
      pluralizeOptions={pluralizeOptions}
    />
  );
};
