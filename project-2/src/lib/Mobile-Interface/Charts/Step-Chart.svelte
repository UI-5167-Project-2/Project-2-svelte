<script>
  import {
    Chart,
    BarController,
    LineController,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
  } from 'chart.js';
  import { onDestroy, onMount } from 'svelte';
  import { BeltData } from '../../Data-Store.svelte';

  let canvasElement;

  let myChart = null;

  Chart.register(
    BarController,
    LineController,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip
  );

  const getDaysOfWeekLabels = () => {
    const labels = [];
    const today = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayIndex = date.getDay();
      labels.push(daysOfWeek[dayIndex]);
    }
    return labels;
  };

  const dynamicLabels = $derived(getDaysOfWeekLabels());

  const data = {
    // svelte-ignore state_referenced_locally
    labels: dynamicLabels,
    datasets: [
      {
        axis: 'y',
        label: 'Steps',
        data: [],
        fill: false,
        borderWidth: 1,
      },
      {
        type: 'line',
        label: 'Goal',
        data: [6000, 6000, 6000, 6000, 6000, 6000, 6000],
        borderColor: 'rgb(40, 167, 69)',
        backgroundColor: 'rgba(40, 167, 69, 0.5)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHitDetectionRadius: -1,
        order: 2,
      },
    ],
  };

  const beltData = $derived([...BeltData.data]);

  let currentData = [];

  $effect(() => {
    const newData = beltData.map((x) => x[1].StepCount);
    let showNewData = arraysAreEqual(currentData, newData);

    if (!showNewData) {
      currentData = newData;

      data.datasets[0].data = newData.toReversed();
      if (myChart) {
        myChart.update();
      } else if (canvasElement) {
        myChart = new Chart(canvasElement, config);
      }
    }
  });

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Steps: Last 7 Days',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
        tooltip: {
          titleFont: {
            size: 16,
            weight: 'bold',
          },
          bodyFont: {
            size: 14,
          },
          filter: function (tooltipItem) {
            return tooltipItem.dataset.label !== 'Goal';
          },
        },
      },
    },
  };

  onMount(() => {
    if (myChart) {
      myChart.destroy();
    }
    if (canvasElement) {
      myChart = new Chart(canvasElement, config);
    }
  });

  onDestroy(() => {
    if (myChart) {
      myChart.destroy();
    }
  });

  function arraysAreEqual(arr1, arr2) {
    if (arr1 === arr2) return true;

    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }
</script>

<canvas bind:this={canvasElement} style="max-width: 45%" id="myChart"></canvas>
