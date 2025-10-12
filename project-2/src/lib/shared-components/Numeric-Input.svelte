<!-- 
  @component
  A numeric input
  @param {number} value A bindable value of the input
  @param {string} label A label for the input
  @param {number} placeholder A placeholder for the input
  @param {number} max The heighest value for the input
  @param {number} min The lowest value for the input
 -->
<script>
  let { value = $bindable(), label = '', placeholder = '', min = '', max = '' } = $props();
</script>

<div class="container mt-4">
  <div class="form-floating mb-3">
    <input
      type="number"
      class="form-control"
      {min}
      {max}
      {placeholder}
      id="text-input"
      bind:value
    />
    <label for="text-input">{label}</label>
  </div>
</div>
