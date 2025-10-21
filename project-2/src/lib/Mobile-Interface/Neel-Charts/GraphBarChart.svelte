<script>
  import { onMount, onDestroy } from 'svelte';
  import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

  let {todayData = { BreathCount: 0, StepCount: 0, StairCount: 0 }} = $props();

  let chartEl = $state();
  let chart = $state();

  $effect(() => {
    if (todayData) drawChart();
  });

  function drawChart() {
    if (chart) chart.destroy();

    const labels = ['BreathCount', 'StepCount', 'StairCount'];
    const data = [todayData.BreathCount, todayData.StepCount, todayData.StairCount];
    const colors = ['#ef4444', '#22c55e', '#a855f7'];

    chart = new Chart(chartEl, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Today',
            data,
            backgroundColor: colors,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Today's Belt Data",
            color: '#111827',
            font: { size: 16, weight: 'bold' },
          },
        },
        scales: {
          x: { ticks: { color: '#4b5563' }, grid: { color: '#e5e7eb' } },
          y: {
            beginAtZero: true,
            ticks: { color: '#4b5563' },
            grid: { color: '#e5e7eb' },
            title: { display: true, text: 'Count', color: '#374151' },
          },
        },
      },
    });
  }

  onDestroy(() => { if (chart) chart.destroy(); });
</script>

<div class="w-full h-[300px]">
  <canvas bind:this={chartEl}></canvas>
</div>
