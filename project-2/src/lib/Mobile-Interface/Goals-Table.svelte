<script>
  import { BeltData, getToday } from '../Data-Store.svelte';

  const STEPS_GOAL = 6000;
  const STAND_GOAL = 50;

  const today = $derived([...BeltData.data].find((x) => x[0] === getToday().toISOString())[1]);

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
</script>

<h4>Goals</h4>
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

<style>
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

  .progress {
    background: #e9ecef;
    border-radius: 999px;
    width: 100%;
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
