import classNames from "classnames";

import "./Input.scss";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};

const Input = ({ value, onChange, ...restProps }: InputProps) => {
  return (
    <input
      {...restProps}
      className={classNames("input", {
        ["input_disabled"]: restProps.disabled,
      })}
      type={"text"}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    ></input>
  );
};

export default Input;
