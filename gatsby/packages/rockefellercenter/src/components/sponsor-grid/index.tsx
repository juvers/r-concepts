/** @jsx jsx */
import {FluidObject} from 'gatsby-image';
import {H} from '@hzdg/sectioning';
import {jsx, IntrinsicImage, Flex} from '@tishman/components';

export interface SponsorImage {
  fluid: FluidObject;
  alt: string;
}

interface SponsorGridProps {
  /** Title of Sponsor Grid */
  title: string;
  /** Array of sponsor logos */
  logos: SponsorImage[] | null;
  /**
   *  Whether or not logo grid is displaying primary or secondary logos
   *  (Secondary logos are smaller than primary)
   */
  isPrimary: boolean;
  /** Any extra sx styling being passed into the component will be rendered
   * as a className string
   */
  className?: string;
}

const SponsorGrid = ({
  title,
  logos,
  isPrimary,
  className,
}: SponsorGridProps): JSX.Element => {
  return (
    <Flex
      className={className}
      sx={{
        flex: ['1 1 auto', null, null, '1 1 50%'],
        maxWidth: ['unset', null, null, 600],
        flexDirection: 'column',
      }}
    >
      <H
        sx={{
          variant: 'smallP',
          textAlign: 'center',
          mb: [3, null, null, 4],
        }}
      >
        {title}
      </H>
      <Flex
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          '> div': isPrimary
            ? {flex: '0 0 240px'}
            : {flex: ['0 0 100px', '0 0 160px']},
        }}
      >
        {logos?.map(({fluid, alt}) => (
          <IntrinsicImage
            imgStyle={{objectFit: 'contain'}}
            key={alt}
            ratio={240 / 170}
            fluid={fluid}
            alt={alt}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default SponsorGrid;
