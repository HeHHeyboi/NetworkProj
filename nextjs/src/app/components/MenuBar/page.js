import Link from "next/link";
import { MenuSquare, Image, Gift } from "lucide-react";
import { Coffee } from 'lucide-react';

const MenuItem = ({ Icon, label, href }) => {
    return (
        <Link href={href} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 flex items-center justify-center bg-[#233f87] rounded-lg transition hover:bg-[#1e3573]">
                <Icon className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-800">{label}</p>
        </Link>
    );
};

const Menu = () => {
    const items = [
        { Icon: Coffee, label: "Menu", href: "/menu" },
        { Icon: Image, label: "Gallery", href: "/GalleryShow" },
        { Icon: Gift, label: "GiveAway", href: "/GiveAwayShow" },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-8 p-4 bg-white shadow-lg rounded-lg">
            {items.map((item, index) => (
                <MenuItem key={index} {...item} />
            ))}
        </div>
    );
};

export default Menu;
