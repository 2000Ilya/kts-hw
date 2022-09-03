import { Loader, LoaderSize } from "../components/Loader";

export default {
  title: "Loader",
  component: Loader,
};

export const Small = () => <Loader size={LoaderSize.s} loading />;
export const Medium = () => <Loader size={LoaderSize.m} loading />;
export const Large = () => <Loader size={LoaderSize.l} loading />;
