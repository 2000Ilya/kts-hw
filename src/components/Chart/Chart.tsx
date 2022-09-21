import { ChartDataParsed } from "@store/CoinGeckoStore/types";
import React from "react";

import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from "recharts";

type ChartProps = { data: ChartDataParsed[] };

const Chart = ({ data }: ChartProps) => {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <LineChart data={data}>
        <XAxis dataKey="name" interval={"preserveEnd"} />
        <YAxis
          domain={["dataMin", "dataMax"]}
          // style={{ display: "none" }}
          hide={true}
          padding={{ top: 35, bottom: 38 }}
        />
        <Tooltip cursor={false} />
        <Line
          type={"linear"}
          dataKey={"price"}
          stroke={"#0063F5"}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
