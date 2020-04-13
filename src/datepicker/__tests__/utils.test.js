/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow
/* eslint-disable import/extensions */
import {
  formatDate,
  isSameMonth,
  isSameYear,
  isSameDay,
  isStartOfMonth,
  isEndOfMonth,
  getWeekdayMinInLocale,
  getWeekdayInLocale,
  getMonthInLocale,
  isOutOfBounds,
  isDayDisabled,
  monthDisabledBefore,
  monthDisabledAfter,
  getEffectiveMinDate,
  getEffectiveMaxDate,
  applyTimeToDate,
  applyDateToTime,
} from '../utils/index.js';
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import min from 'date-fns/min';
import max from 'date-fns/max';
import {es} from 'date-fns/locale/index.js';
import DateHelpers from '../utils/date-helpers';
import adapter from '../utils/date-fns-adapter';
/* eslint-enable import/extensions */
const helpers = new DateHelpers(adapter);

const MIDNIGHT = new Date(2019, 3, 19);
describe('Datepicker utils', () => {
  describe('differenceInCalendarMonths', () => {
    test('should return the difference in calendar months', () => {
      expect(
        helpers.differenceInCalendarMonths(
          new Date(2020, 5, 1),
          new Date(2020, 6, 1),
        ),
      ).toEqual(-1);
      expect(
        helpers.differenceInCalendarMonths(
          new Date(2020, 5, 1),
          new Date(2020, 4, 1),
        ),
      ).toEqual(1);
      expect(
        helpers.differenceInCalendarMonths(
          new Date(2020, 5, 1),
          new Date(2020, 5, 10),
        ),
      ).toEqual(0);
    });
  });
  describe('differenceInCalendarDays', () => {
    test('should return different in calendar days', () => {
      expect(
        helpers.differenceInCalendarDays(
          new Date(2020, 5, 2),
          new Date(2020, 5, 3),
        ),
      ).toEqual(-1);
      expect(
        helpers.differenceInCalendarDays(
          new Date(2020, 5, 2),
          new Date(2020, 5, 1),
        ),
      ).toEqual(1);
      expect(
        helpers.differenceInCalendarDays(
          new Date(2020, 5, 1),
          new Date(2020, 5, 1),
        ),
      ).toEqual(0);
    });
  });
  describe('format', () => {
    test('should format date', () => {
      expect(formatDate(MIDNIGHT, 'yyyy-MM-dd')).toEqual('2019-04-19');
    });
    test('should apply locale to format if provided', () => {
      expect(formatDate(MIDNIGHT, 'MMM', es)).toEqual('abr');
    });
  });
  describe('isSameYear', () => {
    test('should show if dates are same year', () => {
      expect(isSameYear(new Date(2019, 1, 1), new Date(2020, 1, 1))).toEqual(
        false,
      );
      expect(isSameYear(new Date(2019, 1, 1), new Date(2019, 2, 1))).toEqual(
        true,
      );
    });
    test('should return false if either date is falsy', () => {
      expect(isSameYear(null, MIDNIGHT)).toEqual(false);
      expect(isSameYear(MIDNIGHT, null)).toEqual(false);
    });
  });
  describe('isSameMonth', () => {
    test('should show if dates are same month', () => {
      expect(isSameMonth(new Date(2019, 1, 1), new Date(2019, 2, 1))).toEqual(
        false,
      );
      expect(isSameMonth(new Date(2019, 1, 1), new Date(2019, 1, 2))).toEqual(
        true,
      );
    });
    test('should return false if either date is falsy', () => {
      expect(isSameMonth(null, MIDNIGHT)).toEqual(false);
      expect(isSameMonth(MIDNIGHT, null)).toEqual(false);
    });
  });
  describe('isSameDay', () => {
    test('should show if dates are same day', () => {
      expect(isSameDay(new Date(2019, 1, 1), new Date(2019, 1, 2))).toEqual(
        false,
      );
      expect(isSameDay(new Date(2019, 1, 1), new Date(2019, 1, 1))).toEqual(
        true,
      );
    });
    test('should return false if either date is falsy', () => {
      expect(isSameDay(null, MIDNIGHT)).toEqual(false);
      expect(isSameDay(MIDNIGHT, null)).toEqual(false);
    });
  });
  describe('isStartOfMonth', () => {
    test('should show if date is start of month', () => {
      expect(isStartOfMonth(new Date(2019, 1, 2))).toEqual(false);
      expect(isStartOfMonth(new Date(2019, 1, 1))).toEqual(true);
    });
  });
  describe('isEndOfMonth', () => {
    test('should show if date is end of month', () => {
      expect(isEndOfMonth(new Date(2020, 0, 30))).toEqual(false);
      expect(isEndOfMonth(new Date(2020, 0, 31))).toEqual(true);
    });
  });
  describe('getWeekdayMinInLocale', () => {
    test('should get the first letter of the weekday in the provided locale', () => {
      expect(getWeekdayMinInLocale(new Date(2020, 0, 1), es)).toEqual('m');
    });
  });
  describe('getWeekdayInLocale', () => {
    test('should get the weekday name in the provided locale', () => {
      expect(getWeekdayInLocale(new Date(2020, 0, 1), es)).toEqual('miércoles');
    });
  });
  describe('getMonthInLocale', () => {
    test('should get the name of the provided month number in the provided locale', () => {
      expect(getMonthInLocale(0, es)).toEqual('enero');
    });
  });
  describe('isOutOfBounds', () => {
    const minDate = new Date(2020, 0, 2);
    const maxDate = new Date(2020, 0, 4);
    describe('if both minDate and maxDate are provided', () => {
      test('should show if the date is above the max or below the min', () => {
        expect(
          helpers.isOutOfBounds(new Date(2020, 0, 3), {
            minDate,
            maxDate,
          }),
        ).toEqual(false);
        expect(
          helpers.isOutOfBounds(new Date(2020, 0, 5), {
            minDate,
            maxDate,
          }),
        ).toEqual(true);
        expect(
          helpers.isOutOfBounds(new Date(2020, 0, 1), {
            minDate,
            maxDate,
          }),
        ).toEqual(true);
      });
    });
  });
  describe('isDayDisabled', () => {
    const minDate = new Date(2020, 0, 2);
    const maxDate = new Date(2020, 0, 4);
    describe('if maxDate and minDate are provided', () => {
      test('should return true if the date is outside of the max and min', () => {
        expect(
          helpers.isDayDisabled(new Date(2020, 0, 5), {
            minDate,
            maxDate,
            excludeDates: undefined,
            includeDates: undefined,
            filterDate: undefined,
          }),
        ).toEqual(true);
        expect(
          helpers.isDayDisabled(new Date(2020, 0, 3), {
            minDate,
            maxDate,
            excludeDates: undefined,
            includeDates: undefined,
            filterDate: undefined,
          }),
        ).toEqual(false);
      });
    });
    describe('if excludedDates is provided', () => {
      test('should return true if the date is in excludedDates', () => {
        expect(
          helpers.isDayDisabled(new Date(2020, 0, 3), {
            minDate: undefined,
            maxDate: undefined,
            excludeDates: [new Date(2020, 0, 3)],
            includeDates: undefined,
            filterDate: undefined,
          }),
        ).toEqual(true);
        expect(
          helpers.isDayDisabled(new Date(2020, 0, 4), {
            minDate: undefined,
            maxDate: undefined,
            excludeDates: [new Date(2020, 0, 3)],
            includeDates: undefined,
            filterDate: undefined,
          }),
        ).toEqual(false);
      });
    });
    describe('if includedDates is provided', () => {
      test('should return true if the date is not in includedDates', () => {
        expect(
          helpers.isDayDisabled(new Date(2020, 0, 3), {
            minDate: undefined,
            maxDate: undefined,
            excludeDates: undefined,
            includeDates: [new Date(2020, 0, 4)],
            filterDate: undefined,
          }),
        ).toEqual(true);
        expect(
          helpers.isDayDisabled(new Date(2020, 0, 3), {
            minDate: undefined,
            maxDate: undefined,
            excludeDates: undefined,
            includeDates: [new Date(2020, 0, 3)],
            filterDate: undefined,
          }),
        ).toEqual(false);
      });
    });
    describe('if filterDate is provided', () => {
      test('should return true if filterDate returns false', () => {
        expect(
          helpers.isDayDisabled(new Date(2020, 0, 3), {
            minDate: undefined,
            maxDate: undefined,
            excludeDates: undefined,
            includeDates: undefined,
            filterDate: date => {
              return date.getFullYear() === 2019;
            },
          }),
        ).toEqual(true);
        expect(
          helpers.isDayDisabled(new Date(2020, 0, 3), {
            minDate: undefined,
            maxDate: undefined,
            excludeDates: undefined,
            includeDates: undefined,
            filterDate: date => date.getFullYear() === 2020,
          }),
        ).toEqual(false);
      });
    });
  });
  describe('monthDisabledBefore', () => {
    describe('if minDate is provided', () => {
      test('should return true if the minDate falls on a later month than one month before the provided date', () => {
        expect(
          helpers.monthDisabledBefore(new Date(2020, 4, 25), {
            minDate: new Date(2020, 4, 1),
            includeDates: undefined,
          }),
        ).toEqual(true);
        expect(
          helpers.monthDisabledBefore(new Date(2020, 4, 25), {
            minDate: new Date(2020, 3, 25),
            includeDates: undefined,
          }),
        ).toEqual(false);
        expect(
          helpers.monthDisabledBefore(new Date(2020, 4, 25), {
            minDate: new Date(2020, 3, 26),
            includeDates: undefined,
          }),
        ).toEqual(false);
      });
    });
    describe('if includeDates is provided', () => {
      test('should return true if every date in includeDates falls on later month than one month before the provided date', () => {
        expect(
          helpers.monthDisabledBefore(new Date(2020, 4, 25), {
            minDate: undefined,
            includeDates: [new Date(2020, 4, 1), new Date(2020, 4, 2)],
          }),
        ).toEqual(true);
        expect(
          helpers.monthDisabledBefore(new Date(2020, 4, 25), {
            minDate: undefined,
            includeDates: [new Date(2020, 4, 1), new Date(2020, 3, 25)],
          }),
        ).toEqual(false);
      });
    });
  });
});
describe('monthDisabledAfter', () => {
  describe('if maxDate is provided', () => {
    test('should return true if the maxDate falls on a earlier month than one month after the provided date', () => {
      expect(
        helpers.monthDisabledAfter(new Date(2020, 4, 25), {
          maxDate: new Date(2020, 4, 30),
          includeDates: undefined,
        }),
      ).toEqual(true);
      expect(
        helpers.monthDisabledAfter(new Date(2020, 4, 25), {
          maxDate: new Date(2020, 5, 1),
          includeDates: undefined,
        }),
      ).toEqual(false);
      expect(
        helpers.monthDisabledAfter(new Date(2020, 4, 25), {
          maxDate: new Date(2020, 5, 25),
          includeDates: undefined,
        }),
      ).toEqual(false);
    });
  });
  describe('if includeDates is provided', () => {
    test('should return true if every date in includeDates falls on a earlier month than one month after the provided date', () => {
      expect(
        helpers.monthDisabledAfter(new Date(2020, 4, 25), {
          maxDate: undefined,
          includeDates: [new Date(2020, 4, 29), new Date(2020, 4, 30)],
        }),
      ).toEqual(true);
      expect(
        helpers.monthDisabledAfter(new Date(2020, 4, 25), {
          maxDate: undefined,
          includeDates: [new Date(2020, 5, 1), new Date(2020, 4, 30)],
        }),
      ).toEqual(false);
    });
  });
});
describe('getEffectiveMinDate', () => {
  const includeDates = [
    new Date(2020, 0, 1),
    new Date(2020, 0, 2),
    new Date(2020, 0, 3),
  ];
  describe('if only minDate is provider', () => {
    test('should return minDate', () => {
      const minDate = new Date(2020, 4, 25);
      expect(getEffectiveMinDate({minDate})).toEqual(minDate);
    });
  });
  describe('if only includeDates is provided', () => {
    test('should return the earliest includeDate', () => {
      expect(getEffectiveMinDate({includeDates})).toEqual(includeDates[0]);
    });
  });
  describe('if minDate and includeDates are provided', () => {
    test('should return the earliest includeDate thats on or before the minDate', () => {
      expect(
        getEffectiveMinDate({includeDates, minDate: new Date(2020, 0, 2)}),
      ).toEqual(includeDates[1]);
    });
  });
});

describe('getEffectiveMaxDate', () => {
  const includeDates = [
    new Date(2020, 0, 1),
    new Date(2020, 0, 2),
    new Date(2020, 0, 3),
  ];
  describe('if only maxDate is provider', () => {
    test('should return maxDate', () => {
      const maxDate = new Date(2020, 4, 25);
      expect(getEffectiveMaxDate({maxDate})).toEqual(maxDate);
    });
  });
  describe('if only includeDates is provided', () => {
    test('should return the earliest includeDate', () => {
      expect(getEffectiveMaxDate({includeDates})).toEqual(includeDates[2]);
    });
  });
  describe('if maxDate and includeDates are provided', () => {
    test('should return the earliest includeDate thats on or after the maxDate', () => {
      expect(
        getEffectiveMaxDate({includeDates, maxDate: new Date(2020, 0, 2)}),
      ).toEqual(includeDates[1]);
    });
  });
});

describe('applyTimeToDate', () => {
  const time = new Date(2020, 1, 1, 10, 10);
  const date = new Date(2000, 2, 2, 5, 5, 5);
  describe('if date is not provided', () => {
    test('should return the time', () => {
      expect(applyTimeToDate(null, time)).toEqual(time);
    });
  });
  describe('if date is provided', () => {
    test('should apply the hours and minutes of the time to the date, and set the seconds to zero', () => {
      expect(applyTimeToDate(date, time).toISOString()).toEqual(
        '2000-03-02T16:10:00.000Z',
      );
    });
  });
});

describe('applyDateToTime', () => {
  const time = new Date(2020, 1, 1, 10, 10, 10);
  const date = new Date(2000, 2, 2, 5, 5, 5);
  describe('if date is not provided', () => {
    test('should return the time', () => {
      expect(applyDateToTime(null, date)).toEqual(date);
    });
  });
  describe('if date is provided', () => {
    test('should apply the year, month, and day of the date to the time', () => {
      expect(applyDateToTime(time, date).toISOString()).toEqual(
        '2000-03-02T16:10:10.000Z',
      );
    });
  });
  describe('min', () => {
    test('should return the earliest date in the provided array', () => {
      const dates = [
        new Date(2020, 0, 3),
        new Date(2020, 0, 2),
        new Date(2020, 0, 1),
      ];
      expect(helpers.min(dates)).toEqual(dates[2]);
    });
    describe('max', () => {
      test('should return the latest date in the provided array', () => {
        const dates = [
          new Date(2020, 0, 3),
          new Date(2020, 0, 2),
          new Date(2020, 0, 1),
        ];
        expect(max(dates)).toEqual(dates[0]);
      });
    });
  });
});
