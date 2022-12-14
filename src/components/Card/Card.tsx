import React from "react";

import classNames from "classnames";

import styles from "./Card.module.scss";

type CardProps = {
  image: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  currentPrice: string | null;
  priceChangePercentage: string | null;
  isValueGrowing: boolean | null;
  content?: React.ReactNode;
  onClick?: React.MouseEventHandler;
};

const Card = ({
  image,
  title,
  subtitle,
  currentPrice,
  priceChangePercentage,
  content,
  onClick,
  isValueGrowing,
}: CardProps) => {
  return (
    <div className={classNames(styles.card)} onClick={onClick}>
      <div className={classNames(styles["card__left-container"])}>
        <img className={classNames(styles.card__logo)} src={image} />
        <div className={classNames(styles["card__currency-name-container"])}>
          <h1 className={classNames(styles["card-header"])}>{title}</h1>
          <h3 className={classNames(styles["card__currency-short-name"])}>
            {subtitle}
          </h3>
        </div>
      </div>
      {content}
      {currentPrice !== null &&
        priceChangePercentage !== null &&
        isValueGrowing !== null && (
          <div className={classNames(styles["card__value-container"])}>
            <h1
              className={classNames(
                styles["card-header"],
                styles.card__value,
                isValueGrowing
                  ? styles["card__value-growing"]
                  : styles["card__value-dropping"]
              )}
            >
              {currentPrice}
            </h1>
            <h4
              className={classNames(
                styles["card__value-diff"],
                isValueGrowing
                  ? styles["card__value-growing"]
                  : styles["card__value-dropping"]
              )}
            >
              {priceChangePercentage}
            </h4>
          </div>
        )}
    </div>
  );
};

export default React.memo(Card);
