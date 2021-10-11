// @ts-check
// FIXME: Why is this reference path necessary
// to get eslint to find these generated types?
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./__generated__/gatsby-types.d.ts" />

/** @typedef {import('gatsby').Page} Page */
/** @typedef {import('gatsby').Node} Node */
/** @typedef {import('gatsby').CreatePagesArgs} CreatePagesArgs */
/** @typedef {import('gatsby').CreatePageArgs} CreatePageArgs */
/** @typedef {import('gatsby').CreateNodeArgs<Node>} CreateNodeArgs */
/** @typedef {import('gatsby').CreateSchemaCustomizationArgs} CreateSchemaCustomizationArgs*/
/** @typedef {{pages: Map<string, Page>}} GatsbyState */
/** @typedef {import('gatsby').Store & {getState(): GatsbyState}} GatsbyStore */
/**
 * @typedef {import('gatsby').CreateResolversArgs & {
 *   intermediateSchema: import('graphql').GraphQLSchema
 * }} CreateResolversArgs
 */

const path = require('path');
const {promisify} = require('util');
const {readFile} = require('fs').promises;
const chokidar = require('chokidar');
const minimatch = require('minimatch');
const updatePageConfig = require('./updatePageConfig');
const createFieldExtensions = require('./createFieldExtensions');
const createImageResolvers = require('./createImageResolvers');
const {default: slugify} = require('slugify');

const glob = promisify(require('glob'));
const exec = promisify(require('child_process').exec);
const {addMonths, format, eachMonthOfInterval} = require('date-fns');
const {getEventDetailUri} = require('./src/blocks/utils/getEventDetailUri');
const {getStoryDetailUri} = require('./src/blocks/utils/getStoryDetailUri');

/** A glob pattern that finds pages that might export page configuration. */
const configurablePageGlob = 'src/{pages,templates}/**/*.+(t|j)s?(x)';

/**
 * A map of page component paths to the set of page paths using the component.
 *
 * @type {Map<string, Set<string>>}
 */
const configurablePages = new Map();

/**
 * Get Event Month Page Context
 *
 * This function is used in two createPage funcs below
 *
 * Calendar - an array of months in order of earliest to latest.
 * This is based on todays date so it will continueally be changing
 *
 * eventMonth - the current month formatted to use in our graphql query. 'yyyy-MM'
 *
 * month - the current month (also matches slug of page)
 *
 * year - the current year
 *
 * @param {Date} date
 * @param {Date[]} eventMonthRange
 */
const getEventMonthPageContext = (date, eventMonthRange) => {
  return {
    calendar: eventMonthRange.map((month) =>
      format(month, 'MMMM').toLowerCase(),
    ),
    eventMonth: [format(date, 'yyyy-MM')],
    month: format(date, 'MMMM').toLowerCase(),
    year: format(date, 'yyyy'),
  };
};
/** @param {CreatePagesArgs} args */
exports.createPages = async ({graphql, actions, reporter}) => {
  const {createPage, createRedirect} = actions;
  const fs = require('fs');
  /**
   * @type {{
   *   data?: GatsbyTypes.Query & {
   *     allSanityRedirect: GatsbyTypes.Query['allSanityRedirect'];
   *   };
   *   errors?: unknown
   * }}
   */
  const redirectResults = await graphql(`
    {
      allSanityRedirect {
        nodes {
          source
          target
          statusCode
        }
      }
    }
  `);

  /**
   * @param {{ source: string; target: string; statusCode: string; }} redirect
   */
  fs.unlink('public/_redirects', function (err) {
    if (err && err.code == 'ENOENT') {
      // file doesn't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error('Error occurred while trying to remove file');
    } else {
      console.info(`removed`);
    }
  });
  if (redirectResults && redirectResults.data) {
    redirectResults.data.allSanityRedirect.nodes.forEach((redirect) => {
      createRedirect({
        fromPath: redirect.source.replace(/\s+/g, ''),
        toPath: redirect.target.replace(/\s+/g, ''),
        statusCode: Number(redirect.statusCode.replace(/[^0-9]/g, '')),
        force: true,
      });
    });
  }
  /**
   * @type {{
   *   data?: GatsbyTypes.Query & {
   *     amenityData: GatsbyTypes.Query['allSanityBusiness'];
   *     dineData: GatsbyTypes.Query['allSanityBusiness'];
   *     shopData: GatsbyTypes.Query['allSanityBusiness'];
   *     executiveData: GatsbyTypes.Query['allSanityExecutive'];
   *   };
   *   errors?: unknown
   * }}
   */
  const result = await graphql(`
    query Pages {
      allSanityEvent {
        nodes {
          id
          type: _type
          titleAndSlug {
            slug {
              current
            }
            title
          }
        }
      }
      amenityData: allSanityBusiness(
        filter: {category: {category: {eq: "amenity"}}}
      ) {
        nodes {
          id
          titleAndSlug {
            slug {
              current
            }
            title
          }
        }
      }
      dineData: allSanityBusiness(
        filter: {category: {category: {eq: "dine"}}}
      ) {
        nodes {
          id
          titleAndSlug {
            slug {
              current
            }
            title
          }
        }
      }
      shopData: allSanityBusiness(
        filter: {category: {category: {eq: "shop"}}}
      ) {
        nodes {
          id
          titleAndSlug {
            slug {
              current
            }
            title
          }
        }
      }
      allSanityArt {
        nodes {
          id
          titleAndSlug {
            slug {
              current
            }
            title
          }
        }
      }
      allSanityStory {
        nodes {
          id
          titleAndSlug {
            slug {
              current
            }
            title
          }
          category
        }
      }

      allSanityEventVirtual {
        nodes {
          id
          titleAndSlug {
            slug {
              current
            }
            title
          }
        }
      }

      executiveData: allSanityExecutive {
        nodes {
          _rawBio
          id
          title
          name
          image {
            alt
            asset {
              fluid {
                src
              }
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    throw result.errors;
  }

  const events = result.data ? result.data.allSanityEvent.nodes : [];
  events.forEach((node) => {
    const slug = node.titleAndSlug.slug.current;
    if (!slug) {
      reporter.warn(
        `No slug defined for event titled ${node.titleAndSlug.title}`,
      );
      return;
    }

    const path = getEventDetailUri(node);
    createPage({
      path,
      component: require.resolve('./src/templates/event.tsx'),
      context: {sanityID: node.id},
    });
  });

  const art = result.data ? result.data.allSanityArt.nodes : [];
  art.forEach((node) => {
    const slug = node.titleAndSlug.slug.current;
    if (!slug) {
      reporter.warn(
        `No slug defined for art titled ${node.titleAndSlug.title}`,
      );
      return;
    }
    const path = `/art/${slug}`;
    createPage({
      path,
      component: require.resolve('./src/templates/art-detail.tsx'),
      context: {sanityID: node.id},
    });
  });

  const amenities = result.data ? result.data.amenityData.nodes : [];
  amenities.forEach((node) => {
    const slug = node.titleAndSlug.slug.current;
    if (!slug) {
      reporter.warn(
        `No slug defined for event titled ${node.titleAndSlug.title}`,
      );
      return;
    }

    const path = `/amenities/${slug}`;
    createPage({
      path,
      component: require.resolve('./src/templates/business.tsx'),
      context: {
        sanityID: node.id,
        theme: 'The Rink Navy',
        pageName: 'Amenity',
      },
    });
  });

  const diners = result.data ? result.data.dineData.nodes : [];
  diners.forEach((node) => {
    const slug = node.titleAndSlug.slug.current;
    if (!slug) {
      reporter.warn(
        `No slug defined for event titled ${node.titleAndSlug.title}`,
      );
      return;
    }

    const path = `/dine/${slug}`;
    createPage({
      path,
      component: require.resolve('./src/templates/business.tsx'),
      context: {
        sanityID: node.id,
        theme: 'Rock Center Cream',
        pageName: 'Dine',
      },
    });
  });

  const shops = result.data ? result.data.shopData.nodes : [];
  shops.forEach((node) => {
    const slug = node.titleAndSlug.slug.current;
    if (!slug) {
      reporter.warn(
        `No slug defined for event titled ${node.titleAndSlug.title}`,
      );
      return;
    }

    const path = `/shops/${slug}`;
    createPage({
      path,
      component: require.resolve('./src/templates/business.tsx'),
      context: {
        sanityID: node.id,
        theme: 'Rock Center Green',
        pageName: 'Shop',
      },
    });
  });

  const stories = result.data ? result.data.allSanityStory.nodes : [];
  stories.forEach((node) => {
    const slug = node.titleAndSlug.slug.current;
    const category = node.category;
    if (!slug) {
      reporter.warn(
        `No slug defined for story titled ${node.titleAndSlug.title}`,
      );
      return;
    }
    if (!category) {
      reporter.warn(`No category defined for story titled ${node.category}`);
      return;
    }
    const path = getStoryDetailUri(node);
    createPage({
      path,
      component: require.resolve('./src/templates/story.tsx'),
      context: {sanityID: node.id},
    });
  });

  const executives = result.data ? result.data.executiveData.nodes : [];
  executives.forEach((node) => {
    const name = node.name;
    if (!name) {
      reporter.warn(`Executive ${node.id} is missing a name!`);
      return;
    }
    const path = `/executive-team/${slugify(name, {
      lower: true,
      remove: /\W\B/,
    })}`;
    createPage({
      path,
      component: require.resolve('./src/templates/executive-team-detail.tsx'),
      context: {
        sanityID: node.id,
        theme: 'Rock Center',
        pageName: '',
      },
    });
  });

  const virtualEvents = result.data
    ? result.data.allSanityEventVirtual.nodes
    : [];
  virtualEvents.forEach((node) => {
    const slug = node.titleAndSlug.slug.current;
    if (!slug) {
      reporter.warn(
        `No slug defined for virtual event titled ${node.titleAndSlug.title}`,
      );
      return;
    }
    createPage({
      path: `${slug}`,
      component: require.resolve('./src/templates/virtual-events.tsx'),
      context: {
        sanityID: node.id,
        theme: 'Rock Center',
        slug,
      },
    });
  });

  // Using date-fns we take today's date, and create an array of Date types
  // currently start = last month, end = 11 months in the future.
  // creating a 12 month calendar
  const eventMonthRange = eachMonthOfInterval({
    start: addMonths(new Date(), -1),
    end: addMonths(new Date(), 10),
  });

  eventMonthRange.map((month) => {
    const context = getEventMonthPageContext(month, eventMonthRange);
    createPage({
      path: `/events/${context.month.toLowerCase()}`,
      component: require.resolve('./src/templates/event-month.tsx'),
      context,
    });
  });

  // Lastly this creates the generic /events page that will always be based
  // on today's date keeping it always current.
  // another possibility is creating a cononical redirect that points to
  // the current month instead of creating a new page that is a copy of
  // the current months page.
  const context = getEventMonthPageContext(new Date(), eventMonthRange);
  createPage({
    path: '/events',
    component: require.resolve('./src/templates/event-month.tsx'),
    context,
  });
};

/** @param {CreatePageArgs} args */
exports.onCreatePage = async ({page, actions, reporter}) => {
  const componentPath = path.relative(__dirname, page.component);
  // If this page is configurable,
  // update its context with any exported configuration.
  if (!minimatch(componentPath, configurablePageGlob)) {
    reporter.verbose(
      `[pageConfig] Skipping unsupported file:\n${componentPath}`,
    );
    return;
  }
  /** @type {Set<string>} */
  const pageSet = configurablePages.get(componentPath) || new Set();
  pageSet.add(page.path);
  configurablePages.set(componentPath, pageSet);
  await updatePageConfig(page, actions, reporter);
};

/** @param {CreatePagesArgs} args */
exports.createPagesStatefully = ({store, actions, reporter}) => {
  // In dev, watch configurable page files for changes
  // and update page contexts with configuration changes.
  if (process.env.NODE_ENV === 'production') return;
  return new Promise((/** @type {(v: void) => void} */ resolve) => {
    chokidar
      .watch(configurablePageGlob, {cwd: __dirname})
      .on('change', (filepath) => {
        const pagesToUpdate = configurablePages.get(filepath);
        if (pagesToUpdate && pagesToUpdate.size) {
          const pages = /** @type {GatsbyStore} */ (store).getState().pages;
          pagesToUpdate.forEach((pagePath) => {
            const page = pages.get(pagePath);
            if (page) {
              void updatePageConfig(page, actions, reporter);
            } else {
              reporter.panicOnBuild(
                `[pageConfig] Could not find page for ${pagePath}!`,
              );
            }
          });
        } else {
          reporter.verbose(`[pageConfig] Ignoring change in: \n${filepath}`);
        }
      })
      .on('ready', () => {
        reporter.verbose(`[pageConfig] Watching for configuration changes`);
        resolve();
      });
  });
};

/** @param {CreateNodeArgs} args */
exports.onCreateNode = ({node, actions, createNodeId, getNode}) => {
  // Create an `Image` node for every `ImageSharp` node.
  // These nodes back the `Image` schema type.
  // See `createSchemaCustomization` for more.
  if (node.internal.type === 'ImageSharp') {
    // Get the parent `File` node.
    const parent = /** @type {import('gatsby').Node} */ (getNode(node.parent));
    if (!parent || parent.internal.type !== 'File') {
      // This probably isn't possible, since `ImageSharp` types
      // are automatically created as children of `File` types,
      // but you never know?
      return;
    }
    actions.createNode({
      id: createNodeId(`${parent.id} >> Image`),
      parent: parent.id,
      internal: {
        type: 'Image',
        mediaType: parent.internal.mediaType,
        description: parent.internal.description,
        content: parent.internal.content,
        contentDigest: parent.internal.contentDigest,
      },
    });
  }
};

/** @param {CreateSchemaCustomizationArgs} args */
exports.createSchemaCustomization = async (args) => {
  const {actions, reporter, schema} = args;
  createFieldExtensions(args);

  // Create types from generated Sanity schema definitions.
  const {stdout, stderr} = await exec(
    'node ../../scripts/generate-sanity-schema.js',
    {
      env: process.env,
    },
  );
  if (stderr) reporter.error(stderr);
  if (stdout) actions.createTypes(stdout);

  // Create types from schema definitions in ~schema and ~data.
  const schemaFiles = await glob('./src/{data,schema}/**/*.graphql');
  await Promise.all(
    schemaFiles.map(async (filename) => {
      actions.createTypes(String(await readFile(filename)));
    }),
  );
  // For all sanity events, we need to know which
  // month templates they should be included in.
  // This can be tricky because ongoing events can span an entire year
  // this bit of code is adding a new field called eventMonths to the
  // SanityEvent node. using date-fns this gets the event month range
  // and formats it in an easy to read format
  // example = ['2020-10', '2020-11', '2020-12', '2021-01']
  // above in createPages function we are generating 12 calendar pages
  // then we can set up a query that gets all the events included in
  // that month.
  actions.createTypes([
    schema.buildObjectType({
      name: 'SanityEvent',
      interfaces: ['Node'],
      fields: {
        type: {
          type: 'String!',
          /**
           * @param {{ type: string | undefined }} source
           */
          resolve: (source) => {
            return source.type;
          },
        },
        eventMonths: {
          type: ['String'],
          /**
           * @param {{ startEndDateTime: { startDateTime: string | number | Date; endDateTime: string | number | Date; }; }} source
           */
          resolve: (source) => {
            const eventMonthRange = eachMonthOfInterval({
              start: new Date(source.startEndDateTime.startDateTime),
              end: new Date(source.startEndDateTime.endDateTime),
            });
            return eventMonthRange.map((month) => format(month, 'yyyy-MM'));
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'SanityEventTreeLighting',
      interfaces: ['Node'],
      fields: {
        type: {
          type: 'String!',
          /**
           * @param {{ type: string | undefined }} source
           */
          resolve: (source) => {
            return source.type;
          },
        },
        eventMonths: {
          type: ['String'],
          /**
           * @param {{ startEndDateTime: { startDateTime: string | number | Date; endDateTime: string | number | Date; }; }} source
           */
          resolve: (source) => {
            const eventMonthRange = eachMonthOfInterval({
              start: new Date(source.startEndDateTime.startDateTime),
              end: new Date(source.startEndDateTime.endDateTime),
            });
            return eventMonthRange.map((month) => format(month, 'yyyy-MM'));
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'SanityEventVirtual',
      interfaces: ['Node'],
      fields: {
        type: {
          type: 'String!',
          /**
           * @param {{ type: string | undefined }} source
           */
          resolve: (source) => {
            return source.type;
          },
        },
        eventMonths: {
          type: ['String'],
          /**
           * @param {{ startEndDateTime: { startDateTime: string | number | Date; endDateTime: string | number | Date; }; }} source
           */
          resolve: (source) => {
            const eventMonthRange = eachMonthOfInterval({
              start: new Date(source.startEndDateTime.startDateTime),
              end: new Date(source.startEndDateTime.endDateTime),
            });
            return eventMonthRange.map((month) => format(month, 'yyyy-MM'));
          },
        },
      },
    }),
  ]);
};

/** @param {CreateResolversArgs} args */
exports.createResolvers = (args) => {
  createImageResolvers(args);
};
