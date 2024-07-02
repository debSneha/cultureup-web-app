import { ReactNode } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  styles?: string;
}

const Button = ({ children, styles, ...rest }: Props) => {
  return (
    <button
      className={`font-cormorant rounded-none p-2 font-medium tracking-wide transition-colors duration-300 focus:outline-none bg-umeed-tangerine-300 text-gray-800 hover:bg-umeed-tangerine-700 hover:text-white ${styles}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
