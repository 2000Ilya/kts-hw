import CoinInfoPage from "@components/CoinInfoPage/CoinInfoPage";
import ListCoinsPage from "@components/ListCoinsPage/ListCoinsPage";
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path={"/coins"} element={<ListCoinsPage />} />
      <Route path={"/coins/:id"} element={<CoinInfoPage />} />
      <Route path="*" element={<Navigate replace to="/coins" />} />
    </Routes>
  );
};

export default App;
