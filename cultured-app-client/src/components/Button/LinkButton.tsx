import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  styles?: string
}

const LinkButton = ({children, onClick, styles} : Props) => {
  return ( 
    <div 
      className={`cursor-pointer text-right whitespace-nowrap text-gray-600 font-cormorant hover:underline hover:font-bold duration-100 ${styles}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
 
export default LinkButton;