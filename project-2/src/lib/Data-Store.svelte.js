let data = $state(new Map());
let publicData = $state([]);

export const BeltData = {
  get data() {
    return publicData;
  },

  addDay(date, value) {
    data.set(date, value);
    publicData = [...data];
  },

  updateDay(date, value) {
    data.set(date, value);
    publicData = [...data];
  },

  getDay(date) {
    return data.get(date);
  },
};

export function getToday() {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  return day;
}

setInitialData();

function setInitialData() {
  const day = getToday();
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 4280,
    StairCount: 150,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 7572,
    StairCount: 207,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 8500,
    StairCount: 500,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 5250,
    StairCount: 126,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 3200,
    StairCount: 25,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 4400,
    StairCount: 210,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 9000,
    StairCount: 600,
  });
}
