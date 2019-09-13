import chrono from 'chrono-node';
import {addDays, mapDayOfWeekCharacter} from './utils';

interface Term {
  year?: number;
  month?: number;
}

interface CourseDetails {
  CRN: number;
  subject: string;
  crse: string;
  section: string;
  cmp: string;
  online: boolean;
  credits: number[];
  name: string;
  days: string[];
  startTime: Date;
  endTime: Date;
  seats: number;
  seatsTaken: number;
  seatsAvailable: number;
  instructor: string;
  startDate: Date;
  endDate: Date;
  fee: number;
  term: Term;
  description?: string;
  semestersOffered?: string[];
  enrollmentRestrictions?: string;
  preReqs?: string;
}

class Course implements CourseDetails {
  CRN: number;

  subject: string;

  crse: string;

  section: string;

  cmp: string;

  online: boolean;

  credits: number[];

  name: string;

  days: string[];

  startTime: Date;

  endTime: Date;

  seats: number;

  seatsTaken: number;

  seatsAvailable: number;

  instructor: string;

  startDate: Date;

  endDate: Date;

  fee: number;

  term: Term;

  description?: string;

  semestersOffered?: string[];

  enrollmentRestrictions?: string;

  preReqs?: string;

  constructor(options: CourseDetails) {
    this.CRN = options.CRN;
    this.subject = options.subject;
    this.crse = options.crse;
    this.section = options.section;
    this.cmp = options.cmp;
    this.online = options.online;
    this.credits = options.credits;
    this.name = options.name;
    this.days = options.days;
    this.startTime = options.startTime;
    this.endTime = options.endTime;
    this.seats = options.seats;
    this.seatsTaken = options.seatsTaken;
    this.seatsAvailable = options.seatsAvailable;
    this.instructor = options.instructor;
    this.startDate = options.startDate;
    this.endDate = options.endDate;
    this.fee = options.fee;
    this.term = options.term;
  }

  /** Get all meeting dates for course. **/
  getMeetingDates(): Date[] {
    let currentWeek = this.startDate;
    let dayCounter = 0;

    const weekInMs = 10080 * 60 * 1000;

    const dates = [];

    while (currentWeek.getTime() + weekInMs < this.endDate.getTime()) {
      const today = mapDayOfWeekCharacter(this.days[dayCounter % this.days.length]);

      // Increment week
      if (dayCounter % this.days.length === 0) {
        currentWeek = addDays(currentWeek, 7);
      }

      dates.push(chrono.parseDate(`${today} ${this.startTime.getUTCHours()}:${this.startTime.getUTCMinutes()}`, currentWeek));

      // Increment day
      dayCounter += 1;
    }

    return dates;
  }
}

export default Course;
