import React from "react";

type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  onChange: (value: boolean) => void;
};

const CheckBox = ({ onChange, ...restProps }: CheckBoxProps) => {
  return (
    <input
      {...restProps}
      className={"checkbox"}
      checked={restProps.checked}
      onChange={(event) => onChange(event.target.checked)}
      type={"checkbox"}
    />
  );
};

export default React.memo(CheckBox);
