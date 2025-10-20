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

  let chartEl = $state();
  let chart = $state();

  let {weeklyData = []} = $props();

  let series = $derived([
    { name: 'BreathCount', data: weeklyData.map((d) => d.BreathCount) },
    { name: 'StepCount', data: weeklyData.map((d) => d.StepCount) },
    { name: 'StairCount', data: weeklyData.map((d) => d.StairCount) },
  ]);

  const type = 'bar'; 

  let config = $derived({
    type: type,
    data: {
      labels: weeklyData.map((d) => d.date.getDay()),
      datasets: [
        { label: 'BreathCount', backgroundColor: '#ef4444', data: series[0].data },
        { label: 'StepCount', backgroundColor: '#22c55e', data: series[1].data },
        { label: 'StairCount', backgroundColor: '#a855f7', data: series[2].data },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: '#374151' } },
        title: { display: true, text: 'Weekly Belt Data', color: '#111827', font: { size: 16, weight: 'bold' } },
      },
      scales: {
        x: { ticks: { color: '#4b5563' }, grid: { color: '#e5e7eb' } },
        y: {
          ticks: { color: '#4b5563' },
          grid: { color: '#e5e7eb' },
          title: { display: true, text: 'Count', color: '#374151' },
        },
      },
    },
  });

  onMount(() => {
    
    chart = new Chart(chartEl, config);
  });

  $effect(() => {
    if (chart) {
      chart.data = config.data;
      chart.options = config.options;
      chart.update();
    }
  });

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>

<div class="w-full">
  {#if weeklyData.length > 0}
    <canvas bind:this={chartEl} class="w-full h-[350px]"></canvas> 
  {:else}
    <p class="text-center text-gray-500 mt-4">No data available.</p>
  {/if}
</div>
