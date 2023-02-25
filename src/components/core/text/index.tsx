import { FC, ReactNode } from "react";

interface TextProps {
  children?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "";
  color?: string;
  font?: string;
}

const Text: FC<TextProps> = (props): JSX.Element => {
  return (
    <span
      className={`text-${props.size ?? "md"} ${props.color ?? "text-black"} ${
        props.font ?? ""
      } align-middle`}
    >
      {props.children}
    </span>
  );
};

export default Text;
