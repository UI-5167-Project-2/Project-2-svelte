<script>
  import { onMount, onDestroy } from 'svelte';
  import DeviceDemonstration from './Device-Demonstration.svelte';
  import DeviceCloseUp from './Device-Close-Up.svelte';
  // @ts-ignore
  import { BeltData, getToday } from '../Data-Store.svelte';

  let activeTab = $state('demo');

  // --- State Variables (All centralized here) ---
  let stepsCount = $state(0);
  let stairsCount = $state(0);
  let breathingRate = $state(12); // Breaths per minute (BPM)
  let breathCount = $state(0);
  let postureStatus = $state('Standing/Active');
  
  let walkButtonText = $state('Start 10s Walk/Run');
  let sedentaryButtonText = $state('Simulate 30s Sedentary');
  
  let walkButtonDisabled = $state(false);
  let sedentaryButtonDisabled = $state(false);

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

    walkButtonDisabled = false;
    sedentaryButtonDisabled = false;

    postureStatus = 'Standing/Active';
    breathingRate = 12;

    startBreathingAnimation();
  };

  // --- Simulation & Data Update Functions ---
  function handleAction(action) {
    // Function wrapper for any action. Makes sure that any repeated actions across
    // all simulations are done.

    // Disable all action buttons to prepare for an action
    sim_list.forEach((button) => {
      button.disabled = true;
    })

    action()

    // re-enable all action buttons to prepare for an action
    sim_list.forEach((button) => {
      button.disabled = false;
    })

  }


  function handleWalk() {
    if (walkButtonDisabled) return;

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

        setTimeout(() => stopAllActivity(), 2000);
      }
    }, intervalTime);
  }

  function handleSedentary() {
    if (sedentaryButtonDisabled) return;

    walkButtonDisabled = true;
    sedentaryButtonDisabled = true;
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
<div class="controls">
  <div class="dropdown">
    <button 
      class="btn btn-outline-secondary hamburger-btn" 
      type="button" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
      aria-label="Menu"
    >
      <i class="bi bi-list"></i>
    </button>
    <ul class="dropdown-menu">
      <li>
        <div class="dropdown-item-wrapper d-flex justify-content-between align-items-center">
          Actions:
        </div>
      </li>
      {#each sim_list as simulation}
        <li>
          <div class="">
            <button
              class="btn btn-link text-start p-0 flex-grow-1"
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
</div>

<!-- Component for the guy -->
<DeviceDemonstration
  {stepsCount}
  {stairsCount}
  {breathCount}
  {breathingRate}
  {postureStatus}
  {walkButtonText}
  {sedentaryButtonText}
  {walkButtonDisabled}
  {sedentaryButtonDisabled}
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

<style>
  .content-view-container {
    overflow-y: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .controls {
    top: 10px;
    left: 10px;
    z-index: 10;
  }

  .hamburger-btn {
    width: 40px;
    height: 40px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }

  .hamburger-btn i {
    font-size: 1.2rem;
  }

  button {
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #3498db;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.1s ease;
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

  .dropdown-item-wrapper {
    padding: 0.25rem 1rem;
  }

  .dropdown-item-wrapper:hover {
    background-color: #f8f9fa;
  }

  .dropdown-item-wrapper button:first-child {
    color: #212529 !important;
    text-decoration: none !important;
  }

  .dropdown-item-wrapper button:first-child:disabled {
    color: #6c757d !important;
    opacity: 0.65;
  }

</style>
