const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const mapDayOfWeekCharacter = (s: string): string => {
  switch (s) {
    case 'M':
      return 'Monday';
    case 'T':
      return 'Tuesday';
    case 'W':
      return 'Wednesday';
    case 'R':
      return 'Thursday';
    case 'F':
      return 'Friday';
    default:
      return '';
  }
};

export {addDays, mapDayOfWeekCharacter};
