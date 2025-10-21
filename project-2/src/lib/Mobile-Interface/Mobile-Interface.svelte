<script>
  import StairChart from './Charts/Stair-Chart.svelte';
  import StepChart from './Charts/Step-Chart.svelte';
  import GoalsTable from './Goals-Table.svelte';
  import SummaryTable from './Summary-Table.svelte';
</script>

<div class="modular-child-container-body">
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
