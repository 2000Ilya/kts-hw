import classnames from "classnames";

import "./Button.scss";
import { Loader, LoaderSize } from "../Loader";

export enum ButtonColor {
  primary = "primary",
  secondary = "secondary",
}

export type ButtonProps = React.PropsWithChildren<{
  loading?: boolean;
  color?: ButtonColor;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  color = ButtonColor.primary,
  loading,
  children,
  ...restProps
}: ButtonProps) => {
  return (
    <button
      {...restProps}
      className={classnames(
        "button",
        { [`button_color-${color}`]: !!color },
        (loading || restProps.disabled) && "button_disabled"
      )}
      disabled={loading || restProps.disabled}
    >
      {children}
      {loading && <Loader loading size={LoaderSize.s} />}
    </button>
  );
};
