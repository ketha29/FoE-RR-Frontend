import { Menu, MenuItems, MenuItem, MenuButton, Disclosure, DisclosureButton} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'
import user from '../assets/user.jpg'

const navigation = [
  { name: 'Home', href: '/home' },
  { name: 'Booking', href: '/booking/all' },
  { name: 'Users', href: '/fds' },
  { name: 'Rooms', href: '/room/all' },
]

const NavBar = () => {

  return (
    <Disclosure as="nav" className="bg-slate-700">
      <div className='mx-auto max-w-7xl px-2 sm:px-6'>
        <div className="relative flex h-14 items-center justify-between mb-5">
          <div className='absolute insert-y-0 left-0 flex items-center sm-hidden'>
            {/* Mobile menu button*/}
            <DisclosureButton className="md:hidden group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <Bars3Icon className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <div className="flex items-center ">
              <img
                alt="FoE RR"
                src={logo}
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="hidden md:flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      'block rounded-md px-3 py-2 text-base font-medium ' +
                      (isActive
                        ? 'bg-white text-slate-700'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white')
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt="user"
                    src={user}
                    className="h-8 w-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Disclosure.Panel className="md:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                'block rounded-md px-3 py-2 text-base font-medium ' +
                (isActive
                  ? 'bg-white text-slate-700'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white')
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </Disclosure.Panel>
    </Disclosure>
  )    
}

export default NavBar;