import { FC, ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode;
}

const Container: FC<ContainerProps> = (props) => {
  return <div className="md:mx-auto md:container">{props.children}</div>;
};

export default Container;
