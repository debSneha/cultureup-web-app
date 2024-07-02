import { useState } from "react";

interface IModalItem {
  icon: JSX.Element;
  title: string;
  body: JSX.Element;
  action: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
}

export const Modal = ({
  icon,
  title,
  body,
  action,
  onClick,
  label,
}: IModalItem) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick(e);
    setShowModal(false);
  };
  return (
    <>
      <button onClick={() => setShowModal(true)}>{icon}</button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex justify-center p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-cormorant font-bold">{title}</h3>
                </div>

                <div className="relative p-6 flex-auto text-center">
                  <div className="my-4 text-gray-500 text-lg leading-relaxed">
                    {body}
                  </div>
                </div>

                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  {action && (
                    <button
                      className="bg-umeed-tangerine-300 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg hover:shadow-gray-400 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleClick}
                    >
                      {action}
                    </button>
                  )}

                  <button
                    className="bg-umeed-blue text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg hover:shadow-gray-400 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
