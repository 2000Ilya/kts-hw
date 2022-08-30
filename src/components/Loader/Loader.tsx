import classNames from "classnames";

import "./Loader.scss";

export enum LoaderSize {
  s = "s",
  m = "m",
  l = "l",
}

type LoaderProps = {
  loading?: boolean;
  size?: LoaderSize;
  className?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  size = LoaderSize.m,
  className = "",
  loading = true,
}: LoaderProps) =>
  loading ? (
    <div
      className={classNames("loader", !!className && className, {
        ["loader_size-l"]: size === LoaderSize.l,
        ["loader_size-m"]: size === LoaderSize.m,
        ["loader_size-s"]: size === LoaderSize.s,
      })}
    />
  ) : null;
