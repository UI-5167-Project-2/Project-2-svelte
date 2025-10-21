<script>
  import { onMount, onDestroy } from 'svelte';
  import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  Chart.register(
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
  );

  let { weeklyData = [] } = $props();

  let chartEl = $state();
  let chart = $state();

  $effect(() => {
    if (weeklyData && weeklyData.length) drawChart();
  });

  function drawChart() {
    if (chart) chart.destroy();

    const labels = weeklyData.map((d) => d.date);
    const datasets = [
      {
        label: 'BreathCount',
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
        fill: false,
        tension: 0.3,
        data: weeklyData.map((d) => d.BreathCount),
      },
      {
        label: 'StepCount',
        borderColor: '#22c55e',
        backgroundColor: '#22c55e',
        fill: false,
        tension: 0.3,
        data: weeklyData.map((d) => d.StepCount),
      },
      {
        label: 'StairCount',
        borderColor: '#a855f7',
        backgroundColor: '#a855f7',
        fill: false,
        tension: 0.3,
        data: weeklyData.map((d) => d.StairCount),
      },
    ];

    chart = new Chart(chartEl, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: '#374151' } },
          title: { display: true, text: 'Weekly Belt Data', color: '#111827' },
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

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>

<div class="w-full h-[350px]">
  <canvas bind:this={chartEl}></canvas>
</div>
