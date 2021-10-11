/** @jsx jsx */
import {
  jsx,
  Section,
  Container,
  Box,
  IntrinsicImage,
  Flex,
  Text,
  Link,
} from '@tishman/components';
import {useMemo} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';
import {H} from '@hzdg/sectioning';

const ERROR_HERO_QUERY = graphql`
  query ErrorHero {
    dataJson(id: {eq: "404"}) {
      title
      subTitle
      image {
        alt
        src {
          fluid {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
      link {
        url
        label
      }
    }
  }
`;

const ErrorHeroBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.ErrorHeroQuery>(
    ERROR_HERO_QUERY,
  );

  invariant(dataJson, 'Error JSON data is required!');

  const errorHeroProps = useMemo(() => {
    return {
      title: dataJson.title,
      subTitle: dataJson.subTitle,
      fluid: dataJson.image.src.fluid,
      alt: dataJson.image.alt,
      link: dataJson.link,
    };
  }, [dataJson]);

  return (
    <Section {...props}>
      <Box
        sx={{
          position: 'relative',
          pt: 5,
          zIndex: 'content',
          ':after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            bottom: 0,
            left: 0,
            right: 0,
            bg: 'heroBackground',
            zIndex: 'background',
          },
        }}
      >
        <Container
          sx={{maxWidth: 1600, pb: 4, px: [0, 3], position: 'relative'}}
        >
          <Box
            sx={{
              position: 'relative',
              pb: [`${(266 / 320) * 100}%`, `${(680 / 1280) * 100}%`],
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
            >
              <IntrinsicImage
                ratio={[320 / 266, 1280 / 680]}
                fluid={errorHeroProps.fluid}
                alt={errorHeroProps.alt}
              />

              <Box
                sx={{
                  bg: 'backgroundOverlay',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <Flex
                  sx={{
                    maxWidth: 835,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    mx: 'auto',
                    px: 2,
                    textAlign: 'center',
                  }}
                >
                  <H sx={{variant: 'text.heroTitle', color: 'textInverted'}}>
                    {errorHeroProps.title}
                  </H>
                  <Text
                    sx={{
                      variant: 'text.largeP',
                      color: 'textInverted',
                      mt: 3,
                    }}
                  >
                    {errorHeroProps.subTitle}{' '}
                    <Link
                      variant="inline"
                      sx={{color: 'textInverted'}}
                      href={errorHeroProps.link.url}
                    >
                      {errorHeroProps.link.label}
                    </Link>
                    {'.'}
                  </Text>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Section>
  );
};

export default ErrorHeroBlock;
