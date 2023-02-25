import Header from "@/components/common/header";
import { ReactNode } from "react";

interface MainProps {
  header?: boolean;
  footer?: boolean;
  children?: ReactNode;
}

const Main = (props: MainProps): JSX.Element => {
  return (
    <main className="min-h-screen font-sans font-normal tracking-tight bg-gray-100">
      {props.children}
    </main>
  );
};

export default Main;
