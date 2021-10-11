/** @jsx jsx */
import invariant from 'invariant';
import {
  jsx,
  Box,
  Text,
  Select,
  IntrinsicImage,
  Section,
} from '@tishman/components';
import {navigate, graphql, useStaticQuery} from 'gatsby';
import {FluidObject} from 'gatsby-image';
import {getContactFormUri} from '~blocks/utils';

export interface ContactNavigationBlockProps {
  slug: string;
  text: readonly string[];
  image: {
    fluid: FluidObject;
  };
}

const NAVIGATION_ITEMS_QUERY = graphql`
  query ContactNavigationBlock {
    dataJson(id: {eq: "contact"}) {
      contactPageData {
        forms {
          title
          options
        }
      }
    }
    allFormJson {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

const navigateToForm = (e: React.ChangeEvent<HTMLSelectElement>): void => {
  void navigate(e.target.value);
};

const ContactNavigationBlock = ({
  slug,
  text,
  image: {fluid},
}: ContactNavigationBlockProps): JSX.Element => {
  const {
    dataJson,
    allFormJson,
  } = useStaticQuery<GatsbyTypes.ContactNavigationBlockQuery>(
    NAVIGATION_ITEMS_QUERY,
  );
  invariant(dataJson, 'Contact Navigation JSON data is required');

  const {title, options} = dataJson.contactPageData.forms;
  const navLinks = options.reduce((acc, optionId) => {
    const obj = allFormJson.nodes.find((form) => form.id === optionId);
    return obj
      ? acc.concat({url: getContactFormUri(obj.slug), label: obj.name})
      : acc;
  }, [] as {url: string; label: string}[]);

  return (
    <Section>
      {
        <Box sx={{mb: [5, null]}}>
          <Text variant="selectNavigationTitle">{title}</Text>
          <Box mt={2}>
            <Select
              sx={{
                fontSize: [3, 5],
                fontWeight: 'regular',
                backgroundColor: 'background',
              }}
              name="topic"
              defaultValue={slug ? getContactFormUri(slug) : 'default'}
              onChange={navigateToForm}
            >
              <option value="default" disabled>
                Choose a form
              </option>
              {navLinks.map((link) => {
                return (
                  <option key={link.url} value={link.url}>
                    {link.label}
                  </option>
                );
              })}
            </Select>
          </Box>
          {text.length > 0 && (
            <Box sx={{mt: 4, mb: 5}}>
              {text.map((line: string, index: number) => {
                return (
                  <Text
                    key={`${index}-text-line`}
                    sx={{
                      fontSize: [2, null, 3],
                      letterSpacing: [2, null, 1],
                    }}
                  >
                    {line}
                  </Text>
                );
              })}
            </Box>
          )}
          <Box>
            <IntrinsicImage
              ratio={[632 / 346, null, 146 / 284]}
              maxWidth={'100%'}
              marginTop="48px"
              fluid={fluid}
              sx={{display: ['none', 'flex']}}
            />
          </Box>
        </Box>
      }
    </Section>
  );
};

export default ContactNavigationBlock;
