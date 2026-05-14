import { Link, useLocation } from "react-router-dom";

import logoCondensed from "../assets/neocredito-logotipo-azul-condensed.svg";
import logo from "../assets/neocredito-logotipo-azul.svg";
import seta from "../assets/neocredito-seta.svg";

export default function Header() {
  const location = useLocation();
  const isOnUS01 = location.pathname.startsWith("/us-01");

  return (
    <header className="bg-custom-gray border-b border-gray-300 shadow-sm shadow-custom-shadow w-full">
      <div className="sm:mx-6 px-4 py-6 flex items-center justify-between w-full">
        <Link to="/us-01" className="flex items-center gap-2 no-underline">
          <img
            src={logo}
            alt="Neo Crédito"
            className="h-8 w-auto hidden sm:flex"
          />
          <img
            src={logoCondensed}
            alt="Neo Crédito"
            className="h-12 w-auto flex sm:hidden pr-2"
          />
        </Link>

        <Link
          to={isOnUS01 ? "/us-02/101" : "/us-01"}
          className="ml-2 sm:ml-0 mr-0 md:mr-14 px-1  sm:px-4 py-2 rounded bg-gray-400 text-white hover:bg-opacity-90 text-sm font-medium transition-colors hover:text-brand-blue-dark flex flex-row items-center gap-2 text-center leading-4 h-auto"
        >
          {isOnUS01 ? "Dossiê Validação (US-02)" : "Painel CORBAN (US-01)"}
          <img
            src={seta}
            alt="Seta navegação"
            className="h-4 w-auto hidden sm:flex"
          />
        </Link>
      </div>
    </header>
  );
}
