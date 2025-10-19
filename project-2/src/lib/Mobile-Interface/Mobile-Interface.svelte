<script>
  import { BeltData, getToday } from '../Data-Store.svelte.js';

  const today = $derived([...BeltData.data].find((x) => x[0] === getToday().toISOString())[1]);
</script>

<div class="parent-container">
  <h2>Mobile Interface</h2>
  <div class="child-container-body">
    <p>This will be further developed</p>
    <h2>Today: (use if showing data from today)</h2>
    <p>Date: {getToday().toISOString()}</p>
    <p>BreathCount: {today.BreathCount}</p>
    <p>StepCount: {today.StepCount}</p>
    <p>StairCount: {today.StairCount}</p>
    <h2>All Data: (use if accessing all data)</h2>
    <h3>Data Entries: {BeltData.publicData?.length}</h3>
    {#each [...BeltData.data] as day}
      <p>Date: {day[0]}</p>
      <p>BreathCount: {day[1].BreathCount}</p>
      <p>StepCount: {day[1].StepCount}</p>
      <p>StairCount: {day[1].StairCount}</p>
    {/each}
  </div>
</div>

<style></style>
