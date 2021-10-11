/** @jsx jsx */
import {
  jsx,
  Container,
  Box,
  Text,
  IntrinsicImage,
  Grid,
  Button,
  OpenAccordionSvg,
  CloseAccordionSvg,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {useState} from 'react';
import {FluidObject} from 'gatsby-image';

interface TextCardProps {
  title: string;
  caption: string;
}

const TextCard = (card: TextCardProps) => {
  return (
    <Box
      sx={{
        gridArea: 'text',
        mb: [2, 4],
      }}
    >
      <H
        sx={{
          variant: 'styles.h1',
          fontFamily: 'headingSecondary',
          fontSize: [6, 7],
          mb: [1, 4],
          maxWidth: ['unset', 300],
        }}
      >
        {card.title}
      </H>
      <Text
        sx={{
          maxWidth: ['unset', 300],
        }}
      >
        {card.caption}
      </Text>
    </Box>
  );
};

interface ImageCardProps {
  fluid: FluidObject;
  alt: string;
  height: number;
  width: number;
}

const ImageCard = (card: ImageCardProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        gridArea: 'image',
      }}
    >
      <IntrinsicImage
        ratio={card.width / card.height}
        maxWidth={['100%', '80%', '70%', card.width]}
        fluid={card.fluid}
        alt={card.alt}
        sx={{mx: 'auto', width: '100%'}}
      />
    </Box>
  );
};

interface DidYouKnowCardProps extends ImageCardProps, TextCardProps {}

const DidYouKnowCard = (card: DidYouKnowCardProps) => {
  const [isVisible, toggleVisible] = useState<boolean>(false);
  return (
    <Box
      sx={{
        textAlign: 'center',
        gridArea: 'didYouKnow',
        mb: 5,
      }}
    >
      <IntrinsicImage
        ratio={card.width / card.height}
        maxWidth={['100%', '80%', '70%', card.width]}
        fluid={card.fluid}
        alt={card.alt}
        sx={{mx: 'auto'}}
      />
      <Box sx={{maxWidth: 300, mx: 'auto'}}>
        <Button
          variant="text"
          sx={{width: '100%'}}
          onClick={() => toggleVisible(!isVisible)}
        >
          <Text
            sx={{
              display: 'flex',
              alignItems: 'center',
              variant: 'styles.h4',
              fontFamily: 'headingSecondary',
              my: 4,
              color: 'primary',
              position: 'relative',
              '::after': {
                position: 'absolute',
                content: '""',
                height: 2,
                width: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                top: 'calc(100% + 16px)',
                bg: 'primary',
                display: ['none', null, null, 'block'],
              },
            }}
          >
            <span sx={{flex: '1 1 auto'}}>Did You Know…?</span>
            <span sx={{display: ['flex', null, null, 'none']}}>
              {isVisible ? <CloseAccordionSvg /> : <OpenAccordionSvg />}
            </span>
          </Text>
        </Button>
        <Text
          sx={{
            display: [isVisible ? 'block' : 'none', null, null, 'block'],
          }}
        >
          {card.caption}
        </Text>
      </Box>
    </Box>
  );
};

const TourThreeColGridBlock = (props: {
  gridOrder: ReadonlyArray<string | undefined>;
  textCard: TextCardProps;
  imageCard: ImageCardProps;
  didYouKnowCard: DidYouKnowCardProps;
}): JSX.Element => {
  return (
    <Container>
      <Grid
        key={props.textCard.title}
        sx={{
          gridTemplateColumns: [
            'repeat(1, 1fr)',
            'repeat(2, 1fr)',
            null,
            'repeat(3, 1fr)',
          ],
          gridGap: [3, 4],
          gridTemplateAreas: props.gridOrder.map((order) => order),
          gridAutoFlow: 'dense',
          alignItems: 'center',
          mb: [0, null, null, 8],
        }}
      >
        <TextCard {...props.textCard} />
        <ImageCard {...props.imageCard} />
        <DidYouKnowCard {...props.didYouKnowCard} />
      </Grid>
    </Container>
  );
};

export default TourThreeColGridBlock;
