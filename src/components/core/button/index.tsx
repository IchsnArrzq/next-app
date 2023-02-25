import clsx from "clsx";
import { FC, ReactNode, forwardRef } from "react";
import { IconAt } from "@tabler/icons-react";
interface ButtonProps {
  children?: ReactNode;
  type?: "submit" | "button" | "reset";
  className?: string;
  id?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export type Ref = HTMLButtonElement;

const Button = forwardRef<Ref, ButtonProps>(function (props, ref): JSX.Element {
  const { children, type, className, ...otherProps } = props;
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={clsx(
        `bg-purple-400 text-white ${
          props.icon ? "flex justify-between items-center" : ""
        } rounded-lg focus:ring-2 focus:ring-purple-500 transition-all hover:bg-purple-600 focus:bg-purple-700`,
        className
      )}
      {...otherProps}
    >
      <div className="px-8 py-2">{children}</div>
      {props.icon ? props.icon : null}
    </button>
  );
});

Button.displayName = "MyComponent";

export default Button;
