# 🏛 mtu-courses

Scrape all courses for a given semester from Michigan Tech's website.

## Install

`npm i mtu-courses`

## Quickstart

```javascript
const Courses = require('mtu-courses');

(async () => {
  const mtu = new Courses();

  await mtu.load();

  // Get all meeting dates for first loaded course
  console.log(mtu.courses.find(course => course.startDate !== undefined).getMeetingDates());

  const totalFee = mtu.courses.filter(course => course.online).reduce((accum, course) => accum + course.fee, 0);

  console.log(`It would cost an extra $${totalFee / 100} to take all offered online courses this semester.`);
})();
```

(Note that the Michigan Tech website/database system is quite slow and it takes around 13-15 seconds for `await mtu.load()` to complete.)

All dates/times are in UTC.

Fees are in cents instead of dollars to be consistent with the way financal data is usually handled in code.

## 📚 Docs

[Hosted on Github Pages](https://codetheweb.github.io/mtu-courses/).
