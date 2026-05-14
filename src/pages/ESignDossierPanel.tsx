export default function ESignDossierPanel() {
  return (
    <main
      className="flex-1 max-w-6xl lg:max-w-[60%] xl:max-w-[70%] mx-auto sm:mx-5 p-2"
      aria-labelledby="dossier-heading"
    >
      <h1
        id="dossier-heading"
        className="leading-6 text-2xl pt-0 sm:pt-2 pl-1 font-bold mb-4 font-mono uppercase text-brand-blue-dark"
      >
        Painel de Validação de Dossiê
      </h1>
      <p className="text-lg text-brand-blue-dark">Dados do Assinante:</p>
    </main>
  );
}
