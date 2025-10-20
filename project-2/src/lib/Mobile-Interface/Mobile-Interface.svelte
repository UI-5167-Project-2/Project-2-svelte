<script>
  import { BeltData, getToday } from '../Data-Store.svelte.js';
  import GraphDialog from './GraphDialog.svelte'

  let showQuick = $state(false);
  let showGoals = $state(false);
  let showMetricInfo = $state(false);
  let showGraphs = $state(false);


  // current day entry (keeps existing reactive pattern used in the project)
  const today = $derived(
    [...BeltData.data].find((x) => x[0] === getToday().toISOString())[1]
  );

  // Goals (hard-coded)
  const STEPS_GOAL = 12000;
  const STAND_GOAL = 160;

  function pct(value, goal) {
    const v = Number(value ?? 0);
    const g = Number(goal ?? 1);
    if (g === 0) return 0;
    return Math.min(100, Math.round((v / g) * 100));
  }

  // reactive helpers for today's progress (use $derived consistent with project)
  const stepsToday = $derived(today?.StepCount ?? 0);
  const standToday = $derived(
    typeof today?.StandMinutes !== 'undefined' && today?.StandMinutes !== null
      ? today.StandMinutes
      : null
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
      <button class="goals-button" onclick={() => (showGoals = true)}>Goals</button>
      <button class="info-button" onclick={() => (showMetricInfo = true)}>Metric Info</button>
      <button class="graph-button" onclick={() => (showGraphs = true)}>Graphs</button>
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

{#if showGoals}
  <div class="qn-overlay" role="dialog" aria-modal="true">
    <div class="qn-panel">
      <header class="qn-header">
        <h2>Goals</h2>
        <button class="close" onclick={() => (showGoals = false)}>✕</button>
      </header>
      <section class="qn-body">
        <h3>Steps</h3>
        <div class="goal-row">
          <div class="progress" aria-hidden="true">
            <div class="progress-bar" style="width: {pct(stepsToday, STEPS_GOAL)}%"></div>
          </div>
          <p>{stepsToday} / {STEPS_GOAL} ({pct(stepsToday, STEPS_GOAL)}%)</p>
        </div>

        <h3>Stand</h3>
        {#if standToday !== null}
          <div class="goal-row">
            <div class="progress" aria-hidden="true">
              <div class="progress-bar stand" style="width: {pct(standToday, STAND_GOAL)}%"></div>
            </div>
            <p>{Math.round(standToday * 10) / 10} / {STAND_GOAL} ({pct(standToday, STAND_GOAL)}%)</p>
          </div>
        {:else}
          <p><em>No live stand-minute data available for today.</em></p>
          <p>Stand goal: <strong>{STAND_GOAL} stand minutes</strong></p>
        {/if}
      </section>
      <footer class="qn-footer">
        <button onclick={() => (showGoals = false)}>Close</button>
      </footer>
    </div>
  </div>
{/if}

{#if showMetricInfo}
  <div class="qn-overlay" role="dialog" aria-modal="true">
    <div class="qn-panel">
      <header class="qn-header">
        <h2>Metric Info</h2>
        <button class="close" onclick={() => (showMetricInfo = false)}>✕</button>
      </header>
      <section class="qn-body">
        <h3>Tracked Metrics</h3>
        <p><strong>BreathCount</strong>: Number of breaths counted for the day.</p>
        <p><strong>StepCount</strong>: Number of steps recorded for the day.</p>
        <p><strong>StairCount</strong>: Number of stair-climbing events recorded for the day.</p>
        <p>These metrics are collected from the device simulation and aggregated per-day in the data store.</p>
      </section>
      <footer class="qn-footer">
        <button onclick={() => (showMetricInfo = false)}>Close</button>
      </footer>
    </div>
  </div>
{/if}

{#if showGraphs}
  <GraphDialog {BeltData} {showGraphs} onClose={() => showGraphs = false} />
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

  .goals-button {
    background: #198754;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 0.5rem;
  }

  .info-button {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 0.5rem;
  }

  .graph-button {
    background: #f12ba5;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 0.5rem;
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

  .goal-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .progress {
    background: #e9ecef;
    border-radius: 999px;
    width: 220px;
    height: 14px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #0d6efd, #6ea8fe);
    width: 0;
    transition: width 0.3s ease;
  }

  .progress-bar.stand {
    background: linear-gradient(90deg, #198754, #63d69b);
  }
</style>
