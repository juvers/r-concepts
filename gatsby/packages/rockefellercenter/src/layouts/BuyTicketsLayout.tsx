/** @jsx jsx */
import {jsx, ThemeProvider, getThemeByName} from '@tishman/components';
import {format} from 'date-fns';
import type {ComponentPropsWithoutRef} from 'react';
import type {TishmanThemeName} from '@tishman/components';
import {forkJoin} from 'rxjs';
import {useEffect} from 'react';
import {getItem$} from '~buy-tickets/services/http-client';
import systemVariableStore from '~buy-tickets/store/odt/systemVariableStore';
import statusStore from '~buy-tickets/store/odt/statusStore';
import ticketTypesStore from '~buy-tickets/store/odt/ticketTypesStore';
import dateService from '~buy-tickets/services/date-service';
import userStore from '~buy-tickets/store/user/userStore';
export interface LayoutProps extends ComponentPropsWithoutRef<'main'> {
  theme?: TishmanThemeName;
  /** An optional map of styled components to use for rich text, etc. */
  components?: ComponentPropsWithoutRef<typeof ThemeProvider>['components'];
}

const {getEasternTime} = dateService();

export function BuyTicketsLayout({
  theme,
  components,
  children,
  sx: withSx,
  ...props
}: LayoutProps): JSX.Element {
  useEffect(() => {
    const sub = forkJoin({
      status_data: getItem$('Status'),
      system_variable_data: getItem$('SystemVariable'),
      ticket_type_data: getItem$(
        `TicketType?EffectiveDateTime=${format(
          new Date(getEasternTime),
          'yyyy-MM-dd',
        )}`,
      ),
      package_type_data: getItem$(
        `PackageType?EffectiveDateTime=${format(
          new Date(getEasternTime),
          'yyyy-MM-dd',
        )}`,
      ),
    }).subscribe(
      ({
        status_data,
        system_variable_data,
        ticket_type_data,
        package_type_data,
      }) => {
        statusStore.sendData(status_data);
        systemVariableStore.sendData(system_variable_data);
        ticketTypesStore.sendData({TicketTypes: ticket_type_data});
        ticketTypesStore.sendData({PackageTypes: package_type_data});
        userStore.sendData({loading: false});
        window.dataLayer.push({
          event: 'Page Load',
          Step: '1: Ticket Quantity',
          Referrer: document.referrer || null,
          PageName: location.pathname,
          UTC: new Date().toUTCString(),
          Error: null,
          FromStep: document.referrer || null,
        });
      },
      (error) => {
        console.log(error);
        window.dataLayer.push({
          event: 'Page Load',
          Step: '1: Ticket Quantity',
          Referrer: document.referrer || null,
          PageName: location.pathname,
          UTC: new Date().toUTCString(),
          Error: JSON.stringify(error),
          FromStep: document.referrer || null,
        });
      },
    );
    return () => sub.unsubscribe();
  }, []);

  if (theme || components) {
    return (
      <ThemeProvider
        theme={theme ? getThemeByName(theme) : {}}
        components={components}
      >
        <main sx={withSx} {...props}>
          {children}
        </main>
      </ThemeProvider>
    );
  } else {
    return (
      <main sx={withSx} {...props}>
        {children}
      </main>
    );
  }
}
