import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INavListItem, NavItem } from "./NavItem";
import { ArrowLeftOnRectangleIcon, Bars3Icon, UserPlusIcon, RectangleGroupIcon, ArrowUpOnSquareStackIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import MobileNav from './MobileNav'
import UmeedLogo from "../../assets/umeed-psych-logo.png";



export default function Nav() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();

  const navListItems: INavListItem[] = [
    {
      label: "Dashboard",
      link: "/admin",
      icon: <RectangleGroupIcon className="h-6 w-6"/>,
    },
    {
      label: "Create Post",
      link: "/admin/post",
      icon: <ArrowUpOnSquareStackIcon className="h-6 w-6"/>,
    },
    // {
    //   label: "Create Admin",
    //   link: "/admin/create",
    //   icon: <UserPlusIcon className="h-6 w-6"/>,
    // },
    {
      label: "User Mode",
      link: "/",
      icon: <UserCircleIcon className="h-6 w-6"/>,
    },
    {
      label: "Sign out",
      link: "/signout",
      icon: <ArrowLeftOnRectangleIcon className="h-6 w-6"/>,
    }
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
          <img src={UmeedLogo} className="w-20 h-10 rounded-lg object-cover"/>
        </div>
        <div className="hidden md:flex">
          {navListItems.map((item) => {
            return <NavItem key={item.label} navListItem={item} styles="mx-4 " displayLabel/>;
          })}
        </div>
        <MobileMenuButton/>
      </nav>
      {open && <MobileNav navListItems={navListItems} close={() => setOpen(false)}/>}
    </>
  );
}