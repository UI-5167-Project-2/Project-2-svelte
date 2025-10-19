<script>
  import DynamicDialog from '../shared-components/dialog/Dynamic-Dialog.svelte';
</script>

{#snippet body()}
  <p>This is the device description for the smart belt</p>
{/snippet}

<DynamicDialog
  headerText="Smart Belt Description"
  buttonLabel="Device Description"
  hasFooter={false}
  close={() => {}}
  {body}
/>
