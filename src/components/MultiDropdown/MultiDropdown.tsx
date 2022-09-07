import React, { useState } from "react";

import ArrowDownIcon from "@components/ArrowDownIcon";
import ArrowUpIcon from "@components/ArrowUpIcon";
import classNames from "classnames";

import styles from "./MultiDropdown.module.scss";

export type Option = {
  key: string;
  value: string;
};

type MultiDropdownProps = {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  pluralizeOptions: (value: Option[]) => string;
};

export const MultiDropdown = React.memo(
  ({
    options,
    value,
    onChange,
    disabled,
    pluralizeOptions,
  }: MultiDropdownProps) => {
    const [isOptionsShowing, setOptionsShowing] = useState(false);

    const getIndexOfOption = (value: Option[], option: Option) => {
      if (value !== undefined) {
        for (let i = 0; i < value.length; i++) {
          if (value[i].key === option.key) {
            return i;
          }
        }
      }
      return -1;
    };

    const toggleOptionsShowing = () => {
      setOptionsShowing((isOptionsShowing) => !isOptionsShowing);
    };

    const handleOptionClick = (selectedField: Option) => {
      const indexOfOption = getIndexOfOption(value, selectedField);
      if (indexOfOption !== -1) {
        onChange(
          value.filter(
            (val) =>
              val.key !== selectedField.key && val.value !== selectedField.value
          )
        );
      } else {
        onChange(value.concat([selectedField]));
      }
    };

    return (
      <div className={classNames(styles["multi-dropdown"])}>
        <div
          className={classNames(
            styles["multi-dropdown__selected-option"],
            styles["flex-align-center"],
            isOptionsShowing &&
              styles["multi-dropdown__selected-option__showing"]
          )}
          onClick={toggleOptionsShowing}
        >
          <span>{pluralizeOptions(value)}</span>
          {isOptionsShowing ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </div>
        {!disabled && isOptionsShowing && (
          <div className={classNames(styles["multi-dropdown__options"])}>
            {options.map((option) => (
              <div
                className={classNames(
                  styles["multi-dropdown__option"],
                  styles["flex-align-middle"]
                )}
                onClick={() => handleOptionClick(option)}
                key={option.key}
              >
                {option.value}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
