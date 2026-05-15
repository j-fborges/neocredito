import { messages } from "../../i18n/pt-BR";

interface ActionButtonsProps {
  onApproveClick: () => void;
  onDisapproveClick: () => void;
  disabled: boolean;
  sticky?: boolean;
}

export default function ActionButtons({
  onApproveClick,
  onDisapproveClick,
  disabled,
  sticky = true,
}: ActionButtonsProps) {
  const { decision: translations } = messages.dossier;

  return (
    <div
      className={`px-2 w-full ${
        sticky
          ? "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:px-1 max-md:right-0 max-md:bg-white max-md:p-4 max-md:py-2  max-md:border-t-2 max-md:border-brand-blue-dark max-md:z-40"
          : ""
      }`}
    >
      <div className="w-full flex flex-row justify-center mb-2">
        <span className="font-mono font-bold uppercase text-center max-md:text-xs w-fit text-brand-blue-dark">
          {translations.question}
        </span>
      </div>
      <div className={`flex gap-2 lg:gap-4 w-full lg:justify-start flex-row`}>
        <button
          onClick={onApproveClick}
          disabled={disabled}
          className="py-2 leading-4 border-2 shadow-md shadow-custom-shadow border-brand-blue-dark bg-green-800 text-xs xs:text-sm text-white hover:text-brand-blue-dark rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 font-mono font-bold uppercase"
        >
          {translations.approve}
          <br />
          <u>{translations.approveDetail}</u>
        </button>
        <button
          onClick={onDisapproveClick}
          disabled={disabled}
          className="py-2 leading-4 border-2 shadow-md shadow-custom-shadow border-brand-blue-dark bg-red-700 text-xs xs:text-sm text-white hover:text-brand-blue-dark rounded-lg hover:bg-[#ff3030] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 font-mono font-bold uppercase"
        >
          {translations.disapprove}
          <br />
          <u>{translations.disapproveDetail}</u>
        </button>
      </div>
      <hr className="border-brand-blue-dark/20 mb-4 mt-4 max-md:hidden" />
    </div>
  );
}
