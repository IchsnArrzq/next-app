import { ReactNode } from "react";
import Main from "@/components/common/main";

interface AppProps {
  children: ReactNode;
}

const App: React.FC<AppProps> = (props): JSX.Element => {
  return <Main header={true}>{props.children}</Main>;
};

export default App;
