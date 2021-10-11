export interface I18n {
  previousMonth: string;
  nextMonth: string;
  months: string[];
  weekdays: string[];
  weekdaysShort: string[];
}
export interface IPickerProps {
  cursor: Date;
  weekStart: number;
  renderDay: (date: Date) => JSX.Element;
  renderHeader: () => JSX.Element;
  renderAbbreviations: () => JSX.Element;
}

export interface IDayProps {
  day: Date;
  date: Date;
  cursor: Date;
  onChange: (date: Date) => void;
  onCursorChange: (date: Date) => void;
}

export interface IAbbreviationsProps {
  i18n: I18n;
  weekStart: number;
}

export interface IHeaderProps {
  i18n: I18n;
  cursor: Date;
  prevMonthClick: (e: React.MouseEvent<HTMLElement>) => void;
  nextMonthClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface IMainProps {
  i18n: I18n;
}
export interface IMainState {
  date: Date;
  cursor: Date;
  weekStart: number;
}

export interface IAvailableCapacity {
  Attraction: number;
  AvailableCapacity: number;
  Date: string;
  TotalCapacity: number;
}

export interface ISystemVariables {
  Description: string;
  Name: string;
  SystemVariableId: number;
  Type: string;
  Value: string;
}

export interface INotification {
  Body: string;
  FromDate: string;
  FromTime: string;
  Header: string;
  ImageType: string | null;
  ImageUrl: string | null;
  IsActive: boolean;
  Link: string;
  NotificationId: number;
  NotificationText: string;
  ToDate: string;
  ToTime: string;
}
