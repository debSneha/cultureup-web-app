import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { INavListItem } from "./NavItem";
import { MobileNavItem } from "./NavItem";

const MobileNav = ({navListItems, close}: {navListItems: INavListItem[],close: () => void}) => {
  const [anim, setAnim] = useState(false);

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      close()
    }
  }

  useEffect(() => {
    setAnim(true)
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div className="z-10 fixed">
      <div className="fixed inset-0 h-screen w-full backdrop-blur-sm bg-gray-500 bg-opacity-50" />
      <div className="fixed inset-0 p-5">
        <div
          className={`w-full bg-white rounded-xl p-5 transition-all  ${
            anim ? "scale-100" : "scale-90"
          }`}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-md text-gray-700">Navigation</h1>
            <XMarkIcon
              onClick={close}
              className="hover:scale-110 w-7 h-7 transition-all text-gray-500"
            />
          </div>
          <div className="mt-5 divide-y">
            {navListItems.map((item) => {
              return <MobileNavItem key={item.label} navListItem={item} styles="py-1"/>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;