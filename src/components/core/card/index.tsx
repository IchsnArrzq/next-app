import { ReactNode } from "react";
import Body from "@/components/core/card/body";
import Action from "@/components/core/card/action";
import clsx from "clsx";
interface CardProps {
  children?: ReactNode;
  className?: string;
}

type CardBody = {
  Body: typeof Body;
};
type CardAction = {
  Action: typeof Action;
};

const Card: React.FC<CardProps> & CardBody & CardAction = (props) => {
  return (
    <div
      className={clsx(
        "bg-white border-2 shadow-xl rounded-xl",
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

Card.Body = Body;
Card.Action = Action;

export default Card;
