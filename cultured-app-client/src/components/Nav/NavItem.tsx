import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export interface INavListItem {
  label: string;
  link: string;
  icon: JSX.Element;
}

export const MobileNavItem = ({
  navListItem,
  styles,
}: {
  navListItem: INavListItem;
  styles?: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation().pathname;

  return (
    <div
      onClick={() => {
        navigate(navListItem.link);
      }}
      className={`text-md cursor-pointer hover:text-umeed-beige ${styles} flex align-center gap-2 ${
        location == navListItem.link ? "text-umeed-beige" : "text-gray-500"
      }`}
    >
      {navListItem.icon}
      {navListItem.label}
    </div>
  );
};

export const NavItem = ({
  navListItem,
  styles,
  displayLabel,
}: {
  navListItem: INavListItem;
  styles?: string;
  displayLabel?: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation().pathname;

  return (
    <div
      onClick={() => navigate(navListItem.link)}
      className={`text-md cursor-pointer hover:text-umeed-beige ${styles} flex align-center gap-1 ${
        location == navListItem.link ? "text-umeed-beige" : "text-gray-500"
      }`}
    >
      {navListItem.icon}
      {displayLabel && navListItem.label}
    </div>
  );
};
