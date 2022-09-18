import React from "react";

import classNames from "classnames";

import styles from "./Loader.module.scss";

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

export const Loader: React.FC<LoaderProps> = React.memo(
  ({ size = LoaderSize.m, className, loading = true }: LoaderProps) =>
    loading ? (
      <div
        className={classNames(
          styles.loader,
          className && styles[className],
          size === LoaderSize.l && styles["loader_size-l"],
          size === LoaderSize.m && styles["loader_size-m"],
          size === LoaderSize.s && styles["loader_size-s"]
        )}
      />
    ) : null
);
