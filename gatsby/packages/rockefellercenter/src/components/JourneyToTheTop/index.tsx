/** @jsx jsx */
import {
  jsx,
  Flex,
  Box,
  usePagination,
  IntrinsicImage,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {JourneyItem, JourneyItemProps} from './JourneyItem';

export interface JourneyToTheTopProps {
  /** List of JourneyItems */
  items: JourneyItemProps[];
}

const JourneyToTheTop = ({items}: JourneyToTheTopProps): JSX.Element | null => {
  const {page = 0, goto} = usePagination({pages: items?.length});
  return (
    <Flex
      sx={{
        flexDirection: ['column', 'row'],
        justifyContent: 'space-between',
        alignItems: ['initial', 'center'],
      }}
    >
      <Box
        sx={{
          flex: ['1 1 auto', '0 0 50%', '0 0 60%'],
          position: 'relative',
          p: [0, 3],
          borderStyle: ['none', 'solid'],
          borderWidth: '2px',
          borderColor: 'accent',
        }}
      >
        <IntrinsicImage
          ratio={635 / 879}
          fluid={items[page].fluid}
          sx={{borderColor: 'accent', display: ['none', 'block']}}
        />
      </Box>
      <Flex
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'center',
          my: [4, 0],
          ml: [3, 5, 6],
          mr: [3, 0],
        }}
      >
        <Box>
          <H sx={{variant: 'text.journeyToTheTopHeading'}}>
            Journey to the Top
          </H>
          {items.length &&
            items.map((item, index) => (
              <JourneyItem
                key={item.title}
                {...item}
                onClick={goto}
                active={index === page}
                index={index}
              />
            ))}
        </Box>
      </Flex>
    </Flex>
  );
};

export default JourneyToTheTop;
