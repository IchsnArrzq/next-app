import React from "react";

import Col from "@/components/core/grid/col";

export type CommonPropsType = {
  children: React.ReactNode;
  columns: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "none";
};

type GridSubComponents = {
  Col: typeof Col;
};

const Grid: React.FunctionComponent<CommonPropsType> & GridSubComponents = (
  props: CommonPropsType
) => {
  return (
    <div className={`grid md:grid-cols-${props.columns} grid-cols-1 gap-4 `}>
      {props.children}
    </div>
  );
};

Grid.Col = Col;

export default Grid;
