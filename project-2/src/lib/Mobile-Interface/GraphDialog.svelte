<script>
  import GraphCalendar from './GraphCalendar.svelte';
  import GraphBarChart from './GraphBarChart.svelte';
  import { onMount } from 'svelte';

  // Props
  let {BeltData, showGraphs , onClose} = $props();

  // State
  let selectedDate = $state(new Date().toISOString());
  let dailyData = $state({ BreathCount: 0, StepCount: 0, StairCount: 0 });
  let weeklyData = $state([]);
  

  function closeDialog() {
    showGraphs = false;
    onClose();
  }

  function handleDateSelect(date) {
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);
    selectedDate = date.toISOString();
    const dayData = BeltData.getDay(selectedDate);
    dailyData = dayData || { BreathCount: 0, StepCount: 0, StairCount: 0 };
    updateWeeklyData();
  }

  function updateWeeklyData() {
    const today = new Date(selectedDate);
    today.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setHours(0, 0, 0, 0);
      d.setDate(today.getDate() - i);
      const val = BeltData.getDay(d.toISOString());
      days.push({
        date: d.toLocaleDateString(),
        ...(val || { BreathCount: 0, StepCount: 0, StairCount: 0 }),
      });
    }
    weeklyData = days;
  }

  onMount(() => {
    handleDateSelect(new Date());
  });
</script>

{#if showGraphs}
  <div class="qn-overlay" role="dialog" aria-modal="true">
    <div class="qn-panel">
        <header class="qn-header">
     <h2 >Belt Data Visualisation</h2>
      <!-- Cross Button -->
      <button
        class="close"
        onclick={closeDialog}
      >
        ✕
      </button>

     </header>
     <section class="qn-body">
      <!-- Calendar -->
      <div class="flex justify-center mb-4">
        <GraphCalendar selectDate={(e) => handleDateSelect(e)} />
      </div>

      <!-- Daily Data -->
      <div class="text-center space-y-1 mb-4">
        <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
        <p><span class="text-red-500">Total Breath Count:</span> {dailyData.BreathCount}</p>
        <p><span class="text-green-500">Total Step Count:</span> {dailyData.StepCount}</p>
        <p><span class="text-purple-500">Total Stair Count:</span> {dailyData.StairCount}</p>
      </div>

      </section>
      <!-- Weekly Chart -->
      <section class="bar chart">
        <GraphBarChart {weeklyData} />
      </section>
      <!-- Close Button -->
      <footer class="qn-footer">
        <button
          onclick={closeDialog}
        >
          Close
        </button>
    </footer>
    </div>
  </div>
{/if}

<style>
    .qn-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    z-index: 1000;
  }

  .qn-panel {
    background: white;
    width: min(720px, 95%);
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .qn-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }

  .qn-body {
    padding: 1rem;
  }

  .qn-footer {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #eee;
  }

  .close {
    background: transparent;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
  }
</style>
