import {I18n} from '~buy-tickets/models/interface';
import {TStringString} from '~buy-tickets/models/types';

export const endPoints: TStringString = {
  Status: 'Status',
  SystemVariable: 'SystemVariable',
  Notification: 'Notification',
  TicketType: 'TicketType',
  PackageType: 'PackageType',
  Country: 'Country',
  State: 'State',
  ExitAnswer: 'ExitAnswer',
  FutureCapacityForecast: 'FutureCapacityForecast',
};

export const I18N: I18n = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  weekdays: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

export enum TishmanAttraction {
  TopOfTheRockObservationDeck = 1,
  RockefellerCenterTour = 2,
}

export enum TishmanFlow {
  DECK = 'DECK',
  TOUR = 'TOUR',
  VIP = 'VIP',
  ROCK_PASS = 'ROCK_PASS',
  CITY_PASS = 'CITY_PASS',
  C3 = 'C3',
  REFUND = 'REFUND',
  REDEMPTION = 'REDEMPTION',
}

export const SUNSET_ADD_ON_PRICE = 10;

interface Map {
  [key: string]: string | undefined;
}

export const CreditCardTypes: Map = {
  Unknown: '-1',
  Visa: '1',
  MasterCard: '2',
  AmericanExpress: '3',
  Discover: '4',
  DinersClub: '5',
};

export const RefundErrorMessages = [
  {reason: 1, message: 'Barcode not found'},
  {reason: 2, message: 'Cardholder details do not match'},
  {reason: 3, message: 'Sale has expired'},
  {reason: 4, message: 'Sale has been refunded'},
  {reason: 5, message: 'Sale has been reissued'},
  {reason: 6, message: 'Sale has been cancelled'},
  {reason: 7, message: `Tickets have been used`},
  {reason: 8, message: 'Timeslot is too near'},
  {reason: 9, message: 'No valid tickets'},
  {reason: 10, message: 'Sale Is Exclusive'},
  {reason: 11, message: 'CityPass Booklet Sale'},
  {reason: 12, message: 'Sale contains CityPass Tickets'},
];

export const standardError = {
  message:
    'We are experiencing technical difficulties and online ticket purchasing is currently unavailable. Please try again later today, visit our Box Office located on 50th Street between 5th and 6th Avenues, or call Customer Service at (212) 698-2000.',
  name: 'Oh, no!',
};
