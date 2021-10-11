/** @jsx jsx */
import {jsx, Link} from '@tishman/components';
import type {SanityTitleAndSlug, TicketCategory} from '../types';

interface SideBarMenuProps {
  categories: TicketCategory[];
  currentCategory: TicketCategory;
}

interface SidebarMenuItemProps extends SanityTitleAndSlug {
  isCurrent: boolean;
}

const SidebarMenuItem = ({title, slug, isCurrent}: SidebarMenuItemProps) => {
  const currentSlug: string = slug.current;

  return (
    <li
      sx={{
        mb: '26px',
        fontSize: '14px',
      }}
    >
      <Link
        href={`#${currentSlug}`}
        variant="underline"
        sx={{
          '&:after': {
            visibility: isCurrent ? 'visible' : 'hidden',
          },
        }}
      >
        {title}
      </Link>
    </li>
  );
};

export function SidebarMenu({
  categories,
  currentCategory,
}: SideBarMenuProps): JSX.Element {
  return (
    <ul
      sx={{
        pl: '16px',
      }}
    >
      {categories.map(({titleAndSlug}) => {
        return (
          <SidebarMenuItem
            {...titleAndSlug}
            key={titleAndSlug.title}
            isCurrent={
              titleAndSlug.title === currentCategory.titleAndSlug.title
            }
          />
        );
      })}
    </ul>
  );
}
