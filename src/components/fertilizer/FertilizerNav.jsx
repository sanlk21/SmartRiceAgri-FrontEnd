// src/components/fertilizer/FertilizerNav.jsx
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const FertilizerNav = () => {
  const location = useLocation();
  const baseUrl = location.pathname.split('/')[1]; // 'admin' or 'farmer'

  const links = [
    { href: `/${baseUrl}/fertilizer/dashboard`, label: 'Dashboard' },
    { href: `/${baseUrl}/fertilizer/allocations`, label: 'Allocations' }
  ];

  return (
    <nav className="border-b mb-6">
      <div className="flex space-x-6">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            to={href}
            className={cn(
              'py-3 border-b-2 -mb-[2px]',
              location.pathname === href
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default FertilizerNav;