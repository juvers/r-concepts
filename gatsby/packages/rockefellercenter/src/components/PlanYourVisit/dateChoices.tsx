import add from 'date-fns/add';
import type {DateChoices} from './types';

const choices: DateChoices = {
  today: add(new Date(), {days: 1}),
  'next week': add(new Date(), {days: 7}),
  'next month': add(new Date(), {days: 30}),
  'next year': add(new Date(), {years: 1}),
};

export default choices;
