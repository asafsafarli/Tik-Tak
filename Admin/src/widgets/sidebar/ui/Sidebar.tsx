import { NavLink } from 'react-router-dom'
import { LogoutButton } from '@/features/auth/logout'
import { navItems } from '../model/nav-items'

export function Sidebar() {
  return (
    <aside className="w-full shrink-0 rounded-[10px] bg-white p-1.5 shadow-sm lg:w-[220px] lg:p-3 2xl:w-[250px]">
      <nav className="grid grid-cols-3 gap-1 sm:grid-cols-6 lg:flex lg:flex-col">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex items-center justify-center gap-1.5 rounded-[8px] px-1 py-2 text-[13px] leading-[100%] font-normal transition-colors sm:gap-2 lg:justify-start lg:px-3 lg:py-2.5 lg:text-[15px] ${
                isActive
                  ? 'bg-[#EEF8E8] font-medium text-[#4FA83A]'
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950'
              }`
            }
          >
            <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
            <span className="max-w-full truncate">{label}</span>
          </NavLink>
        ))}
        <LogoutButton />
      </nav>
    </aside>
  )
}
