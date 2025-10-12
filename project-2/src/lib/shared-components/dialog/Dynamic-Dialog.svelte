<!-- 
   @component
   The Dynamic Dialog Component
   @param {string} dialogButtonSeverity Button coloring, Required Type = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
   @param {string} buttonLabel Text for the label
   @param {string} buttonIcon class for the icon (only include the class name i.e bi-plus and not bi bi-plus)
   @param {string} headerText Text for the header of the component
   @param {boolean} smallWindow Indicates how sizing of the dialog should be set
   @param {boolean} hasFooter Indicates if a footer should be added (must be tru if assing a footer)
   @param {} body This is a snippet which includes the body for the dialog
   @param {} footer This is a snippet which includes the footer for the dialog (please use the DialogSaveButton component for proper dialog closing)
   @param {} openButton This is a snippet which includes a custom open button
   @param {} close This is a value call back when the dialog closes (this allows information to be passed back)
 -->

<!-- Code utilized from Bootstrap's documentation: https://getbootstrap.com/docs/5.3/components/modal/ -->
<script>
  import { generateDialogID } from '../../utils/dynamic-dialog-id';
  let {
    dialogButtonSeverity = 'primary',
    buttonLabel = '',
    buttonIcon = '',
    headerText = '',
    body = null,
    footer = null,
    openbutton = null,
    generatedID = generateDialogID(),
    close = null,
    smallWindow = false,
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

<!-- Modal -->
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
