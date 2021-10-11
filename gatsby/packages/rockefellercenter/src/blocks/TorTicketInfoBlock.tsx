/** @jsx jsx */
import {jsx, Section, TicketInfo} from '@tishman/components';
import {useMemo} from 'react';
import invariant from 'invariant';
import {useStaticQuery, graphql} from 'gatsby';

import type {ComponentPropsWithoutRef} from 'react';

const TOR_TICKET_INFO_QUERY = graphql`
  query TorTicketInfo {
    dataJson(id: {eq: "top-of-the-rock-observation-deck"}) {
      torTicketInfo {
        title
        copy
        icon
      }
    }
  }
`;

const TorTicketInfoBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.TorTicketInfoQuery>(
    TOR_TICKET_INFO_QUERY,
  );
  invariant(dataJson, 'TicketInfo JSON data is required!');

  const torTicketInfoProps = useMemo(() => {
    const items = dataJson.torTicketInfo.map(({title, copy, icon}) => ({
      title,
      copy,
      icon,
    }));
    return {items};
  }, [dataJson]);

  return (
    <Section {...props}>
      <TicketInfo items={torTicketInfoProps.items} />
    </Section>
  );
};

export default TorTicketInfoBlock;
