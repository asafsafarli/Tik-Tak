import { Folder, Megaphone, Package, ShoppingBag, Users, type LucideIcon } from 'lucide-react'

export const navItems: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/orders', label: 'Sifarişlər', icon: ShoppingBag },
  { to: '/campaigns', label: 'Kampaniyalar', icon: Megaphone },
  { to: '/categories', label: 'Kateqoriyalar', icon: Folder },
  { to: '/products', label: 'Məhsullar', icon: Package },
  { to: '/users', label: 'İstifadəçilər', icon: Users },
]
