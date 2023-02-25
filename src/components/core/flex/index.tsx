import { FC, ReactNode } from "react";
import clsx from "clsx";
interface FlexProps {
  children?: ReactNode;
  direction?: "flex-col" | "flex-row" | "";
  justify?:
    | "justify-evenly"
    | "justify-start"
    | "justify-end"
    | "justify-center"
    | "justify-between"
    | "justify-around"
    | "";
  gap?: string;
  items?:
    | "items-start"
    | "items-end"
    | "items-center"
    | "items-baseline"
    | "items-stretch"
    | "";
  className?: string;
}

const Flex: FC<FlexProps> = (props) => {
  return (
    <div
      className={clsx(
        `flex ${props.direction ?? "flex-row"} ${
          props.justify ?? "justify-start"
        } ${props.gap ?? "gap-4"} ${props.items ?? "items-start"}`,
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

export default Flex;
