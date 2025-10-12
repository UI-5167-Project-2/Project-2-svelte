<!-- 
  @component
  A text area input (resizeable text)
  @param {string} value A bindable value of the input
  @param {string} label A label for the input
 -->
<script>
  let { value = $bindable(), label = '' } = $props();
</script>

<div class="container mt-4">
  <div class="form-floating mb-3">
    <textarea
      class="form-control"
      placeholder="Leave a note for {label.toLowerCase()} here"
      id="text-input"
      bind:value
    ></textarea>
    <label for="text-input">{label}</label>
  </div>
</div>
