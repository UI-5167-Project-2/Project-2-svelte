<!-- 
  @component
  A calendar input component
  @param {string} label A label for the input
  @param {date} value the value from the input
 -->
<script>
  let { value = $bindable(undefined), label = '' } = $props();
  if (value == undefined) {
    value = new Date();
  }
  value = value.toISOString().split('T')[0];
</script>

<div class="container mt-4">
  <div class="form-floating mb-3">
    <input type="date" class="form-control cursor-pointer" id="date-input" bind:value />
    <label for="date-input">{label}</label>
  </div>
</div>
