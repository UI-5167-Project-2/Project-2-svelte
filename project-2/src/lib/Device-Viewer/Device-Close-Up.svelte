<script>
  import { createEventDispatcher } from 'svelte';

  // --- Props Received from Parent ---
  export let buckle3DTransform;
  export let viewAngleText;
  export let viewBuckleFrameColor;
  export let viewBucklePinColor;

  // Dispatcher to send events back to the parent
  const dispatch = createEventDispatcher();

  // Function to handle button click and dispatch the event
  const changeBuckleView = (viewId) => {
    dispatch('changeview', viewId);
  };
</script>

<div class="buckle-viewer">
  <h2>Buckle Close-up View 🔍</h2>
  <div class="buckle-stage">
    <div id="buckle3D" class="buckle-3d" style="transform: {buckle3DTransform};">
      <div id="view-buckleFrame" style:background-color={viewBuckleFrameColor || null}></div>
      <div id="view-bucklePin" style:background-color={viewBucklePinColor || null}></div>
    </div>
  </div>

  <p>Current View Angle: <span>{viewAngleText}</span></p>
  <div class="d-pad-container">
    <div class="d-pad-grid">
      <button on:click={() => changeBuckleView(1)}>Side (R)</button>
      <button on:click={() => changeBuckleView(2)}>Top</button>
      <button on:click={() => changeBuckleView(3)}>Side (L)</button>
      <button on:click={() => changeBuckleView(4)}>Bottom</button>
      <button on:click={() => changeBuckleView(5)}>Front</button>
    </div>
  </div>
</div>

<style>
  /* Define CSS Gradients matching the SVG Gradients' colors/direction */
  :root {
    /* Buckle Frame Gradient: Light Grey -> Mid Grey -> Dark Grey, Diagonal */
    --view-buckle-frame-gradient: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 50%, #a0a0a0 100%);
    /* Buckle Pin Gradient: Light Blue-Grey -> Mid Blue-Grey -> Dark Blue-Grey, Diagonal */
    --view-buckle-pin-gradient: linear-gradient(135deg, #5c6e7d 0%, #34495e 50%, #1e2833 100%);
  }

  .buckle-viewer {
    background-color: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    width: 100%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    flex: 1; /* Allows it to take equal space */
    min-width: 300px;
  }

  .buckle-stage {
    perspective: 1000px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .buckle-3d {
    width: 80px;
    height: 80px;
    transform-style: preserve-3d;
    transition: transform 0.5s ease-out;
    position: relative;
    transform-origin: 50% 50% -20px;
  }

  /* APPLYING THE GRADIENT AS DEFAULT BACKGROUND-IMAGE */
  #view-buckleFrame {
    width: 100%;
    height: 100%;
    /* Use background-image only if background-color prop is NOT set */
    background-image: var(--view-buckle-frame-gradient);
    border-radius: 20px;
    position: absolute;
    transform: translateZ(2px);
    border: 7px solid #a0a0a0;
  }
  #view-bucklePin {
    width: 25%;
    height: 50%;
    /* Use background-image only if background-color prop is NOT set */
    background-image: var(--view-buckle-pin-gradient);
    border-radius: 4px;
    position: absolute;
    top: 25%;
    left: 37.5%;
    transform: translateZ(4px);
    border: 1px solid #1e2833;
  }

  .d-pad-container {
    margin-top: 20px;
  }
  .d-pad-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      '. top .'
      'side-l front side-r'
      '. bottom .';
    gap: 10px;
    width: 250px;
    margin: 0 auto;
  }
  .d-pad-grid button {
    background-color: #e67e22;
    padding: 8px;
    font-size: 0.8rem;
  }
  .d-pad-grid button:hover {
    background-color: #d35400;
  }
  .d-pad-grid button:nth-child(1) {
    grid-area: side-r;
  }
  .d-pad-grid button:nth-child(2) {
    grid-area: top;
  }
  .d-pad-grid button:nth-child(3) {
    grid-area: side-l;
  }
  .d-pad-grid button:nth-child(4) {
    grid-area: bottom;
  }
  .d-pad-grid button:nth-child(5) {
    grid-area: front;
  }
</style>
