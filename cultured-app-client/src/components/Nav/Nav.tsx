import { useState } from "react";
import { INavListItem, NavItem } from "./NavItem";
import { UserCircleIcon, ArrowLeftOnRectangleIcon, Bars3Icon, Squares2X2Icon, HomeIcon, ArrowUpOnSquareStackIcon } from "@heroicons/react/24/outline";
import MobileNav from './MobileNav'
import UmeedLogo from "../../assets/umeed-psych-logo.png";

export default function Nav() {
  const [open, setOpen] = useState(false);

  const navListItems: INavListItem[] = [
    {
      label: "Dashboard",
      link: "/",
      icon: <HomeIcon className="h-6 w-6"/>,
    },
    {
      label: "Create Post",
      link: "/create-post",
      icon: <ArrowUpOnSquareStackIcon className="h-6 w-6"/>,
    },
    {
      label: "Profile",
      link: "/profile",
      icon: <UserCircleIcon className="h-6 w-6"/>,
    },
    {
      label: "Sign out",
      link: "/signout",
      icon: <ArrowLeftOnRectangleIcon className="h-6 w-6"/>,
    },
  ];

  const MobileMenuButton = () => (
    <div
      className="flex justify-end md:hidden cursor-pointer"
      onClick={() => setOpen(true)}
    >
      <Bars3Icon
        className="hover:scale-110 w-7 h-7 transition-all text-gray-500"
      />
    </div>
  )

  return (
    <>
      <nav className="p-4 px-8 w-full flex justify-between items-center gap-5">
        <div className="md:flex">
          <img src={UmeedLogo} className="w-12 h-12 rounded-lg object-cover"/>
        </div>
        <div className="hidden md:flex">
          {navListItems.map((item) => {
            return <NavItem key={item.label} navListItem={item} styles="mx-2"/>;
          })}
        </div>
        <MobileMenuButton/>
      </nav>
      {open && <MobileNav navListItems={navListItems} close={() => setOpen(false)}/>}
    </>
  );
}
