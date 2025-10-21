<script>
  import { BeltData } from '../Data-Store.svelte';
  import { DeviceStatus } from '../Device-Status-Store.svelte';
  import Device from '../Device-Viewer/Device.svelte';
  import DynamicDialog from '../shared-components/dialog/Dynamic-Dialog.svelte';

  const isPowered = $derived(DeviceStatus.poweredOn);
  let powerButton;

  // totals and averages
  const totals = $derived(
    (() => {
      const arr = [...BeltData.data];
      return arr.reduce(
        (acc, [, v]) => {
          acc.BreathCount += v?.BreathCount ?? 0;
          acc.StepCount += v?.StepCount ?? 0;
          acc.StairCount += v?.StairCount ?? 0;
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
          acc.BreathCount += v?.BreathCount ?? 0;
          acc.StepCount += v?.StepCount ?? 0;
          acc.StairCount += v?.StairCount ?? 0;
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

  function powerPressed() {
    if (powerButton) {
      powerButton.disabled = true;
      setTimeout(() => {
        powerButton.disabled = false;
      }, 1500);
    }
    DeviceStatus.changePower();
  }
</script>

{#snippet metricInfo()}
  <h3>Tracked Metrics</h3>
  <p><strong>BreathCount</strong>: Number of breaths counted for the day.</p>
  <p><strong>StepCount</strong>: Number of steps recorded for the day.</p>
  <p><strong>StairCount</strong>: Number of stair-climbing events recorded for the day.</p>
  <p>
    These metrics are collected from the device simulation and aggregated per-day in the data store.
  </p>
{/snippet}

<div class="d-flex flex-row justify-content-between align-items-center mb-2">
  <h4 class="m-0">Weekly Summary</h4>
  <div class="d-flex flex-row gap-2">
    <button class="btn btn-light" bind:this={powerButton} onclick={() => powerPressed()}
      ><i
        class="bi bi-power svg-icon-power"
        style="color: {!isPowered ? 'green' : 'red'};"
        title="Turn: {!isPowered ? 'On' : 'Off'}"
      ></i>Power</button
    >
    <DynamicDialog
      body={metricInfo}
      buttonLabel="Metric Info"
      dialogButtonSeverity="secondary"
      headerText="Metric Info"
      hasFooter={false}
      close={() => {}}
    />
  </div>
</div>
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
      <td>Breath Count</td>
      <td>{totals.BreathCount}</td>
      <td>{averages.BreathCount}</td>
    </tr>
    <tr>
      <td>Step Count</td>
      <td>{totals.StepCount}</td>
      <td>{averages.StepCount}</td>
    </tr>
    <tr>
      <td>Stair Count</td>
      <td>{totals.StairCount}</td>
      <td>{averages.StairCount}</td>
    </tr>
  </tbody>
</table>

<style>
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
</style>
