<script>
  import { BeltData, getToday } from '../Data-Store.svelte.js';
  import GraphDialog from './GraphDialog.svelte'

  // Metric Info modal control
  let showMetricInfo = $state(false);
  let showGraphs = $state(false);
  // Quick numbers and goals modal toggles (may be used elsewhere)
  let showQuick = $state(false);
  let showGoals = $state(false);


  // today's entry
  const today = $derived(
    [...BeltData.data].find((x) => x[0] === getToday().toISOString())[1]
  );

  // Goals (hard-coded) — set to project requested defaults
  const STEPS_GOAL = 12000;
  const STAND_GOAL = 160;

  function pct(value, goal) {
    const v = Number(value ?? 0);
    const g = Number(goal ?? 1);
    if (g === 0) return 0;
    return Math.min(100, Math.round((v / g) * 100));
  }

  // reactive helpers
  const stepsToday = $derived(today?.StepCount ?? 0);
  const standToday = $derived(
    typeof today?.StandMinutes !== 'undefined' && today?.StandMinutes !== null
      ? today.StandMinutes
      : null
  );

  // totals and averages
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
    <h2>Today</h2>
    <p>Date: {getToday().toISOString()}</p>
    <p>BreathCount: {today.BreathCount}</p>
    <p>StepCount: {today.StepCount}</p>
    <p>StairCount: {today.StairCount}</p>

    <h2>Summary</h2>
    <table class="qn-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Total</th>
          <th>Average / day</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>BreathCount</td>
          <td>{totals.BreathCount}</td>
          <td>{averages.BreathCount}</td>
        </tr>
        <tr>
          <td>StepCount</td>
          <td>{totals.StepCount}</td>
          <td>{averages.StepCount}</td>
        </tr>
        <tr>
          <td>StairCount</td>
          <td>{totals.StairCount}</td>
          <td>{averages.StairCount}</td>
        </tr>
      </tbody>
    </table>

    <h2>Goals</h2>
    <table class="goals-table">
      <thead>
        <tr>
          <th>Goal</th>
          <th>Today</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Steps ({STEPS_GOAL})</td>
          <td>{stepsToday}</td>
          <td>
            <div class="progress" aria-hidden="true">
              <div class="progress-bar" style="width: {pct(stepsToday, STEPS_GOAL)}%"></div>
            </div>
            <span class="percent">{pct(stepsToday, STEPS_GOAL)}%</span>
          </td>
        </tr>
        <tr>
          <td>Stand minutes ({STAND_GOAL})</td>
          <td>{standToday !== null ? Math.round(standToday * 10) / 10 : '—'}</td>
          <td>
            {#if standToday !== null}
              <div class="progress" aria-hidden="true">
                <div class="progress-bar stand" style="width: {pct(standToday, STAND_GOAL)}%"></div>
              </div>
              <span class="percent">{pct(standToday, STAND_GOAL)}%</span>
            {:else}
              <span>—</span>
            {/if}
          </td>
        </tr>
      </tbody>
    </table>

    <h3>Data Entries: {BeltData.publicData?.length}</h3>
    {#each [...BeltData.data] as day}
      <p>Date: {day[0]}</p>
      <p>BreathCount: {day[1].BreathCount}</p>
      <p>StepCount: {day[1].StepCount}</p>
      <p>StairCount: {day[1].StairCount}</p>
    {/each}
  </div>
</div>

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
  <GraphDialog {showGraphs} onClose={() => showGraphs = false} />
{/if}


<style>
  .quick-numbers-action {
    margin: 0.5rem 0;
  }

  /* table for embedded Quick Numbers */
  .qn-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }

  .qn-table th,
  .qn-table td {
    border: 1px solid #e9ecef;
    padding: 0.5rem 0.75rem;
    text-align: left;
  }

  .qn-table thead th {
    background: #f8f9fa;
    font-weight: 600;
  }

  /* Goals table */
  .goals-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }

  .goals-table th,
  .goals-table td {
    border: 1px solid #e9ecef;
    padding: 0.5rem 0.75rem;
    text-align: left;
    vertical-align: middle;
  }

  .goals-table thead th {
    background: #f8f9fa;
    font-weight: 600;
  }

  .percent {
    margin-left: 0.5rem;
    font-weight: 600;
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

