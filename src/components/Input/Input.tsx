import React from "react";

import classNames from "classnames";

import styles from "./Input.module.scss";

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
      className={classNames(
        styles.input,
        restProps.disabled && styles["input_disabled"]
      )}
      type={"text"}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    ></input>
  );
};

export default React.memo(Input);
