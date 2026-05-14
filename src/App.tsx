import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import ToastContainer from "./components/ToastContainer";
import CorbanPanel from "./pages/CorbanPanel";

function App() {
  return (
    <div className="bg-custom-lightgray min-h-screen">
      <Header />
      <Routes>
        <Route path="/us-01" element={<CorbanPanel />} />

        <Route path="/" element={<Navigate to="/us-01" replace />} />

        <Route path="*" element={<p>Página não encontrada</p>} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
