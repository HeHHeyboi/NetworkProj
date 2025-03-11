import Logo from './Logo'
import Dropdownlist from './dropdownlist'

const Navbar = () => {
  return (
    <nav className="w-full h-23.5  bg-[#F9F3E7] mt-[-10px]"> 
      <div className="container flex justify-between items-center px-4">
        <Logo />
        <div className="flex gap-3 items-center">
          <Dropdownlist />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
