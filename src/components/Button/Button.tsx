import React from "react";

import classnames from "classnames";

import { Loader, LoaderSize } from "../Loader";
import styles from "./Button.module.scss";

export enum ButtonColor {
  primary = "primary",
  secondary = "secondary",
}

export type ButtonProps = React.PropsWithChildren<{
  loading?: boolean;
  color?: ButtonColor;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.memo(
  ({
    color = ButtonColor.primary,
    loading,
    children,
    ...restProps
  }: ButtonProps) => {
    return (
      <button
        {...restProps}
        className={classnames(
          styles.button,
          Boolean(color) && styles[`button_color-${color}`],
          (loading || restProps.disabled) && styles.button_disabled
        )}
        disabled={loading || restProps.disabled}
      >
        {children}
        {loading && <Loader loading size={LoaderSize.s} />}
      </button>
    );
  }
);
