'use client'
import { Menu } from 'lucide-react';
import { CircleUser } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Usericon from './usericon';
import { Item } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { links } from '../../../../utils/link';




const Dropdownlist = () => {
  const logout = async () => {
    document.cookie = 'id=; Max-Age=0; path=/;';

    window.location.href = '/login';
  }
  return (
  <DropdownMenu>
  <DropdownMenuTrigger asChild>
  <button  variant ="outline "className="flex items-center justify-center rounded-full gap-4 p-2">
  <Usericon />
  <Menu />
  </button>
  
  </DropdownMenuTrigger >
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {
      links.map((item,index) => {
        return (<DropdownMenuItem key={index}>
          <Link href={item.href}>{item.label}</Link>
        </DropdownMenuItem>)
      })}
      <DropdownMenuSeparator/>
      <DropdownMenuItem key="logout" className="font-medium text-red-500">
        <button onClick={() => logout()}>Logout</button>
      </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default Dropdownlist;

