import { NavLink } from 'react-router-dom'
import { LogoutButton } from '@/features/auth/logout'
import { navItems } from '../model/nav-items'

export function Sidebar() {
  return (
    <aside className="w-full shrink-0 rounded-[10px] bg-white px-4 py-2 shadow-sm lg:min-h-[482px] lg:w-[280px] lg:px-8 lg:pt-[42px] lg:pb-[88px] 2xl:w-[390px]">
      <nav className="flex gap-6 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `shrink-0 whitespace-nowrap py-3 text-[16px] leading-[100%] font-normal tracking-normal transition-colors lg:border-b lg:border-neutral-100 lg:pb-[27px] lg:text-[20px] ${
                index === 0 ? 'lg:pt-0' : 'lg:pt-[27px]'
              } ${isActive ? 'text-[#6FCF54]' : 'text-neutral-800 hover:text-neutral-950'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
        <LogoutButton />
      </nav>
    </aside>
  )
}
