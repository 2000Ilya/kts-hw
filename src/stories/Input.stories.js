import { useState } from "react";

import Input from "../components/Input";

export default {
  title: "Input",
  component: Input,
};

export const DefaultInput = () => {
  const [inputValue, setInputValue] = useState("");

  return <Input value={inputValue} onChange={setInputValue} />;
};
