import { Link } from "react-router-dom";

import logoCondensed from "../assets/neocredito-logotipo-azul-condensed.svg";
import logo from "../assets/neocredito-logotipo-azul.svg";

export default function Header() {
  return (
    <header className="bg-brand-gray border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl sm:mx-6 px-4 py-6 flex items-center">
        <Link to="/us-01" className="flex items-center gap-2 no-underline">
          <img
            src={logo}
            alt="Neo Crédito"
            className="h-8 w-auto hidden sm:flex"
          />
          <img
            src={logoCondensed}
            alt="Neo Crédito"
            className="h-12 w-auto flex sm:hidden"
          />
        </Link>
      </div>
    </header>
  );
}
