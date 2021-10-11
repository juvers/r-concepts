/** @jsx jsx */
import {
  jsx,
  Flex,
  Text,
  Box,
  useCarouselContext,
  CarouselNavigation,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';

export interface CategoryHeaderProps {
  carouselTitle: string;
  description: React.ReactNode;
}

const Nav = () => {
  const {pages} = useCarouselContext();
  return pages > 1 ? (
    <Box sx={{position: 'absolute', top: '5px', right: '20px'}}>
      <CarouselNavigation />
    </Box>
  ) : null;
};

export function CategoryHeader({
  carouselTitle,
  description,
}: CategoryHeaderProps): JSX.Element | null {
  if (!carouselTitle && !description) {
    return null;
  }

  return (
    <Flex
      px={[3, 4]}
      sx={{
        flexDirection: ['column'],
        justifyContent: ['space-between'],
        alignItems: ['flex-start'],
        mb: '33px',
        position: 'relative',
        flex: '0 0 calc(100% - 261px)',
      }}
    >
      {carouselTitle && (
        <H
          sx={{
            variant: 'styles.h1',
            fontSize: [6, null, null, 7],
            fontFamily: 'headingSecondary',
            mb: '15px',
            pr: '84px',
          }}
        >
          {carouselTitle}
        </H>
      )}

      <div
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {description && (
          <Text
            variant="smallP"
            sx={{
              p: {
                marginBottom: 0,
              },
            }}
          >
            {description}
          </Text>
        )}
      </div>
      <Nav />
    </Flex>
  );
}
