# 🏛 mtu-courses

Scape all courses for a given semester from Michigan Tech's website.

## Install

`npm i mtu-courses`

## Quickstart

```javascript
const Courses = require('mtu-courses');

(async () => {
  const mtu = new Courses();

  await mtu.load();

  // Get all meeting dates for first loaded course
  console.log(mtu.courses[0].getMeetingDates());

  const totalFee = mtu.courses.filter(course => course.online).reduce((accum, course) => accum + course.fee, 0);

  console.log(`It would cost an extra $${totalFee / 100} to take all offered online courses this semester.`);
})();
```

(Note that the Michigan Tech website/database system is quite slow and it takes around 13-15 seconds for `await mut.load()` to complete.)

All dates/times are in UTC.

## Docs
