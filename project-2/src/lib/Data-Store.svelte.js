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
    StepCount: 0,
    StairCount: 0,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 0,
    StairCount: 0,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 0,
    StairCount: 0,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 0,
    StairCount: 0,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 0,
    StairCount: 0,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 0,
    StairCount: 0,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 0,
    StairCount: 0,
  });

  day.setDate(day.getDate() - 1);
  BeltData.addDay(day.toISOString(), {
    BreathCount: 0,
    StepCount: 0,
    StairCount: 0,
  });
}
