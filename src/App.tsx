import React from "react";

import CoinInfoPage from "@components/CoinInfoPage/CoinInfoPage";
import ListCoinsPage from "@components/ListCoinsPage/ListCoinsPage";
import { useQueryParamsStoreInit } from "@store/RootStore/hooks/useQueryParamsStoreInit";
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  useQueryParamsStoreInit();

  return (
    <Routes>
      <Route path={"/kts-hw/coins"} element={<ListCoinsPage />} />
      <Route path={"/kts-hw/coins/:id"} element={<CoinInfoPage />} />
      <Route path="*" element={<Navigate replace to="/kts-hw/coins" />} />
    </Routes>
  );
};

export default App;
