import * as cheerio from 'cheerio';
import * as got from 'got';
import * as chrono from 'chrono-node';

import Course from './course';

class Courses {
  courses: Course[];

  private readonly _client: any;

  constructor() {
    this.courses = [];

    this._client = got.extend({
      baseUrl: 'https://www.banweb.mtu.edu/pls/owa'
    });
  }

  async load({term: {year, month}} = {term: {year: new Date().getFullYear(), month: 8}}): Promise<Courses> {
    const termId = `${year}${month.toString().padStart(2, '0')}`;

    const {body} = await this._client.get(`/bzckschd.p_get_crse_unsec?term_in=${termId}&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=&sel_crse=&sel_title=&sel_schd=%25&sel_from_cred=&sel_to_cred=&sel_levl=UG&sel_ptrm=%25&sel_instr=%25&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a`);

    const $ = cheerio.load(body);

    const courses: Course[] = [];

    $('.datadisplaytable tr').each((i: number, e: any) => {
      const attributes = $(e).children('.dddefault, .dddefaultnoprint');

      const CRN = Number(attributes.eq(0).children().eq(0).text().trim());

      // Ignore rows without a CRN
      if (CRN === 0) {
        return;
      }

      const subject: string = attributes.eq(1).text().trim();
      const crse = attributes.eq(2).text().trim();
      const section = attributes.eq(3).text().trim();
      const cmp = attributes.eq(4).text().trim();
      const online = cmp === '1OL';

      const rawCredits = attributes.eq(5).text().trim();

      let credits = [];

      if (rawCredits.includes('-')) {
        credits = rawCredits.split('-').map((credit: string) => Number(credit));
      } else {
        credits = [Number(rawCredits)];
      }

      const name = attributes.eq(6).text().trim();
      const days = attributes.eq(7).text().trim();

      const [startTime, endTime] = attributes.eq(8).text().trim().split('-');

      const seats = Number(attributes.eq(9).text().trim());
      const seatsTaken = Number(attributes.eq(10).text().trim());
      const seatsAvailable = Number(attributes.eq(11).text().trim());
      const instructor = attributes.eq(12).text().trim();

      const [startDate, endDate] = attributes.eq(13).text().trim().split('-');

      const potentialFee = attributes.eq(15).text().trim();

      let fee = 0;

      if (potentialFee.includes('$')) {
        fee = potentialFee.match(/\d+(?:\.\d+)?/g)!.reduce((accum, fee) => {
          return accum + (Number(fee) * 100); // Cents
        }, 0);
      }

      const details: any = {
        CRN,
        subject,
        crse,
        section,
        cmp,
        online,
        credits,
        name,
        days,
        startTime,
        endTime,
        seats,
        seatsTaken,
        seatsAvailable,
        instructor,
        startDate,
        endDate,
        fee,
        term: {year, month}
      };

      // Remove undefined / empty properties
      for (const attribute in details) {
        if (Object.prototype.hasOwnProperty.call(details, attribute)) {
          const value = details[attribute];

          if (value === 'TBA' || value === undefined || value === '') {
            delete details[attribute];
          }
        }
      }

      // Format times and dates
      if (details.startTime) {
        details.startTime = chrono.parseDate(details.startTime);
      }

      if (details.endTime) {
        details.endTime = chrono.parseDate(details.endTime);
      }

      if (details.startDate) {
        details.startDate = new Date(`${details.startDate}/${year.toString()}`);
      }

      if (details.endDate) {
        details.endDate = new Date(`${details.endDate}/${year.toString()}`);
      }

      // Days offered should be an Array
      if (details.days) {
        details.days = details.days.split('');
      }

      courses.push(new Course(details));
    });

    this.courses = courses;

    return this;
  }
}

module.exports = Courses;
