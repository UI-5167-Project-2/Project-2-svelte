<script>
  import { DeviceStatus } from '../Device-Status-Store.svelte';
  import StairChart from './Charts/Stair-Chart.svelte';
  import StepChart from './Charts/Step-Chart.svelte';
  import GoalsTable from './Goals-Table.svelte';
  import SummaryTable from './Summary-Table.svelte';

  const isPowered = $derived(DeviceStatus.poweredOn);
  const status = $derived(DeviceStatus.getStatus());
  let powerButton;

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

<div class="modular-child-container-body">
  <div class="d-flex flex-row justify-content-between align-items-center">
    <h3>Mobile Interface:</h3>
    <div class="d-flex flex-row gap-2">
      <button class="btn btn-light" bind:this={powerButton} onclick={() => powerPressed()}
        ><i
          class="bi bi-power svg-icon-power"
          style="color: {!isPowered ? 'green' : 'red'};"
          title="Turn: {!isPowered ? 'On' : 'Off'}"
        ></i>Power</button
      >
      <div class="btn btn-light" style="pointer-events: none">
        {status == 'wifi'
          ? '🟢 Connected'
          : isPowered && (status == 'wifi-1' || status == 'wifi-2')
            ? '🟡 Connecting'
            : !isPowered && (status == 'wifi-1' || status == 'wifi-2')
              ? '🟡 Disconnecting'
              : '🔴 Disconnected'}
      </div>
    </div>
  </div>
  <div class="d-flex flex-row justify-content-between mb-2">
    <StepChart />
    <StairChart />
  </div>
  <SummaryTable />
  <GoalsTable />
</div>

<style>
  @media (max-width: 760px) {
    .modular-child-container-body {
      height: calc(100% + 10vh);
    }
  }
</style>
