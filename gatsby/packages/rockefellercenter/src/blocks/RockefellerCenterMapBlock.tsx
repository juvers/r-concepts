/** @jsx jsx */
import {useState, useCallback, useMemo, ChangeEvent, MouseEvent} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {TransformWrapper, TransformComponent} from 'react-zoom-pan-pinch';
import _ from 'lodash';
import {
  getSanityFluidImageProps,
  getLocationProps,
  getContactsInfoProps,
  getHoursProps,
} from '~blocks/utils';

import {
  jsx,
  Section,
  Container,
  Flex,
  Select,
  Button,
  ThemeProvider,
  getThemeByName,
  Modal,
} from '@tishman/components';
import {ModalBusinessMap} from '~components/ModalBusinessMap';
import StreetLevelMap from '!!svg-react-loader!./../../../components/src/icons/StreetLevelMap.svg';
import ConcourseLevelMap from '!!svg-react-loader!./../../../components/src/icons/ConcourseLevelMap.svg';

interface TransformWrapperProps {
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
}

const ROCKEFELLER_CENTER_BUSINESS_MAP_QUERY = graphql`
  query RockefellerCenterBusinessMap {
    business: allSanityBusiness {
      nodes {
        id
        mapId
        titleAndSlug {
          title
          slug {
            current
          }
        }
        category {
          category
        }
        poster {
          alt
          asset {
            fluid {
              ...GatsbySanityImageFluid
            }
          }
        }
        hours {
          opensAt
          day
          closesAt
        }
        contactsInfo {
          value
          type
        }
        location {
          title
          address1
          address2
        }
      }
    }
  }
`;

const RockefellerCenterMapBlock = (
  props: ComponentPropsWithoutRef<typeof Section>,
): JSX.Element => {
  const [mapLevel, setMapLevel] = useState('street');
  const [store, setStore] = useState('');
  const [formattedStore, setFormattedStore] = useState('');
  const [modalId, openModal] = useState<string | null>(null);
  const closeModal = useCallback(() => openModal(null), []);

  const data = useStaticQuery<GatsbyTypes.RockefellerCenterBusinessMapQuery>(
    ROCKEFELLER_CENTER_BUSINESS_MAP_QUERY,
  );

  const {business} = data;

  const businessData = useMemo(() => {
    if (!business) throw new Error('Expected valid Business Data');

    return business.nodes.map((biz) => {
      if (!biz) throw new Error('Expected valid object');
      // Check for mapID as soon as you have the business ID's entered in Sanity
      // if (!biz?.mapId) throw new Error('Expected valid business MapId');
      if (!biz?.titleAndSlug?.title)
        throw new Error('Expected valid business title');
      if (!biz?.titleAndSlug?.slug?.current)
        throw new Error('Expected valid business slug');
      if (!biz?.category?.category)
        throw new Error('Expected valid business category');
      if (!biz?.id) throw new Error('Expected valid business id');
      if (!biz?.location) throw new Error('Expected valid business location');
      if (!biz?.hours) throw new Error('Expected valid business hours data');

      const hours = getHoursProps({hours: biz.hours});

      const location = getLocationProps(biz?.location);

      if (!biz?.contactsInfo)
        throw new Error('Expected valid business contacts info');

      const contactsInfo = biz?.contactsInfo.map((contact) =>
        getContactsInfoProps(contact),
      );
      const {poster} = biz;
      const image = getSanityFluidImageProps(poster);

      return {
        mapId: biz.mapId,
        title: biz.titleAndSlug.title,
        slug: biz.titleAndSlug.slug.current,
        category: biz.category.category,
        location: location,
        contactsInfo: contactsInfo,
        hours: hours,
        ...image,
      };
    });
  }, [business]);

  const bizData = businessData
    .filter((biz) => biz.mapId !== null)
    .map((biz) => {
      return {
        ...biz,
      };
    });

  const groupedBusinessData = bizData && _.groupBy(bizData, 'mapId');

  const mapIdList = Object.keys(groupedBusinessData);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const target = event.target as HTMLSelectElement;
    setMapLevel(target.value);
  };

  // Store ID's which have their own pages under shop/dine category in Sanity
  const selectors =
    mapIdList.map((mapId) => `[id^="${mapId}_"]`).join(', ') +
    mapIdList.map((mapId) => `[id^="${mapId}"]`).join(', ');

  console.log(selectors);

  return (
    <Section {...props}>
      <Container
        sx={{
          py: [0, 3],
          px: 0,
          width: '100%',
          maxWidth: ['none', '1800px'],
          // height: ['75vh', 'auto'],
          height: ['55vh', '75vh', '120vh'],
          margin: ['auto', 'auto', '0 auto'],
          '#ConcourseLevel, #StreetLevel': {
            width: '100%',
            maxWidth: ['none', '1600px'],
            margin: '0 auto',
            // height: ['70vh', 'auto'],
            height: ['55vh', '70vh', '100vh'],
            shapeRendering: 'geometricPrecision',
            WebkitBackfaceVisibility: 'initial',
            WebkitTransformOrigin: '50% 50%',
            '#Boxes_for_Dev rect:not(#S-45-rock-B)': {
              fill: 'transparent',
              stroke: 'transparent',
              display: 'none',
            },
            '#Boxes_for_Dev': {
              '#S-45-rock-B': {
                fill: 'transparent',
                stroke: 'transparent',

                ':hover': {
                  fill: '#f8e9db',
                  cursor: 'pointer',
                },
              },

              // Hombre Taco [Uncomment it when Hombre Taco has an active landing page]
              // '#S-rock-popup-B': {
              //   ':hover': {
              //     fill: '#f8e9db',
              //     cursor: 'pointer',
              //   },
              // },
            },
            // #S-rock-group-C path
            '#Truck_x5F_Frenchette': {
              ':hover': {
                fill: '#f8e9db',
                cursor: 'pointer',
              },
            },

            // Winter Steps [Uncomment it when Winter Steps store has an active landing page]
            // '#S-rock-popup-C': {
            //   rect: {
            //     ':hover': {
            //       fill: '#f8e9db',
            //       cursor: 'pointer',
            //     },
            //   },
            // },

            [`#${store}`]: {
              fill:
                formattedStore in groupedBusinessData
                  ? '#F8E9DB'
                  : 'rgb(255, 255, 255)',
            },

            [selectors]: {
              ':hover': {
                fill: '#f8e9db',
                cursor: 'pointer',
              },
            },

            '#S-rock-popup-A_1_, #S-rock-popup-A': {
              fill: '#f8e9db',
              stroke: 'black',
              cursor: 'pointer',
            },
            '#Text *': {
              pointerEvents: 'none',
            },
            '.clicked': {
              fill: '#f8e9db',
            },
          },
          '.react-transform-component, .react-transform-element': {
            width: 'auto',
            height: 'auto',
            margin: '0 auto',
          },
        }}
        onClick={(event: MouseEvent) => {
          event.preventDefault();
          const target = event.target as SVGElement;

          // Get the store name/id
          const currentStore = target.getAttribute('id');

          // Check whether the clicked element is a store
          // make sure target (store/shape) has a store ID and
          // exists in the list of storeId's we fetch from Sanity CMS
          const isStore =
            currentStore &&
            target.hasAttribute('id') &&
            mapIdList.some((mapId) => currentStore.includes(mapId));

          if (isStore && currentStore) {
            // Format the store so that we can match it with the Modal ID to
            // open the respective modal
            const formattedStore = currentStore.replace(/_[0-9]_/i, '');

            setStore(currentStore);
            setFormattedStore(formattedStore);
            setTimeout(() => {
              openModal(formattedStore);
            }, 0);
          }

          // Special Case for Frenchette Truck
          if (currentStore === 'Truck_x5F_Frenchette') {
            setStore('S-rock-popup-A');
            setFormattedStore('S-rock-popup-A');
            setTimeout(() => {
              openModal('S-rock-popup-A');
            }, 0);
          }
        }}
      >
        <TransformWrapper wheel={{disabled: true}}>
          {({zoomIn, zoomOut}: TransformWrapperProps) => (
            <div sx={{width: '100%', height: '100%'}}>
              <div
                className="tools"
                sx={{
                  position: 'relative',
                }}
              >
                <Flex
                  sx={{
                    alignContent: ['space-evenly', 'space-between'],
                    mx: ['10px', 'none'],
                    p: [2, 3, 4],
                    position: ['fixed', 'fixed', 'relative'],
                    bottom: ['75px', '75px', '0'],
                    width: '90%',
                    zIndex: 2,
                  }}
                >
                  <Select
                    name="mapLevel"
                    onChange={handleChange}
                    bg="white"
                    sx={{
                      border: 'none',
                      p: 2,
                      maxWidth: [200, 250],
                      height: '50px',
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.21)',
                      fontWeight: '400',
                      '#mapType label': {
                        margin: 0,
                      },
                    }}
                    aria-label={'Select Map Level'}
                    id="mapType"
                  >
                    <option value="street">Street Level</option>
                    <option value="concourse">Concourse Level</option>
                  </Select>
                  <Flex
                    mt={2}
                    sx={{
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.21)',
                      height: '50px',
                    }}
                  >
                    <Button
                      variant="icon"
                      sx={{
                        bg: 'white',
                        border: 'none',
                        fontSize: 6,
                        py: 0,
                        m: 0,
                        height: '50px',
                        textAlign: 'center',
                        borderRadius: 0,
                        transition: 'all 0.2s ease',

                        ':hover': {
                          bg: 'accent',
                        },
                      }}
                      onClick={zoomOut}
                      id="zoomOut"
                      aria-label={'Zoom Out'}
                    >
                      <span>-</span>
                    </Button>
                    <Button
                      variant="icon"
                      sx={{
                        bg: 'white',
                        border: 'none',
                        fontSize: 6,
                        py: 0,
                        m: 0,
                        height: '50px',
                        textAlign: 'center',
                        borderRadius: 0,
                        transition: 'all 0.2s ease',

                        ':hover': {
                          bg: 'accent',
                        },
                      }}
                      onClick={zoomIn}
                      id="zoomIn"
                      aria-label={'Zoom In'}
                    >
                      <span>+</span>
                    </Button>
                  </Flex>
                </Flex>
              </div>
              <div className="element">
                <TransformComponent>
                  {mapLevel === 'street' && <StreetLevelMap />}
                  {mapLevel === 'concourse' && <ConcourseLevelMap />}
                </TransformComponent>
              </div>
            </div>
          )}
        </TransformWrapper>
      </Container>
      <ThemeProvider theme={getThemeByName('Rock Center')}>
        {/* Make sure to display the modal when it is not null and
            exists in groupedBusinessData(which is nothing but collection
            of store data) */}
        <Modal
          isOpen={modalId !== null && modalId in groupedBusinessData}
          onClose={closeModal}
        >
          <ModalBusinessMap
            card={
              groupedBusinessData[`${modalId}`]
                ? groupedBusinessData[`${modalId}`][0]
                : {}
            }
            closeModal={closeModal}
          />
        </Modal>
      </ThemeProvider>
    </Section>
  );
};

export default RockefellerCenterMapBlock;
