<script>
  let { selectDate } = $props();

  let selected = $state(new Date().toISOString().split('T')[0]);

  function handleChange(e) {
    selected = e.target.value;
    selectDate(new Date(selected));
  }
</script>

<input
  type="date"
  bind:value={selected}
  onchange={handleChange}
  class="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
/>
