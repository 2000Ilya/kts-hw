import React from "react";

import { Loader } from "../Loader";

type WithLoaderProps = React.PropsWithChildren<{
  loading: boolean;
}>;

const WithLoader = ({ loading, children }: WithLoaderProps) => {
  return (
    <div>
      {children}
      {loading && <Loader loading />}
    </div>
  );
};

export default React.memo(WithLoader);
