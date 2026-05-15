import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import ToastContainer from "./components/ToastContainer";
import { messages } from "./i18n/pt-BR";
import CorbanPanel from "./pages/CorbanPanel";
import ESignDossierPanel from "./pages/ESignDossierPanel";
function App() {
  const { navigation: translations } = messages;
  return (
    <div className="bg-custom-lightgray min-h-screen">
      <Header />
      <Routes>
        <Route path="/us-01" element={<CorbanPanel />} />
        <Route path="/us-02/:id" element={<ESignDossierPanel />} />
        <Route path="/" element={<Navigate to="/us-01" replace />} />
        <Route path="*" element={<p>{translations.notFound}</p>} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
