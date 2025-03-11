import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div className="space-y-3">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-amber-400">Samannachan Cafe</h3>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            ร้านสมานฉันท์ คาเฟ่ 🙌🏻 หลังม.ขอนแก่น
                        </p>
                        <div className="flex space-x-4 pt-3">
                            <a href="https://www.facebook.com/samannachan.cafe" target="_blank" rel="noopener noreferrer">
                                <FaFacebook className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 hover:text-blue-300 cursor-pointer transition-colors" />
                            </a>
                            <a href="https://x.com/samannachan" target="_blank" rel="noopener noreferrer">
                                <FaTwitter className="h-5 w-5 sm:h-6 sm:w-6 text-sky-400 hover:text-sky-300 cursor-pointer transition-colors" />
                            </a>
                            <a href="https://www.instagram.com/samannachan.cafe/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="h-5 w-5 sm:h-6 sm:w-6 text-pink-400 hover:text-pink-300 cursor-pointer transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-amber-400">Contact Us</h3>
                        <ul className="space-y-3 text-sm sm:text-base text-gray-300">
                            <li className="flex items-start space-x-3">
                                <MdLocationOn className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400 flex-shrink-0 mt-1" />
                                <span>741 , Moo 12 , Sila Khon Kaen District, Thailand, Khon Kaen 40000</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs sm:text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Café Management. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
