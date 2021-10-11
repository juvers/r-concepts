/** @jsx jsx */
import {jsx, Select, useScrollTo} from '@tishman/components';
import type {TicketCategory} from '../types';

export function CategoryChooser({
  categories,
}: {
  categories: TicketCategory[];
}): JSX.Element {
  const scrollTo = useScrollTo();
  return (
    <Select
      name="ticket"
      sx={{
        fontWeight: 300,
      }}
      onChange={(e) => {
        window.location.hash = `#${e.target.value}`;
        scrollTo(`${e.target.value}`);
      }}
    >
      <option disabled hidden>
        Explore Tickets
      </option>
      ;
      {categories.map((cat) => {
        return (
          <option key={cat.id} value={cat.titleAndSlug.slug.current}>
            {cat.titleAndSlug.title}
          </option>
        );
      })}
    </Select>
  );
}
