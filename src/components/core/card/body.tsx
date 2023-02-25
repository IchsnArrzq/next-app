import { FC, ReactNode } from "react";
import clsx from "clsx";
interface BodyProps {
  children: ReactNode;
  className?: string;
}

const Body: FC<BodyProps> = (props) => {
  return <div className={clsx("p-6", props.className)}>{props.children}</div>;
};

export default Body;
