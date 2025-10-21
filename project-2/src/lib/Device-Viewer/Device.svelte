<script>
  import { onMount, onDestroy } from 'svelte';
  import DeviceDemonstration from './Device-Demonstration.svelte';
  import ActionInfoDialog from './Action-Info-Dialog.svelte';
  import DeviceCloseUp from './Device-Close-Up.svelte';
  // @ts-ignore
  import { BeltData, getToday } from '../Data-Store.svelte';
  import InLineDialog from '../shared-components/dialog/In-Line-Dialog.svelte';
  import InLineDialogOpenButton from '../shared-components/dialog/In-Line-Dialog-Open-Button.svelte';
  import DynamicDialog from '../shared-components/dialog/Dynamic-Dialog.svelte';
  import NumberLine from '../shared-components/Number-Line.svelte';
  import { DeviceStatus } from '../Device-Status-Store.svelte';

  // --- State Variables (All centralized here) ---
  let stepsCount = $state(0);
  let stairsCount = $state(0);
  let breathingRate = $state(12); // Breaths per minute (BPM)
  let breathCount = $state(0);
  let postureStatus = $state('Standing/Active');

  let invalidTimeRange = $state(false);
  let timeRanges = $state([]); // Track time ranges
  let currentSimulationTime = $state(0);

  const statusText = $derived(DeviceStatus.getStatus());

  const sim_list = $state([
    // Add new actions in this format whenever a new function is created.
    {
      id: 'walk',
      action: handleWalk,
      label: 'Start 10s Walk/Run',
      description:
        'Simulates walking activity. This will increase your step count and show walking animations on the device visualization.',
      disabled: false,
    },
    {
      id: 'stair',
      action: handleStairs,
      label: 'Start 10s Walk up Stairs',
      description:
        'Simulates going up stairs activity. This will increase your stair count and show walking animations on the device visualization.',
      disabled: false,
    },
    {
      id: 'sedentary',
      action: handleSedentary,
      label: 'Simulate Sedentary Alert',
      description:
        'Simulates sedentary activity like sitting or standing still. This will show appropriate posture status and breathing animations.',
      disabled: false,
    },
    {
      id: 'DND',
      action: handleDoNotDisturb,
      label: 'Simulate Do Not Disturb Mode',
      description:
        'Simulates a day through wearing the belt, given a few ranges of time. During these ranges, the belt will be considered inactive. ',
      disabled: false,
    },
    // {
    //   id: 'test',
    //   action: () => {
    //     sim_list.forEach((button) => (button.disabled = false));
    //   },
    //   label: 'Test Item',
    //   description: 'This item is a test.',
    //   disabled: false,
    // },
  ]);

  // Effect to update DND button based on invalidTimeRange and timeRanges
  $effect(() => {
    const dndButton = sim_list.find((button) => button.id === 'DND');
    if (dndButton) {
      // Disable if ranges overlap OR if no ranges are defined
      dndButton.disabled = invalidTimeRange || timeRanges.length === 0;
    }
  });

  // State for DeviceViewer
  let viewAngleText = $state('Front (0°, 0°)');
  let buckle3DTransform = $state('rotateX(0deg) rotateY(0deg)');
  let viewBuckleFrameColor = $state('');
  let viewBucklePinColor = $state('');

  let animationInterval;
  let sedentaryTimeout;
  let breathingInterval;
  let dndInterval;

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
      const today = BeltData.getDay(getToday().toISOString());
      if (today && DeviceStatus.getStatus() === 'wifi') {
        breathCount++;
        today.BreathCount = today.BreathCount + 1;
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
    if (dndInterval) clearInterval(dndInterval);

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
    });
    // Call the function for the action
    action();
  }

  function handleWalk() {
    const durationSeconds = 10;
    const today = BeltData.getDay(getToday().toISOString());
    // Each click counts as 10 seconds towards the stand goal. Store as minutes (fractional).
    if (today && DeviceStatus.getStatus() === 'wifi') {
      const addedMinutes = durationSeconds / 60; // 10 seconds -> 0.166666...
      today.StandMinutes = (today.StandMinutes ?? 0) + addedMinutes;
      BeltData.updateDay(getToday().toISOString(), today);
    }
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
        const today = BeltData.getDay(getToday().toISOString());
        if (today && DeviceStatus.getStatus() === 'wifi') {
          stepsCount = Math.round((elapsedUpdates / totalUpdates) * 150 + initialSteps);
          today.StepCount = stepsCount;
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

  function handleStairs() {
    const durationSeconds = 10;
    const today = BeltData.getDay(getToday().toISOString());
    // Each click counts as 10 seconds towards the stand goal. Store as minutes (fractional).
    if (today && DeviceStatus.getStatus() === 'wifi') {
      const addedMinutes = (durationSeconds * 6) / 60; // 10 seconds -> 0.166666...
      today.StandMinutes = (today.StandMinutes ?? 0) + addedMinutes;
      BeltData.updateDay(getToday().toISOString(), today);
    }
    const initialStairs = today.StairCount ?? stairsCount;
    const initialSteps = today.StepCount ?? stepsCount;

    breathingRate = 30;
    startBreathingCount(breathingRate);
    startWalkingMotion();

    postureStatus = 'Climbing Stairs';

    let elapsedUpdates = 0;
    const intervalTime = 100;
    const totalUpdates = (durationSeconds * 1000) / intervalTime;

    const finalSteps = initialStairs + 50;

    animationInterval = setInterval(() => {
      elapsedUpdates++;
      if (elapsedUpdates < totalUpdates) {
        const today = BeltData.getDay(getToday().toISOString());
        if (today && DeviceStatus.getStatus() === 'wifi') {
          stairsCount = Math.round((elapsedUpdates / totalUpdates) * 50 + initialStairs);
          stepsCount = Math.round((elapsedUpdates / totalUpdates) * 50 + initialSteps);
          today.StairCount = stairsCount;
          today.StepCount = stepsCount;
          BeltData.updateDay(getToday().toISOString(), today);
        }

        if (elapsedUpdates > totalUpdates / 2) {
          // stairsCount = finalStairs;
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

  function handleDoNotDisturb() {
    // Ticks twice per second, 30 minute intervals per tick.
    // Every tick, there's a 1/5 chance to be sedentary.
    // Visually, a red indicator will move across the line in the intervals.

    // Helper function for do not disturb range
    function isInDNDRange(currentHour) {
      return timeRanges.some((range) => {
        const wraps = range.end < range.start;
        // Range wraps around midnight
        if (wraps) return currentHour >= range.start || currentHour <= range.end;
        // Normal range
        else return currentHour >= range.start && currentHour <= range.end;
      });
    }

    currentSimulationTime = 0; // Start the simulation at midnight

    const ticksPerSecond = 2;
    const intervalMs = 1000 / ticksPerSecond; // 500ms per tick
    const hoursPerTick = 0.5; // 30 minutes = 0.5 hours
    const totalTicks = 24 / hoursPerTick; // 24 hours / 0.5 hours per tick

    let tickCount = 0;

    postureStatus = 'Simulating 24-hour period...';

    dndInterval = setInterval(() => {
      currentSimulationTime = tickCount * hoursPerTick;

      // Check if current time is in DND range
      const inDNDRange = isInDNDRange(currentSimulationTime);

      if (inDNDRange) {
        // During DND: belt is inactive, show red indicator
        postureStatus = `DND Active (${Math.floor(currentSimulationTime)}:${((currentSimulationTime % 1) * 60).toString().padStart(2, '0')})`;
        bodyShapeFill = '#6c757d'; // Gray out during DND
        pantsShapeFill = '#495057';
        beltFill = 'url(#beltGradient)';
        buckleFrameFill = 'url(#buckleFrameGradient)';
        bucklePinFill = 'url(#bucklePinGradient)';
        viewBuckleFrameColor = '#dc3545';
        viewBucklePinColor = '#a94442';

        // No activity tracking during DND
      } else {
        // Outside DND: normal activity
        const isSedentary = Math.random() < 0.2; // 1/5 chance

        if (isSedentary) {
          postureStatus = `Sedentary (${Math.floor(currentSimulationTime)}:${((currentSimulationTime % 1) * 60).toString().padStart(2, '0')})`;
          bodyShapeFill = 'url(#bodyGradient)'; // Normal body gradient
          pantsShapeFill = 'url(#pantsGradient)'; // Normal pants gradient
          beltFill = '#dc3545'; // Red indicator for sedentary
          buckleFrameFill = '#dc3545';
          bucklePinFill = '#a94442';
          viewBuckleFrameColor = '#dc3545';
          viewBucklePinColor = '#a94442';
        } else {
          postureStatus = `Active (${Math.floor(currentSimulationTime)}:${((currentSimulationTime % 1) * 60).toString().padStart(2, '0')})`;
          bodyShapeFill = 'url(#bodyGradient)'; // Normal body gradient
          pantsShapeFill = 'url(#pantsGradient)'; // Normal pants gradient
          beltFill = '#28a745'; // Green for active
          buckleFrameFill = '#28a745';
          bucklePinFill = '#218838';
          viewBuckleFrameColor = '#28a745';
          viewBucklePinColor = '#218838';

          // Track activity
          const today = BeltData.getDay(getToday().toISOString());
          if (today && DeviceStatus.getStatus() === 'wifi') {
            today.StepCount += Math.floor(Math.random() * 50) + 20; // Random steps
            BeltData.updateDay(getToday().toISOString(), today);
            stepsCount = today.StepCount;
          }
        }
      }

      tickCount++;

      // Check if simulation is complete
      if (tickCount >= totalTicks) {
        clearInterval(dndInterval);
        dndInterval = null;

        setTimeout(() => {
          postureStatus = 'DND Simulation Complete!';
          setTimeout(() => {
            stopAllActivity();
          }, 2000);
        }, 500);
      }
    }, intervalMs);
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
  <div class="d-flex flex-row justify-content-between align-items-center">
    <div class="dropdown">
      <button
        class="btn btn-primary"
        id="hamburger-btn"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Menu"
        disabled={statusText !== 'wifi'}
      >
        <i class="bi bi-person-walking fs-5"></i>
        <span class="dropdown-arrow">▼</span>
      </button>
      <ul class="dropdown-menu">
        <li>
          <div class="dropdown-item">Actions:</div>
        </li>
        {#each sim_list as simulation}
          <li>
            <div class="dropdown-item">
              <InLineDialogOpenButton
                generatedID="{simulation.id}dialog"
                buttonIcon="bi bi-info-circle fs-5 "
              />

              <button
                class="btn btn-primary fs-5"
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

    <div>
      {#snippet body()}
        <div>
          <h2>Smart Belt Simulation Guide</h2>

          <p>
            The **Smart Belt** is a simulated wearable device designed to track activity and
            posture. This interface allows you to test the belt's various operational states and
            data outputs without physical interaction.
          </p>

          <hr />

          <h3>Simulation Actions</h3>

          <div>
            <div>
              <span>🚶 Start 10s Walk/Run</span>
              <p>
                Simulates continuous motion. This increases your **step count** and triggers
                **walking animations** on the device visualization.
              </p>
            </div>

            <div>
              <span>🪜 Start 10s Walk up Stairs</span>
              <p>
                Simulates sustained vertical motion. This increases both your **step count** and
                **stair count**, showing corresponding animations.
              </p>
            </div>

            <div>
              <span>🛋️ Simulate Sedentary Alert</span>
              <p>
                Simulates prolonged inactivity. After a threshold, this triggers a **sedentary
                alert** and may show a **bad posture shake** on the visualization.
              </p>
            </div>

            <div>
              <span>🌙 Simulate Do Not Disturb Mode</span>
              <p>
                Simulates intentional periods of inactivity (e.g., sleep). The belt is marked
                inactive during preset time ranges, and **no data or alerts** will be generated.
              </p>
            </div>
          </div>
        </div>
      {/snippet}

      <DynamicDialog
        headerText="Info"
        hasFooter={false}
        close={() => {}}
        dialogButtonSeverity="secondary"
        buttonIcon="bi bi-info-circle fs-5"
        {body}
      />
    </div>
  </div>

  {#each sim_list as simulation}
    {#snippet body()}
      <p>{simulation.description}</p>
    {/snippet}
    <InLineDialog
      generatedID="{simulation.id}dialog"
      headerText={simulation.label}
      hasFooter={false}
      close={() => {}}
      {body}
    />
  {/each}

  <!-- Component for the guy -->
  <div class="demonstration-container">
    <DeviceDemonstration
      {postureStatus}
      {bodyShapeFill}
      {pantsShapeFill}
      {pantsShapeStroke}
      {beltFill}
      {buckleFrameFill}
      {bucklePinFill}
      registerElements={(e) => registerElements(e)}
    />
  </div>

  <NumberLine
    switchEnable={true}
    label="Enable Do Not Disturb Hours simulation?"
    switchAlternateLabel="Use the range to select Do Not Disturb Hours"
    bind:disableButton={invalidTimeRange}
    bind:ranges={timeRanges}
    disabled={statusText !== 'wifi'}
  />
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
</style>
