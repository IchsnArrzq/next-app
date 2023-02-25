import { ReactNode } from "react";

interface HeaderProps {
  children?: ReactNode;
}

const Header = (props: HeaderProps): JSX.Element => {
  return (
    <header className="px-8 py-6 bg-cyan-800">
      <div>oke</div>
    </header>
  );
};

export default Header;
