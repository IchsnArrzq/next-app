import { FC, ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "red" | "blue" | "green" | "purple";
}

const Badge: FC<BadgeProps> = (props) => {
  return (
    <span
      className={`py-1 px-4 rounded-lg ring-2 bg-purple-100 ring-purple-200`}
    >
      {props.children}
    </span>
  );
};

export default Badge;
