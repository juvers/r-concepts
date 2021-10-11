/**@jsx jsx */
import {jsx, ReviewCarousel, Section} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';

const TOR_REVIEW_QUERY = graphql`
  query TorReview {
    sanityAttractionTor(
      _id: {eq: "topOfTheRock"}
      _type: {eq: "attraction.tor"}
    ) {
      tripadvisorsReview {
        review
        source
      }
    }
  }
`;

const TorReviewBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {sanityAttractionTor} = useStaticQuery<GatsbyTypes.TorReviewQuery>(
    TOR_REVIEW_QUERY,
  );

  const torReviewProps = useMemo(() => {
    if (!sanityAttractionTor)
      throw new Error('Expected Top of the Rock Attraction data');
    if (
      !sanityAttractionTor.tripadvisorsReview ||
      !sanityAttractionTor.tripadvisorsReview.length
    )
      throw new Error('Expected Top of the Rock trip advisors data');

    const cards = sanityAttractionTor.tripadvisorsReview.map((card) => {
      if (!card) throw new Error('Expected review card data');
      if (!card.review) throw new Error('Expected review card review');
      if (!card.source) throw new Error('Expected review card source');
      return {
        quote: card.review,
        author: card.source,
      };
    });
    return {
      cards: cards,
    };
  }, [sanityAttractionTor]);
  return (
    torReviewProps && (
      <Section {...props}>
        <ReviewCarousel {...torReviewProps} />
      </Section>
    )
  );
};

export default TorReviewBlock;
