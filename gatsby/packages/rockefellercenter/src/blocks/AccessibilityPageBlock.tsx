/**@jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  Text,
  Grid,
  IntrinsicImage,
  FaqItem,
  useThemeUI,
} from '@tishman/components';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import useSize from '@hzdg/use-size';
import IntroText from '~components/IntroText';

const ACCESSIBILITY_PAGE_QUERY = graphql`
  query AccessibilityPage {
    dataJson(id: {eq: "accessibility"}) {
      title
      caption
      image {
        src {
          childImageSharp {
            fluid(maxWidth: 700) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        alt
      }
      accessibilityItems {
        title
        caption
      }
    }
  }
`;

const AccessibilityPageBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.AccessibilityPageQuery>(
    ACCESSIBILITY_PAGE_QUERY,
  );

  const accessibilityPageData = useMemo(() => {
    const accessibilityItems = dataJson?.accessibilityItems?.map((item) => {
      return {
        title: item.title,
        caption: item.caption,
      };
    });

    return {
      accessibilityItems: accessibilityItems,
      image: dataJson?.image,
      title: dataJson?.title,
      caption: dataJson?.caption,
    };
  }, [dataJson]);

  // Responsive
  const [{width: sectionWidth}, sectionRef] = useSize();
  const {theme} = useThemeUI();
  const tabletBreakpoint = parseInt(theme?.breakpoints?.[1] || '832px');

  return (
    <Section {...props} theme="Rock Center Black" ref={sectionRef}>
      <Container sx={{py: 4}}>
        <IntroText
          title={accessibilityPageData?.title}
          caption={accessibilityPageData?.caption}
          desktopOrientation="column"
          center={true}
          sx={{
            mx: 'auto',
            mb: [4, null, 9],
            mt: [0, null, 6],
          }}
        />
        <Grid
          sx={{
            gridTemplateColumns: ['1fr', null, '380px 1fr'],
            gridGap: [0, null, 7, 8, 9],
          }}
        >
          <Box
            sx={{
              mb: [4, null, 0],
            }}
          >
            <IntrinsicImage
              ratio={[284 / 146, null, 380 / 585]}
              maxWidth={'100%'}
              fluid={accessibilityPageData?.image?.src?.childImageSharp?.fluid}
              alt={accessibilityPageData.image?.alt}
              sx={{
                position: ['relative', null, 'sticky'],
                top: 0,
              }}
            />
          </Box>
          <Box>
            {accessibilityPageData?.accessibilityItems?.map((item) => {
              return sectionWidth > 0 && sectionWidth >= tabletBreakpoint ? (
                <Box sx={{mb: 5}} key={item.title}>
                  <Text sx={{mb: 3}} variant="accessibilityHeading">
                    {item.title}
                  </Text>
                  <Text variant="largeP">{item.caption}</Text>
                </Box>
              ) : (
                <FaqItem key={item.title} question={item.title}>
                  <Text variant="mediumP">{item.caption}</Text>
                </FaqItem>
              );
            })}
          </Box>
        </Grid>
      </Container>
    </Section>
  );
};

export default AccessibilityPageBlock;
