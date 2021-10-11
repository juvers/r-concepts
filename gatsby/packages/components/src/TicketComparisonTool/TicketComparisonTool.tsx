/**@jsx jsx */
import {useState, Fragment} from 'react';
import {
  Flex,
  Link,
  Container,
  Box,
  jsx,
  Text,
  Select,
  TicketComparisonCard,
  TicketComparisonCardProps,
} from '@tishman/components';

export interface TicketComparisonToolProps {
  /** @param {string} title - Title of section */
  title: string;
  /** @param {string} subTitle - Sub Title of section */
  subTitle: string;
  /** @param {TicketComparisonCardProps[]} tickets - list of tickets */
  tickets: TicketComparisonCardProps[];
  /** @param {TicketFeatures} featureList - object of ticket feature fields */
  featureList: TicketFeaturesDescriptions;
  /**
   * @param {object} passes - props for the passes content
   * @param {string} passes.caption - caption
   * @param {object} passes.link - link to passes
   * @param {string} passes.link.url - url
   * @param {object} passes.link.label - display label
   */
  passes: {
    caption: string;
    link: {
      url: string;
      label: string;
    };
  };
}

export interface TicketFeaturesDescriptions {
  admission: string;
  views: string;
  levels: string;
  timeLimit: string;
  entry: string;
  elevator: string;
  merchandise: string;
  schedule: string;
  visit: string;
  save: string;
  valid: string;
  choice: string;
  saveUpTo: string;
  [key: string]: string;
}

export interface TicketFeatures {
  admission?: boolean;
  views?: boolean;
  levels?: boolean;
  timeLimit?: boolean;
  entry?: boolean;
  elevator?: boolean;
  merchandise?: boolean;
  schedule?: boolean;
  visit?: boolean;
  save?: boolean;
  valid?: boolean;
  choice?: boolean;
  saveUpTo?: boolean;
  [key: string]: boolean | undefined;
}

const getDropdownList = (
  tickets: TicketComparisonCardProps[],
  selection: string,
) =>
  tickets
    .map((ticket: TicketComparisonCardProps) => ticket.title)
    .filter((title) => title !== selection)
    .map((option) => <option key={option}>{option}</option>);

export const TicketComparisonTool = ({
  title,
  subTitle,
  tickets,
  featureList,
  passes,
}: TicketComparisonToolProps): JSX.Element => {
  const [firstTicket, setFirstTicket] = useState<TicketComparisonCardProps>(
    tickets[0],
  );
  const [secondTicket, setSecondTicket] = useState<TicketComparisonCardProps>(
    tickets[1],
  );

  return (
    <Container sx={{maxWidth: 1200, py: [5, 9]}}>
      <Flex
        sx={{justifyContent: 'space-between', flexDirection: ['column', 'row']}}
      >
        <Box sx={{maxWidth: ['100%', 353], mr: 4}}>
          <Text sx={{variant: 'styles.h1', fontFamily: 'headingSecondary'}}>
            {title}
          </Text>
          <Text
            variant="mediumP"
            sx={{fontWeight: 'medium', opacity: 0.5, mb: 3}}
          >
            {subTitle}
          </Text>
          <Select
            sx={{fontWeight: 'book'}}
            value={firstTicket.title}
            onChange={(e) => {
              e.preventDefault();
              const selectedTicket = tickets.find(
                (ticket) => ticket.title === e.target.value,
              );
              selectedTicket && setFirstTicket(selectedTicket);
            }}
          >
            {getDropdownList(tickets, secondTicket.title)}
          </Select>
          <Select
            sx={{fontWeight: 'book'}}
            value={secondTicket.title}
            onChange={(e) => {
              e.preventDefault();
              const selectedTicket = tickets.find(
                (ticket) => ticket.title === e.target.value,
              );
              selectedTicket && setSecondTicket(selectedTicket);
            }}
          >
            {getDropdownList(tickets, firstTicket.title)}
          </Select>
          <Box sx={{mt: 7, display: ['none', 'block']}}>
            <Text sx={{variant: 'styles.h3', fontFamily: 'headingSecondary'}}>
              Passes
            </Text>
            <Text sx={{mb: 3, mt: 2}}>{passes.caption}</Text>
            <Link variant="underline" href={passes.link.url}>
              {passes.link.label}
            </Link>
          </Box>
        </Box>
        {firstTicket && secondTicket && (
          <Fragment>
            <Flex
              sx={{
                alignItems: 'flex-end',
                overflowX: 'scroll',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <TicketComparisonCard
                key={firstTicket.title}
                {...firstTicket}
                featureList={featureList}
              />
              <TicketComparisonCard
                key={secondTicket.title}
                {...secondTicket}
                featureList={featureList}
              />
            </Flex>
          </Fragment>
        )}
      </Flex>
    </Container>
  );
};
