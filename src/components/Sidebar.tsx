"use client"

import Link from 'next/link'

const links = ['/', '/view-debts',] as const

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-100 p-4 shadow-md">
      <nav>
        <ul className="space-y-4">
          {links.map((path) => (
            <li key={path}>
              <Link href={path} className="text-gray-800 hover:text-blue-600 font-medium">
                {getLabelFromPath(path)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function getLabelFromPath(path: string) {
  if (path === '/') return 'Home';

  return path
    .slice(1)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}