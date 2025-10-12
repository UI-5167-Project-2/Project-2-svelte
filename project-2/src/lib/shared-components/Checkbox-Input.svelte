<!-- 
  @component
  A Switch component reflecting a checkbox, looking like a switch
  @param {boolean} value A bindable value of the switch
  @param {string} label a label for the switch
  
 -->
<script>
  import { generateDialogID } from '../utils/dynamic-dialog-id';

  let { value = $bindable(undefined), label = '', generatedID = generateDialogID() } = $props();
</script>

<div class="container mt-4">
  <div class="mb-3">
    <div class="form-check form-switch d-flex justify-content-start">
      <input
        class="form-check-input cursor-pointer"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckDefault-{generatedID}"
        bind:checked={value}
      />
      <label
        class="form-check-label ms-2 no-select cursor-pointer"
        for="flexSwitchCheckDefault-{generatedID}">{label}</label
      >
    </div>
  </div>
</div>
