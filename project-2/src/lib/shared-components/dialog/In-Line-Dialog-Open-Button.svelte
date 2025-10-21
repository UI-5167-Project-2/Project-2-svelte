<!-- 
   @component
   The In Line Dialog Open Button Component
   @description This corresponds with the In Line Dialog and requires an identical generatedID to activate the modal, use this when the modal should be separated from the trigger button
   @param {string} dialogButtonSeverity Button coloring, Required Type = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
   @param {string} generatedID ID for connecting to the modal
   @param {string} buttonLabel Text for the label
   @param {string} buttonIcon class for the icon (only include the class name i.e bi-plus and not bi bi-plus)
   @param {boolean} smallWindow Indicates how sizing of the dialog should be set
   @param {} openButton This is a snippet which includes a custom open button
 -->

<!-- Code utilized from Bootstrap's documentation: https://getbootstrap.com/docs/5.3/components/modal/ -->
<script>
  let {
    dialogButtonSeverity = 'primary',
    buttonLabel = '',
    buttonIcon = '',
    openbutton = null,
    generatedID,
    smallWindow = false,
  } = $props();
</script>

{#if openbutton != null}
  {@render openbutton()}
{:else}
  <!-- Button trigger modal -->
  {#if smallWindow}
    <button
      type="button"
      class="btn btn-{dialogButtonSeverity}"
      data-bs-toggle="modal"
      data-bs-target="#{generatedID}"
    >
      {#if buttonIcon != ''}
        <i class="bi {buttonIcon}"></i>
      {/if}
      {buttonLabel}
    </button>
  {:else}
    <button
      type="button"
      class="btn btn-{dialogButtonSeverity}"
      data-bs-toggle="modal"
      data-bs-target="#{generatedID}"
    >
      {#if buttonIcon != ''}
        <i class="bi {buttonIcon}"></i>
      {/if}
      {buttonLabel}
    </button>
  {/if}
{/if}
