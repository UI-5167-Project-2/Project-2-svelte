<!-- 
   @component
   The Dynamic Dialog Component
   @param {string} generatedID ID for connecting to the modal
   @param {string} headerText Text for the header of the component
   @param {boolean} hasFooter Indicates if a footer should be added (must be tru if assing a footer)
   @param {} body This is a snippet which includes the body for the dialog
   @param {} footer This is a snippet which includes the footer for the dialog (please use the DialogSaveButton component for proper dialog closing)
   @param {} close This is a value call back when the dialog closes (this allows information to be passed back)
 -->

<!-- Code utilized from Bootstrap's documentation: https://getbootstrap.com/docs/5.3/components/modal/ -->
<script>
  let {
    headerText = '',
    body = null,
    footer = null,
    generatedID,
    close = null,
    hasFooter = true,
  } = $props();

  function onclose() {
    close();
  }
</script>

{#snippet defaultFooter()}
  <button type="button" class="btn btn-secondary" onclick={onclose} data-bs-dismiss="modal"
    >Close</button
  >
{/snippet}

<div
  class="modal fade"
  id={generatedID}
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header no-select">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{headerText}</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          onclick={onclose}
          aria-label="Close"
        ></button>
      </div>
      {#if body != null}
        <div class="modal-body">{@render body()}</div>
      {/if}
      {#if hasFooter}
        <div class="modal-footer">
          {#if footer != null}
            {@render footer()}
          {:else}
            {@render defaultFooter()}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
