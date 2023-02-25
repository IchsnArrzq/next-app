import { FC, ReactNode } from "react";

interface ActionProps {
  children: ReactNode;
  className?: string;
}

const Action: FC<ActionProps> = (props) => {
  return <div className={props.className}>{props.children}</div>;
};

export default Action;
