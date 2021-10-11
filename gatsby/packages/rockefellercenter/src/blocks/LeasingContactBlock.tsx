/**@jsx jsx */
import {
  jsx,
  Container,
  Section,
  Flex,
  Box,
  Grid,
  Text,
} from '@tishman/components';
import {H} from '@hzdg/sectioning';
import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import invariant from 'invariant';

const LEASING_CONTACT_QUERY = graphql`
  query LeasingContactBlock {
    dataJson(id: {eq: "leasing"}) {
      leasingContactCallout {
        title
        caption
        leasingContacts {
          name
          email
          phone
        }
      }
    }
  }
`;

const LeasingContactBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const {dataJson} = useStaticQuery<GatsbyTypes.LeasingContactBlockQuery>(
    LEASING_CONTACT_QUERY,
  );

  invariant(dataJson, 'Leasing JSON data is required!');

  const leasingContactProps = useMemo(() => {
    return {
      title: dataJson.leasingContactCallout.title,
      caption: dataJson.leasingContactCallout.caption,
      leasingContact: dataJson.leasingContactCallout.leasingContacts.map(
        (contact) => {
          return {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
          };
        },
      ),
    };
  }, [dataJson]);

  return (
    <Section {...props} theme="Rock Center Black">
      <Container sx={{py: 6}}>
        <Flex
          sx={{
            py: [3, 4],
            px: [3, null, null, 4],
            border: '1px solid',
            borderColor: 'accent',
            flexDirection: ['column', null, null, 'row'],
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            bg: 'background',
          }}
        >
          <H
            sx={{
              variant: 'text.heading',
              fontFamily: 'headingSecondary',
              flex: '0 0 auto',
              fontSize: [6, 7],
              letterSpacing: 0,
              my: [2, null, null, 0],
              mr: [0, null, null, 3],
            }}
          >
            {leasingContactProps.title}
          </H>
          <Box
            sx={{
              flex: '1 1 auto',
              mt: [2, null, null, 3],
              mb: [3, null, null, 0],
              ml: [0, null, null, 5],
            }}
          >
            <Text sx={{mb: 4}} variant="mediumP">
              {leasingContactProps.caption}
            </Text>
            <Grid columns={[1, 2]}>
              {leasingContactProps.leasingContact.map((contact) => {
                return (
                  <Box sx={{mb: [4, 0]}} key={contact.name}>
                    <Text sx={{mb: [2, 3]}} variant="leasingContactTitle">
                      {contact.name}
                    </Text>
                    <Text variant="smallP">{contact.email}</Text>
                    <Text variant="smallP">{contact.phone}</Text>
                  </Box>
                );
              })}
            </Grid>
          </Box>
        </Flex>
      </Container>
    </Section>
  );
};

export default LeasingContactBlock;
