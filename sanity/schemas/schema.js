// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// Then import schema types from schemas
import site from "./site";

// Shared types
import metaSEO from "./objects/metaSEO";
import imageGallery from "./objects/imageGallery";
import { gallery } from "./objects/gallery";
import { imageType, imageTypeSide } from "./objects/image";
import fileType from "./objects/fileType";
import { videoType, ambientVideoType } from "./objects/video";
import { imageContentsBlock } from "./objects/imageContentsBlock";
import { simpleRichtext, fullRichtext, maxRichtext } from "./objects/richtext";
import { titleAndSlug } from "./objects/titleAndSlug";
import dayAndTime from "./objects/dayAndTime";
import youtube from "./objects/youtube";
import vimeo from "./objects/vimeo";
import { faq, faqItem } from "./objects/faq";
import { cta, ctaCard } from "./objects/cta";
import { contactInfo } from "./objects/contactInfo";
import { sponsor } from "./objects/sponsor";
import { category } from "./objects/category";
import { quote } from "./objects/quote";
import { titlePlainBodyType } from "./objects/titlePlainBody";
import { hoursAndtext } from "./objects/hoursAndText";
import { startEndDateTime } from "./objects/startEndDateTime";
import { tripadvisorReview } from "./objects/tripadvisorReview";
import { urlType } from "./objects/urlType";
import { attractionType, onlyHere, linkType } from "./objects/attractionType";
import { flexSpace, space } from "./objects/flexSpace";
import { alert } from "./objects/alert";
import {
  featuredRetailer,
  featuredRetailerType,
} from "./objects/featuredRetailerType";
import { eventCtaUrlType } from "./objects/eventCtaUrlType";

import siteSettngs from "./site";
//document types
import { eventLP } from "./documents/event/eventLP";
import {
  event,
  treeLightingEvent,
  virtualEvent,
  subnavItem
} from "./documents/event/detail";
import { business, businessDirectoryPage } from "./documents/business";
import { story, storyLP } from "./documents/story";
import { cultureLP, gessoAudioTour } from "./documents/cultureLP";
import { communityLP } from "./documents/communityLP";
import { offer, offerLP } from "./documents/offer";

import {
  attractionRink,
  attractionTor,
  attractionHoliday,
  attractionEvent,
  attractionRainbow,
  attractionRc,
  attractionWedding,
  attractionBar,
  attractionEventVenue,
  attractionOnlyHere,
} from "./documents/attraction";
import { podcastSource, podcast, podcastLP } from "./documents/podcast";
import { location } from "./documents/location";
import { artAuthor, art, artLP } from "./documents/art";
import { newsPress } from "./documents/newsPress";
import { executive } from "./documents/executive";
import { direction, directionItem } from "./objects/direction";
import { directions } from "./documents/directions";
import { generalFaqs } from "./documents/generalFaqs";
import { floorPlan, capacityOption } from "./objects/floorPlan";
import { sampleMenu } from "./objects/sampleMenu";
import { reservation } from "./objects/reservation";
import { homePage } from "./documents/homePage";
import { rockListLP } from "./documents/rockListLP";
import { vendor } from "./objects/vendor";
import { redirect } from "./documents/redirect";
import {
  ticketCategory,
  ticket,
  ticketCategoryFeature,
} from "./documents/tickets";
import { liveEventCard, liveEvents } from "./objects/liveEvents";
import { recordedContent, recordedItem } from "./objects/recordedContent";
// import faq from "./documents/faq/detail";
import { calloutGridCard } from "./objects/calloutGridCard";
import { fullWidthCalloutGridCard } from "./objects/fullWidthCalloutGridCard";
import { imageOrVideoType } from "./objects/imageOrVideo";

// Then we give our schema to the builder and provide the result to Sanity
const culture = [
  cultureLP,
  story,
  storyLP,
  artAuthor,
  art,
  artLP,
  newsPress,
  offer,
  offerLP,
  gessoAudioTour,
];
const community = [
  communityLP,
  eventLP,
  event,
  treeLightingEvent,
  virtualEvent,
  subnavItem,
];

export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* Document types*/
    homePage,
    podcast,
    podcastLP,
    business,
    businessDirectoryPage,
    attractionBar,
    attractionRink,
    attractionTor,
    attractionHoliday,
    attractionRc,
    attractionWedding,
    attractionRainbow,
    attractionEvent,
    attractionEventVenue,
    attractionOnlyHere,
    siteSettngs,
    executive,
    location,
    generalFaqs,
    ...community,
    ...culture,
    rockListLP,
    redirect,
    /* Object types */
    cta,
    faq,
    faqItem,
    fileType,
    dayAndTime,
    titleAndSlug,
    simpleRichtext,
    fullRichtext,
    maxRichtext,
    metaSEO,
    imageType,
    imageTypeSide,
    videoType,
    ambientVideoType,
    imageGallery,
    gallery,
    youtube,
    vimeo,
    contactInfo,
    podcastSource,
    sponsor,
    category,
    imageContentsBlock,
    quote,
    titlePlainBodyType,
    hoursAndtext,
    startEndDateTime,
    tripadvisorReview,
    urlType,
    floorPlan,
    sampleMenu,
    reservation,
    capacityOption,
    vendor,
    ticketCategory,
    ticket,
    ticketCategoryFeature,
    attractionType,
    onlyHere,
    linkType,
    directionItem,
    direction,
    directions,
    flexSpace,
    space,
    alert,
    liveEventCard,
    liveEvents,
    recordedItem,
    recordedContent,
    featuredRetailer,
    featuredRetailerType,
    eventCtaUrlType,
    ctaCard,
    calloutGridCard,
    fullWidthCalloutGridCard,
    imageOrVideoType,
  ]),
});
