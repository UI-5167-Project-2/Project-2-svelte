<script>
  import { BeltData } from '../Data-Store.svelte.js';
  import GraphCalendar from './GraphCalendar.svelte';
  import GraphBarChart from './GraphBarChart.svelte';
  import GraphLineChart from './GraphLineChart.svelte';
  import { onMount } from 'svelte';

  // Props (runes mode): include BeltData in destructure and default it to undefined so it's optional
  let { showGraphs, onClose, BeltData: _BeltData = undefined } = $props();

  // State
  let today = $state(new Date());
  let selectedDate = $state(new Date());
  let dailyData = $state({ BreathCount: 0, StepCount: 0, StairCount: 0 });
  let weeklyData = $state([]);
  let viewMode = $state('default'); // 'default' | 'line' | 'bar'

  // --- Functions ---

  function closeDialog() {
    showGraphs = false;
    onClose();
    viewMode = 'default';
  }

  function goBack() {
    viewMode = 'default';
  }

  // Called when a date is selected from the calendar
  function handleDateSelect(date) {
    date.setHours(0, 0, 0, 0);
    selectedDate = date;
    updateDailyData();
    updateWeeklyData();
  }

  // Fetch the selected day's BeltData
  function updateDailyData() {
    const dayData = BeltData.getDay(selectedDate.toISOString());
    dailyData = dayData || { BreathCount: 0, StepCount: 0, StairCount: 0 };
  }

  // Generate a 7-day BeltData range ending on the selected date
  function updateWeeklyData() {
    const base = new Date(selectedDate);
    base.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const val = BeltData.getDay(d.toISOString());
      days.push({
        date: d.toLocaleDateString(),
        ...(val || { BreathCount: 0, StepCount: 0, StairCount: 0 })
      });
    }
    weeklyData = days;
  }

  // Derived — live aggregated totals for today
  const todayData = $derived(
    (() => {
      const arr = [...BeltData.data];
      return arr.reduce(
        (acc, [, v]) => {
          acc.BreathCount += (v?.BreathCount) ?? 0;
          acc.StepCount += (v?.StepCount) ?? 0;
          acc.StairCount += (v?.StairCount) ?? 0;
          return acc;
        },
        { BreathCount: 0, StepCount: 0, StairCount: 0 }
      );
    })()
  );

  // Utility: check if selected date is "today"
  function isToday(date) {
    const d = new Date(date);
    const t = new Date(today);
    return (
      d.getFullYear() === t.getFullYear() &&
      d.getMonth() === t.getMonth() &&
      d.getDate() === t.getDate()
    );
  }

  // Initialize data on mount
  onMount(() => {
    handleDateSelect(new Date());
  });

  // Reactivity — auto-update if BeltData changes AND selectedDate is today
  $effect(() => {
    if (showGraphs) {
      if (isToday(selectedDate)) {
        // keep today dynamic
        updateWeeklyData();
      } else {
        updateDailyData();
        updateWeeklyData();
      }
    }
  });
</script>

{#if showGraphs}
  <div class="qn-overlay" role="dialog" aria-modal="true">
    <div class="qn-panel">
      <header class="qn-header">
        {#if viewMode !== 'default'}
          <button class="close" onclick={goBack}>‹</button>
        {/if}
        <h2>Belt Data Visualisation</h2>
        <button class="close" onclick={closeDialog}>✕</button>
      </header>

      <section class="qn-body">
        {#if viewMode === 'default'}
          <!-- Calendar -->
          <div class="flex justify-center mb-4">
            <GraphCalendar selectDate={(e) => handleDateSelect(e)} />
          </div>

          <!-- Daily Data -->
          <div class="text-center space-y-1 mb-4">
            <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>

            {#if isToday(selectedDate)}
              <p><span class="text-red-500">Total Breath Count:</span> {todayData.BreathCount}</p>
              <p><span class="text-green-500">Total Step Count:</span> {todayData.StepCount}</p>
              <p><span class="text-purple-500">Total Stair Count:</span> {todayData.StairCount}</p>
            {:else}
              <p><span class="text-red-500">Total Breath Count:</span> {dailyData.BreathCount}</p>
              <p><span class="text-green-500">Total Step Count:</span> {dailyData.StepCount}</p>
              <p><span class="text-purple-500">Total Stair Count:</span> {dailyData.StairCount}</p>
            {/if}
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col items-center gap-3 mb-4">
            <button onclick={() => (viewMode = 'line')} class="bar">
              Weekly Line Graph
            </button>
            <button onclick={() => (viewMode = 'bar')} class="line">
              Today’s Bar Chart
            </button>
          </div>

        {:else if viewMode === 'line'}
          <GraphLineChart {weeklyData} />

        {:else if viewMode === 'bar'}
          <GraphBarChart
            todayData={isToday(selectedDate) ? todayData : dailyData}
          />
        {/if}
      </section>

      <footer class="qn-footer">
        <button onclick={closeDialog}>Close</button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .qn-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    background: transparent; /* fully transparent background */
    z-index: 1000;
    overflow-y: auto;
    pointer-events: none; /* allow background to remain interactive */
  }

  .qn-panel {
    pointer-events: auto;
    background: white;
    width: 50%;
    max-width: 720px;
    height: 100vh;
    box-shadow: -4px 0 25px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
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
    overflow-y: auto;
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

  .bar {
    background: #f3f048;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 0.5rem;
  }

  .line {
    background: #48cbf3;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 0.5rem;
  }
</style>
