<script>
  import DynamicDialog from '../shared-components/dialog/Dynamic-Dialog.svelte';

  let {
    actionLabel,
    actionDesc
  } = $props();

</script>

{#snippet body()}
  <p >{actionDesc}</p>
{/snippet}

<DynamicDialog
  headerText={actionLabel}
  buttonLabel="ⓘ"
  hasFooter={false}
  close={() => {}}
  {body}
/>

<style>

</style>