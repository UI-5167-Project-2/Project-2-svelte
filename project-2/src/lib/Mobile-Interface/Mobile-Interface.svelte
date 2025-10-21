<script>
  import StairChart from './Charts/Stair-Chart.svelte';
  import StepChart from './Charts/Step-Chart.svelte';
  import GoalsTable from './Goals-Table.svelte';
  import GraphDialog from './Neel-Charts/GraphDialog.svelte';
  import SummaryTable from './Summary-Table.svelte';

  // Metric Info modal control
  let showGraphs = $state(false);
</script>

<div class="modular-child-container-body">
  <div class="d-flex flex-row justify-content-between mb-2">
    <StepChart />
    <StairChart />
  </div>
  <SummaryTable />
  <GoalsTable />
</div>

<button class="graph-button" onclick={() => (showGraphs = true)}>Graphs</button>

{#if showGraphs}
  <GraphDialog {showGraphs} onClose={() => (showGraphs = false)} />
{/if}

<style>
  @media (max-width: 760px) {
    .modular-child-container-body {
      height: calc(100% + 10vh);
    }
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
</style>
