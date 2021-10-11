import type {FluidObject} from 'gatsby-image';

export interface ImageProps {
  alt: string;
  src: {
    childImageSharp: {
      fluid: FluidObject;
    };
  };
}

export interface Business {
  id: string;
  poster: {
    asset: {
      fluid: FluidObject;
    };
  };
  titleAndSlug: {
    title: string;
    slug: {
      current: string;
    };
  };
  category: {
    category: string;
    subCategory: string[];
  };
}

export interface Time {
  end: string;
  start: string;
}

export interface Event {
  id: string;
  titleAndSlug: {
    title: string;
    slug: {
      current: string;
    };
  };
  category: string;
  location: {
    title: string;
  };
  formattedTime: Time;
  rawTime: Time;
  photo: {
    asset: {
      fluid: FluidObject;
    };
  };
}

/*
 * A map of selection strings to the end date from today
 * that will make up the range for testing whether a date
 * falls between today and that date
 */
export interface DateChoices {
  [key: string]: Date;
}

export interface EventCategory {
  id: string;
  category: string;
}

export interface BusinessCategory {
  id: string;
  category: {
    category: string;
    subCategory: string[];
  };
}

export type Category = EventCategory | BusinessCategory;
