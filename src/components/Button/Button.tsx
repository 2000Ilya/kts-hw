import classnames from "classnames";

import "./Button.scss";
import { Loader } from "../Loader";

enum ButtonColor {
  primary = "primary",
  secondary = "secondary",
}

type ButtonProps = React.PropsWithChildren<{
  loading?: boolean;
  color?: ButtonColor;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
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
      {loading && <Loader loading />}
    </button>
  );
};

export default Button;
