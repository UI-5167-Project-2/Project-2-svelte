<script>
  import { BeltData, getToday } from '../Data-Store.svelte.js';

  let showQuick = $state(false);

  // current day entry (keeps existing reactive pattern used in the project)
  const today = $derived(
    [...BeltData.data].find((x) => x[0] === getToday().toISOString())[1]
  );

  // compute totals across all entries
  const totals = $derived(
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

  // compute averages per day (rounded)
  const averages = $derived(
    (() => {
      const arr = [...BeltData.data];
      const n = arr.length || 1;
      const sums = arr.reduce(
        (acc, [, v]) => {
          acc.BreathCount += (v?.BreathCount) ?? 0;
          acc.StepCount += (v?.StepCount) ?? 0;
          acc.StairCount += (v?.StairCount) ?? 0;
          return acc;
        },
        { BreathCount: 0, StepCount: 0, StairCount: 0 }
      );
      return {
        BreathCount: Math.round(sums.BreathCount / n),
        StepCount: Math.round(sums.StepCount / n),
        StairCount: Math.round(sums.StairCount / n),
      };
    })()
  );
</script>

<div class="parent-container">
  <h2>Mobile Interface</h2>
    <div class="quick-numbers-action">
    <button class="qn-button" onclick={() => (showQuick = true)}>Quick Numbers</button>
  </div>
  <div class="child-container-body">
    <p>This will be further developed</p>
    <h2>Today: (use if showing data from today)</h2>
    <p>Date: {getToday().toISOString()}</p>
    <p>BreathCount: {today.BreathCount}</p>
    <p>StepCount: {today.StepCount}</p>
    <p>StairCount: {today.StairCount}</p>
    <h2>All Data: (use if accessing all data)</h2>
  <h3>Summary</h3>
  <p>Total BreathCount: {totals.BreathCount}</p>
  <p>Total StepCount: {totals.StepCount}</p>
  <p>Total StairCount: {totals.StairCount}</p>
  <p>Average / day — BreathCount: {averages.BreathCount}, StepCount: {averages.StepCount}, StairCount: {averages.StairCount}</p>
    <h3>Data Entries: {BeltData.publicData?.length}</h3>
    {#each [...BeltData.data] as day}
      <p>Date: {day[0]}</p>
      <p>BreathCount: {day[1].BreathCount}</p>
      <p>StepCount: {day[1].StepCount}</p>
      <p>StairCount: {day[1].StairCount}</p>
    {/each}
  </div>
</div>

{#if showQuick}
  <div class="qn-overlay" role="dialog" aria-modal="true">
    <div class="qn-panel">
      <header class="qn-header">
  <h2>Quick Numbers — Summary</h2>
  <button class="close" onclick={() => (showQuick = false)}>✕</button>
      </header>
      <section class="qn-body">
        <h3>Totals</h3>
        <p>Total BreathCount: {totals.BreathCount}</p>
        <p>Total StepCount: {totals.StepCount}</p>
        <p>Total StairCount: {totals.StairCount}</p>

        <h3>Averages (per day)</h3>
        <p>BreathCount: {averages.BreathCount}</p>
        <p>StepCount: {averages.StepCount}</p>
        <p>StairCount: {averages.StairCount}</p>
      </section>
      <footer class="qn-footer">
  <button onclick={() => (showQuick = false)}>Close</button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .quick-numbers-action {
    margin: 0.5rem 0;
  }

  .qn-button {
    background: #0d6efd;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .qn-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
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
