import type {FluidObject} from 'gatsby-image';
import type {Block} from '@sanity/block-content-to-react';

interface SanityImageAsset {
  fluid: FluidObject;
}

export interface SanityImage {
  alt?: string;
  asset: SanityImageAsset;
}

export interface TicketCategoryFeature {
  id: string | number;
  order: number | null;
  description: Block | Block[];
  category: {id: number};
}

export interface SanitySlug {
  current: string;
}

export interface SanityTitleAndSlug {
  title: string;
  slug: SanitySlug;
}

export interface Ticket {
  id: string | number;
  image: SanityImage;
  description: Block | Block[];
  price: string;
  url: {url: string};
  title: string;
  alt: string;
  includedFeatures: TicketCategoryFeature[];
}

export interface TicketCard extends Ticket {
  allFeatures: TicketCategoryFeature[];
  openFeaturesList: boolean;
}

export interface TicketCategory {
  id: string | number;
  titleAndSlug: SanityTitleAndSlug;
  tickets: Ticket[];
  description: Block | Block[];
  order: number;
}

export interface BuyTicketsProps {
  allFeatures: Record<string, TicketCategoryFeature[]>;
  allCategories: TicketCategory[];
}

export type BuyTicketsData =
  | GatsbyTypes.BuyTicketsC3Query
  | GatsbyTypes.BuyTicketsTorQuery
  | GatsbyTypes.BuyTicketsVipQuery
  | GatsbyTypes.BuyTicketsTourQuery
  | GatsbyTypes.BuyTicketsRockPassQuery
  | GatsbyTypes.BuyTicketsCityPassQuery
  | GatsbyTypes.BuyTicketsCityPassRedemptionQuery
  | GatsbyTypes.BuyTicketsCityPassRefundsQuery;

export interface BuyTicketsPage {
  data: BuyTicketsData;
  currentStep: number;
  skipToBilling?: boolean;
}

export type TicketType = {
  TicketCount: number;
  TicketTypeId: number;
  TicketLabel: string;
};

export type PackageType = {
  PackageCount: number;
  PackageTypeId: number;
};

export type BookletType = {
  BookletCount: number;
  TicketTypeId: number;
};

export interface FutureCapacityForecast {
  Date: string;
  Attraction: number;
  AvailableCapacity: number;
  TotalCapacity: number;
}

export interface CityPassType {
  CityPassBarcode: string;
  ExpirationDate: string;
  TicketStatus: number;
  TicketTypeId: number;
  ValidationMessage: string;
}

export type Tickets = PackageType & TicketType;
