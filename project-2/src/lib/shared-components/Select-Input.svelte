<script>
  // items must have a value property i.e [a.value]
  // if the label for the option should not be the value,
  // include a label property for all items. and set useValueAsLabel to true
  let {
    label = '',
    placeholder = '',
    useValueAsLabel = false,
    items = $bindable([]),
    value = $bindable(),
  } = $props();
</script>

<div class="container mt-4">
  {#if label != ''}
    <label class="d-flex justify-content-start" for="select">{label}</label>
  {/if}
  <div class="d-flex align-items-center gap-2">
    <select class="form-select" name="select" bind:value>
      <option value={null} disabled selected hidden>{placeholder}</option>
      {#each items as item}
        {#if useValueAsLabel}
          <option value={item.value}>{item.label}</option>
        {:else}
          <option value={item.value}>{item.value}</option>
        {/if}
      {/each}
    </select>
    {#if !(value == null || value == '')}
      <button type="button" class="btn btn-outline-danger" onclick={() => (value = null)}>
        X
      </button>
    {/if}
  </div>
</div>
