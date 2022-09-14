import React, { useCallback, useState } from "react";

import ArrowDownIcon from "components/ArrowDownIcon";
import ArrowUpIcon from "components/ArrowUpIcon";
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

    const getIndexOfOption = useCallback(
      (option: Option, index: number) => {
        if (option !== undefined) {
          return value[index].key === option.key;
        }
        return false;
      },
      [value]
    );

    const toggleOptionsShowing = useCallback(() => {
      setOptionsShowing((isOptionsShowing) => !isOptionsShowing);
    }, [isOptionsShowing]);

    const handleOptionClick = useCallback(
      (selectedField: Option) => {
        const indexOfOption = value.findIndex(getIndexOfOption);
        if (indexOfOption !== -1) {
          onChange(
            value.filter(
              (val) =>
                val.key !== selectedField.key &&
                val.value !== selectedField.value
            )
          );
        } else {
          onChange(value.concat([selectedField]));
        }
      },
      [value]
    );

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
