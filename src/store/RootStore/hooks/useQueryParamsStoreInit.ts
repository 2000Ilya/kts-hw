import * as Router from "react-router-dom";

import rootStore from "../instance";

export const useQueryParamsStoreInit = () => {
  const { search } = Router.useLocation();

  rootStore.query.setSearch(search);
};
