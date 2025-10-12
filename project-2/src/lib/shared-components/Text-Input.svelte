<!-- 
  @component
  A text input
  @param {string} value A bindable value of the input
  @param {string} label A label for the input
  @param {string} placeholder A placeholder for the input
 -->
<script>
  let { value = $bindable(), label = '', placeholder = '' } = $props();
</script>

<div class="container mt-4">
  <div class="form-floating mb-3">
    <input type="text" class="form-control" {placeholder} id="text-input" bind:value />
    <label for="text-input">{label}</label>
  </div>
</div>
