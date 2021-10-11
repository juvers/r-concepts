/** @jsx jsx */
import {jsx, Section, IconicExperiencesCarousel} from '@tishman/components';
import {useStaticQuery, graphql} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const ICONIC_EXPERIENCES_QUERY = graphql`
  query IconicExperiences {
    dataJson(id: {eq: "iconic-experiences"}) {
      iconicExperiencesCarousel {
        cards {
          title
          description
          url
          image {
            alt
            src {
              fluid {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
`;

const IconicExperiencesBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.IconicExperiencesQuery>(
    ICONIC_EXPERIENCES_QUERY,
  );

  invariant(dataJson, 'Iconic Experiences JSON data is required!');

  const iconicExperiencesData = useMemo(() => {
    return dataJson.iconicExperiencesCarousel.cards.map((card) => {
      return {
        title: card.title,
        description: card.description,
        url: card.url,
        fluid: card.image.src.fluid,
        alt: card.image.alt,
      };
    });
  }, [dataJson]);

  return (
    <Section {...props}>
      {iconicExperiencesData && (
        <IconicExperiencesCarousel
          title={'Iconic experiences.'}
          link={{url: '/attractions', label: 'Explore Them All'}}
          data={iconicExperiencesData}
        />
      )}
    </Section>
  );
};

export default IconicExperiencesBlock;
