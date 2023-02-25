import { FC, ReactNode } from "react";

interface ColProps {
  children: ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const Col: FC<ColProps> = (props) => {
  return (
    <div className={`${props.span ? `col-span-${props.span ?? 1}` : ""}`}>
      {props.children}
    </div>
  );
};

export default Col;
