/**@jsx jsx */
import {
  jsx,
  Container,
  Box,
  Divider,
  IntrinsicImage,
  Flex,
  Grid,
  Text,
  Link,
} from '@tishman/components';
import {FluidObject} from 'gatsby-image';

export interface PrivateEventFloorPlanProps {
  fluid: FluidObject;
  alt: string;
  info: string;
  squareFeet: number;
  ceilings?: string;
  capacity?: CapacityType[];
  link: {
    label: string;
    url: string;
  };
}

export interface CapacityType {
  capacityType: string;
  value: number;
}

export const PrivateEventFloorPlan = ({
  alt,
  info,
  fluid,
  squareFeet,
  ceilings,
  capacity,
  link,
}: PrivateEventFloorPlanProps): JSX.Element => {
  return (
    <Box>
      <IntrinsicImage
        ratio={[320 / 266, 1280 / 680]}
        fluid={fluid}
        alt={alt}
        sx={{mx: 3}}
      />
      <Container sx={{maxWidth: 984, mt: 5}}>
        <Divider />
        <Flex
          sx={{
            justifyContent: 'space-between',
            pt: [3, 4],
            pb: [4, 2],
            flexDirection: ['column', null, 'row'],
          }}
        >
          <Box sx={{width: '100%'}}>
            <Text>Square feet:</Text>
            <Text variant="largePrivateEventSpec">
              {squareFeet.toLocaleString()}
            </Text>
          </Box>
          <Box>
            <Text>{info}</Text>
          </Box>
        </Flex>
        <Divider />
        <Grid
          sx={{
            pt: 4,
            pb: 5,
            gridTemplateColumns: [
              '1fr 1fr',
              'repeat(auto-fill, minmax(160px, 1fr))',
            ],
          }}
        >
          <Box>
            <Text>Ceiling height:</Text>
            <Text variant="mediumPrivateEventSpec">
              {ceilings ? ceilings : 'n/a'}
            </Text>
          </Box>
          {capacity?.map(({capacityType, value}) => (
            <Box key={capacityType}>
              <Text>{`${capacityType}:`}</Text>
              <Text variant="mediumPrivateEventSpec">{value}</Text>
            </Box>
          ))}
        </Grid>
        <Divider />
        <Flex sx={{justifyContent: 'center', alignItems: 'center', mt: 5}}>
          <Link href={link.url} variant="button">
            {link.label}
          </Link>
        </Flex>
      </Container>
    </Box>
  );
};
