let data = $state({
  IsTurnedOn: false,
  Status: 'wifi-off',
});

export const DeviceStatus = {
  get poweredOn() {
    return data.IsTurnedOn;
  },

  changePower() {
    data.IsTurnedOn = !data.IsTurnedOn;

    this.startPowerSequence(data.IsTurnedOn);
  },

  /*
  @Props Status = "wifi-off" | "wifi-1" | "wifi-2" | "wifi"
  */
  changeConnectionStatus(status) {
    if (data.IsTurnedOn) {
      data.Status = status;
    }
  },

  getStatus() {
    return data.Status;
  },

  startPowerSequence(powerOn) {
    if (powerOn) {
      data.Status = 'wifi-1';
      let flickerCount = 0;
      const maxFlickers = 5;

      const flickerInterval = setInterval(() => {
        if (flickerCount >= maxFlickers) {
          clearInterval(flickerInterval);
          data.Status = 'wifi-2';
          setTimeout(() => {
            data.Status = 'wifi';
          }, 500);

          return;
        }
        data.Status = data.Status === 'wifi-1' ? 'wifi-2' : 'wifi-1';
        flickerCount++;
      }, 500);
    } else {
      data.Status = 'wifi-2';
      let flickerCount = 0;
      const maxFlickers = 2;

      const flickerInterval = setInterval(() => {
        if (flickerCount >= maxFlickers) {
          clearInterval(flickerInterval);
          data.Status = 'wifi-1';
          setTimeout(() => {
            data.Status = 'wifi-off';
          }, 500);

          return;
        }
        data.Status = data.Status === 'wifi-1' ? 'wifi-2' : 'wifi-1';
        flickerCount++;
      }, 500);
    }
  },
};
