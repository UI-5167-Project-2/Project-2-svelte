<script>
  import { onMount, onDestroy } from 'svelte';
  import DeviceDemonstration from './Device-Demonstration.svelte';
  import ActionInfoDialog from './Action-Info-Dialog.svelte';
  import DeviceCloseUp from './Device-Close-Up.svelte';
  // @ts-ignore
  import { BeltData, getToday } from '../Data-Store.svelte';

  // --- State Variables (All centralized here) ---
  let stepsCount = $state(0);
  let stairsCount = $state(0);
  let breathingRate = $state(12); // Breaths per minute (BPM)
  let breathCount = $state(0);
  let postureStatus = $state('Standing/Active');

  const sim_list = $state([
    // Add new actions in this format whenever a new function is created.
    {
      action: handleWalk,
      label: 'Start 10s Walk/Run',
      description: 'Simulates walking activity. This will increase your step count and show walking animations on the device visualization.',
      disabled: false
    },
    {
      action: handleSedentary,
      label: 'Simulate 30s Sedentary',
      description: 'Simulates sedentary activity like sitting or standing still. This will show appropriate posture status and breathing animations.',
      disabled: false
    },
    {
      action: () => {sim_list.forEach((button) => button.disabled = false) },
      label: "Test Item",
      description: "This item is a test.",
      disabled: false
    }
  ]);

  // State for DeviceViewer
  let viewAngleText = $state('Front (0°, 0°)');
  let buckle3DTransform = $state('rotateX(0deg) rotateY(0deg)');
  let viewBuckleFrameColor = $state('');
  let viewBucklePinColor = $state('');

  let animationInterval;
  let sedentaryTimeout;
  let breathingInterval;

  // References for SVG animation (Will be managed by DeviceSimulation)
  let bodyShape;
  let pantsShape;
  let belt;
  let buckleFrame;
  let bucklePin;
  let animatedElements;

  // Svelte reactivity handles changes to these styles directly (Passed as props to DeviceSimulation)
  let bodyShapeFill = $state('url(#bodyGradient)');
  let pantsShapeFill = $state('url(#pantsGradient)');
  let pantsShapeStroke = $state('#2c3e50');
  let beltFill = $state('url(#beltGradient)');
  let buckleFrameFill = $state('url(#buckleFrameGradient)');
  let bucklePinFill = $state('url(#bucklePinGradient)');

  // --- Core Animation Functions ---

  // This setup is moved here, but the SVG element bindings are in DeviceSimulation.svelte.
  // We'll need a mechanism to get the element references from the child component.
  // The simplest way is to pass a function down, but for this demo, let's keep the core functions that modify the state in the parent.

  const startBreathingCount = (rate) => {
    if (breathingInterval) clearInterval(breathingInterval);

    const intervalMs = (60 / rate) * 1000;

    breathingInterval = setInterval(() => {
      breathCount++;
      const today = BeltData.getDay(getToday().toISOString());
      if (today) {
        today.BreathCount = breathCount;
        BeltData.updateDay(getToday().toISOString(), today);
      }
    }, intervalMs);
  };

  // The SVG animation part is delegated to the child component via props/updates
  const startBreathingAnimation = () => {
    // Note: The actual animation logic on SVG elements is now triggered by state changes in DeviceSimulation.svelte
    startBreathingCount(breathingRate);
  };

  const startWalkingMotion = () => {
    // Note: The actual animation logic on SVG elements is now triggered by state changes in DeviceSimulation.svelte
  };

  // Function to get the SVG element references from the child component when it mounts
  const registerElements = (elements) => {
    animatedElements = elements;
    // After elements are registered, start the initial animations
    startBreathingAnimation();
  };

  const stopAllActivity = () => {
    if (animationInterval) clearInterval(animationInterval);
    if (sedentaryTimeout) clearTimeout(sedentaryTimeout);
    if (breathingInterval) clearInterval(breathingInterval);

    // Reset fills to SVG gradients
    bodyShapeFill = 'url(#bodyGradient)';
    pantsShapeFill = 'url(#pantsGradient)';
    pantsShapeStroke = '#2c3e50';
    beltFill = 'url(#beltGradient)';
    buckleFrameFill = 'url(#buckleFrameGradient)';
    bucklePinFill = 'url(#bucklePinGradient)';

    // Reset 3D view colors
    viewBuckleFrameColor = '';
    viewBucklePinColor = '';

    // Re-enable all buttons
    sim_list.forEach((button) => {
      button.disabled = false;
    });

    postureStatus = 'Standing/Active';
    breathingRate = 12;

    startBreathingAnimation();
  };

  // --- Simulation & Data Update Functions ---
  function handleAction(action) {
    // Function wrapper for any action. Makes sure that any repeated actions across
    // all simulations are done.

    // Disable all action buttons to prepare for an action. Buttons are re-enabled in
    // `stopAllActivity()`
  sim_list.forEach((button) => {
    button.disabled = true;
  })
  // Call the function for the action
  action()
  }

  function handleWalk() {
    const durationSeconds = 10;
    const today = BeltData.getDay(getToday().toISOString());
    const initialSteps = today?.StepCount ?? stepsCount;

    breathingRate = 18;
    startBreathingCount(breathingRate);
    startWalkingMotion();

    postureStatus = 'Walking';

    let elapsedUpdates = 0;
    const intervalTime = 100;
    const totalUpdates = (durationSeconds * 1000) / intervalTime;

    const finalSteps = initialSteps + 150;
    const finalStairs = stairsCount + 1;

    animationInterval = setInterval(() => {
      elapsedUpdates++;
      if (elapsedUpdates < totalUpdates) {
        stepsCount = Math.round((elapsedUpdates / totalUpdates) * 150 + initialSteps);

        const today = BeltData.getDay(getToday().toISOString());
        if (today) {
          today.StepCount = stepsCount;
          if (elapsedUpdates > totalUpdates / 2) {
            today.StairCount = finalStairs;
          }
          BeltData.updateDay(getToday().toISOString(), today);
        }

        if (elapsedUpdates > totalUpdates / 2) {
          stairsCount = finalStairs;
        }
      } else {
        clearInterval(animationInterval);

        setTimeout(() => {
          stopAllActivity();
        }, 2000);
      }
    }, intervalTime);
  }

  function handleSedentary() {
    postureStatus = 'Sitting/Inactive';

    breathingRate = 12;
    startBreathingCount(breathingRate);

    const sedentaryDuration = 5000;

    sedentaryTimeout = setTimeout(() => {
      postureStatus = '❌ Bad Posture/Move!';

      // Change SVG fills to solid warning colors
      bodyShapeFill = '#dc3545';
      pantsShapeFill = '#a94442';
      pantsShapeStroke = '#a94442';
      beltFill = '#ff7f50';
      buckleFrameFill = '#ff7f50';
      bucklePinFill = '#c0392b';

      // Update 3D view colors
      viewBuckleFrameColor = '#ff7f50';
      viewBucklePinColor = '#c0392b';

      setTimeout(() => {
        stopAllActivity();
      }, 2000);
    }, sedentaryDuration);
  }

  // --- Svelte Lifecycle Hooks ---
  onMount(() => {
    // Initial setup, the full startBreathingAnimation will run once elements are registered.
  });

  onDestroy(() => {
    if (animationInterval) clearInterval(animationInterval);
    if (sedentaryTimeout) clearTimeout(sedentaryTimeout);
    if (breathingInterval) clearInterval(breathingInterval);
  });
</script>

<!-- Top bar for control components -->
<div class="device-container">
  <div class="controls">
    <div class="dropdown">
      <button 
        class="btn btn-primary" 
        id="hamburger-btn"
        type="button" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
        aria-label="Menu"
      >
        <img src="/running-icon.svg" alt="Actions">
        <span class="dropdown-arrow">▼</span>
      </button>
      <ul class="dropdown-menu">
        <li>
          <div class="dropdown-item">
            Actions:
          </div>
        </li>
        {#each sim_list as simulation}
          <li>
            <div class="dropdown-item">

                <ActionInfoDialog
                  actionLabel = {simulation.label}
                  actionDesc = {simulation.description}
                />
              
                <button
                  class="btn btn-primary"
                  id="action"
                  onclick={() => handleAction(simulation.action)}
                  disabled={simulation.disabled}
                  >
                {simulation.label}
                </button>
              
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <div class="status-message">
      {postureStatus}
    </div>

    <div class="device-info">
      <button
        class="btn btn-secondary"
        >
        ⓘ
      </button>
    </div>
  </div>

  <!-- Component for the guy -->
  <div class="demonstration-container">
    <DeviceDemonstration
      {stepsCount}
      {stairsCount}
      {breathCount}
      {breathingRate}
      {postureStatus}
      {bodyShapeFill}
      {pantsShapeFill}
      {pantsShapeStroke}
      {beltFill}
      {buckleFrameFill}
      {bucklePinFill}
      handleWalk={() => handleWalk()}
      handleSedentary={() => handleSedentary()}
      registerElements={(e) => registerElements(e)}
        />
  </div> 
</div>
<style>
  .device-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .demonstration-container {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  #info {
    margin-right: 0;
  }

  #action {
    margin-left: 0;
  }

  .status-message {
    flex: 1; /* Take up remaining width */
    display: flex;
    align-items: center; /* Center vertically */
    justify-content: center; /* Center horizontally */
    text-align: center; /* Center text content */
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.1); /* Optional: add background for visibility */
    border-radius: 6px; /* Optional: match other elements */
    min-height: 2.5rem; /* Optional: ensure consistent height */
  }
  
  .controls {
    top: 10px;
    left: 10px;
    z-index: 10;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1em;
  }

  button:hover {
    background-color: #2980b9;
  }
  
  button:active {
    transform: scale(0.98);
  }
  
  button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }

  #hamburger-btn {
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  #hamburger-btn img {
    width: 1.6rem;
    height: 1.6rem;
    filter: invert(1); /* Makes the black icon white */
  }

  .dropdown-arrow {
    font-size: 0.8rem;
    color: white;
    opacity: 0.8;
    margin-left: 0.2rem;
  }

  .dropdown-item {
    margin: 0.125rem 0.25rem
  }

</style>
