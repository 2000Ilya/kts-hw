import "./Card.scss";

type CardProps = {
  image: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  currentPrice: string;
  priceChangePercentage: string;
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
}: CardProps) => {
  return (
    <div className={"card"} onClick={onClick}>
      <div className={"card__left-container"}>
        <img className={"card__logo"} src={image} />
        <div className={"card__currency-name-container"}>
          <h1 className={"card-header card__currency-name"}>{title}</h1>
          <h3 className={"card__currency-short-name"}>{subtitle}</h3>
        </div>
      </div>
      {content}
      <div className={"card__value-container"}>
        <h1 className={"card-header card__value"}>{"$" + currentPrice}</h1>
        <h4 className={"card__value-diff"}>{priceChangePercentage}</h4>
      </div>
    </div>
  );
};

export default Card;
