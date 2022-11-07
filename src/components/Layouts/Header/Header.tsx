import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Transition } from '@headlessui/react';
import { IconType } from 'react-icons';
import { FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Search } from './Search';
import { TopBar } from './TopBar';
import { MegaMenu } from './MegaMenu';
import { Collections } from 'types';
import { BottomNavigation } from 'components/Layouts/BottomNavigation/BottomNavigation';
const AnnouncementBar = dynamic(() => import('./AnnouncementBar'), {
  ssr: false,
});

interface Props {
  collections: Collections;
}

export interface NavLink {
  name: 'men' | 'women' | 'kids' | 'sale' | 'blog' | 'contacts';
  collapsible?: boolean;
}

export const Header = ({ collections }: Props) => {
  const { t } = useTranslation('header');

  const sideNavLinks: [string, IconType][] = [
    ['wishlist', FiHeart],
    ['cart', FiShoppingBag],
    ['login', FiUser],
  ];
  const [navLinks] = useState<NavLink[]>([
    { name: 'men', collapsible: true },
    { name: 'women', collapsible: true },
    { name: 'kids' },
    { name: 'sale' },
    { name: 'blog' },
    { name: 'contacts' },
  ]);
  const [hoveredNavLink, setHoveredNavLink] = useState<NavLink | null>();

  const handleShowMenu = (navLink: NavLink) => setHoveredNavLink(navLink);

  const handleCloseMenu = () => setHoveredNavLink(null);

  return (
    <header>
      <AnnouncementBar />
      <TopBar />
      <div className="relative h-14 bg-white shadow-md shadow-gray-200">
        <div className="mx-auto flex h-full items-center px-4 xl:container">
          <div className="mr-5 flex shrink-0 items-center">
            <Link href="/">
              <Image
                priority
                src="/logo.png"
                alt="logo"
                width={100}
                height={35}
                quality={100}
              />
            </Link>
          </div>
          <ul className="ml-auto hidden h-full md:flex">
            {navLinks.map((item, index) => (
              <li
                className={`font-medium text-neutral-700 transition-colors ${
                  hoveredNavLink === item && 'bg-violet-100 text-violet-700'
                }`}
                key={index}
                onMouseEnter={() => handleShowMenu(item)}
                onMouseLeave={handleCloseMenu}
              >
                <Link
                  href={item.name}
                  className="flex h-full items-center px-5"
                >
                  {t(item.name)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="ml-auto items-center md:flex">
            <Search onSearch={value => console.log(value)} />
            {sideNavLinks.map(([url, Icon]) => (
              <Link
                key={url}
                href={url}
                className="ml-5 hidden first-of-type:ml-8 md:block"
              >
                <Icon
                  className="text-neutral-700 transition-colors hover:text-violet-700"
                  size="20px"
                />
              </Link>
            ))}
          </ul>
        </div>
        <Transition show={Boolean(hoveredNavLink?.collapsible)}>
          {hoveredNavLink && (
            <MegaMenu
              type={hoveredNavLink.name === 'men' ? 'men' : 'women'}
              collections={collections}
              onShowMenu={() => handleShowMenu(hoveredNavLink)}
              onCloseMenu={handleCloseMenu}
            />
          )}
        </Transition>
      </div>
      <BottomNavigation navLinks={navLinks} collections={collections} />
    </header>
  );
};