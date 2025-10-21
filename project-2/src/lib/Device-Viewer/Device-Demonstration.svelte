<script>
  import { onMount, onDestroy } from 'svelte';
  import { BeltData, getToday } from '../Data-Store.svelte.js';

  // --- Props Received from Parent (App.svelte) ---
  let {
    postureStatus,
    bodyShapeFill,
    pantsShapeFill,
    pantsShapeStroke,
    beltFill,
    buckleFrameFill,
    bucklePinFill,
    registerElements = null,
  } = $props();

  // --- Internal State & Dispatcher ---
  let animatedElements;

  // References to the SVG elements for animation
  let bodyShape;
  let pantsShape;
  let belt;
  let buckleFrame;
  let bucklePin;

  // Animation management variables (Internal to this component)
  let initialAnimationInterval;

  // --- Animation Logic (Reacting to Prop/State Changes in Parent) ---

  const startBreathingVisuals = () => {
    const breathDuration = 5000;

    // Cancel any existing breathing animations
    if (animatedElements) {
      animatedElements.forEach((el) => {
        if (el && typeof el.getAnimations === 'function') {
          el.getAnimations().forEach((anim) => anim.cancel());
          el.style.transform = 'none'; // Reset to prevent visual jumps
        }
      });
    }

    // Start new breathing animation
    if (animatedElements) {
      animatedElements.forEach((el) => {
        if (el && typeof el.animate === 'function') {
          el.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }],
            { duration: breathDuration, iterations: Infinity, easing: 'ease-in-out' }
          );
        }
      });
    }
  };

  const startWalkingVisuals = () => {
    [belt, buckleFrame, bucklePin].forEach((element) => {
      if (element && typeof element.animate === 'function') {
        element.animate(
          [
            { transform: 'rotate(0deg) translateX(0px)' },
            { transform: 'rotate(2deg) translateX(1px)' },
            { transform: 'rotate(-2deg) translateX(-1px)' },
            { transform: 'rotate(0deg) translateX(0px)' },
          ],
          { duration: 300, iterations: Infinity }
        );
      }
    });
  };

  const startBadPostureShake = () => {
    [buckleFrame, bucklePin].forEach((element) => {
      if (element && typeof element.animate === 'function') {
        element.animate(
          [
            { transform: 'translateX(0px)' },
            { transform: 'translateX(3px)' },
            { transform: 'translateX(-3px)' },
            { transform: 'translateX(0px)' },
          ],
          { duration: 200, iterations: 10 }
        );
      }
    });
  };

  // Reactive block to handle animation based on postureStatus changes (simplified)
  $effect(() => {
    if (postureStatus === 'Walking') {
      startWalkingVisuals();
      startBreathingVisuals();
      // Speed up animation to simulate higher activity
      if (animatedElements) {
        animatedElements.forEach((el) =>
          el.getAnimations().forEach((anim) => (anim.playbackRate = 5000 / 3300))
        );
      }
    } else if (postureStatus === 'Sitting/Inactive' || postureStatus === 'Standing/Active') {
      startBreathingVisuals();
      // Reset speed
      if (animatedElements) {
        animatedElements.forEach((el) =>
          el.getAnimations().forEach((anim) => (anim.playbackRate = 1))
        );
      }
    } else if (postureStatus === '❌ Bad Posture/Move!') {
      startBadPostureShake();
    }
  });

  // --- Lifecycle Hooks ---
  onMount(() => {
    // Collect all elements and filter out any that failed to bind
    animatedElements = [bodyShape, pantsShape, belt, buckleFrame, bucklePin].filter(
      (el) => el !== undefined
    );
    // Send the elements back to the parent so it can control/reference them if needed
    // dispatch('registerelements', animatedElements);
    registerElements(animatedElements);

    // Initial call to start the visuals
    startBreathingVisuals();
  });

  onDestroy(() => {
    // Clean up any internal animations/intervals if necessary
  });
</script>

<div class="container">
  <!-- the guy -->
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 100 120"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <!-- SVG Gradients -->
      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #b0e0ed; stop-opacity: 1" />
        <stop offset="50%" style="stop-color: #a0d2eb; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #80b0d3; stop-opacity: 1" />
      </linearGradient>
      <linearGradient id="pantsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #4a657f; stop-opacity: 1" />
        <stop offset="50%" style="stop-color: #34495e; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #202e3b; stop-opacity: 1" />
      </linearGradient>
      <linearGradient id="beltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #8d6e63; stop-opacity: 1" />
        <stop offset="50%" style="stop-color: #6d4c41; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #5a3f35; stop-opacity: 1" />
      </linearGradient>
      <linearGradient id="buckleFrameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #e0e0e0; stop-opacity: 1" />
        <stop offset="50%" style="stop-color: #c0c0c0; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #a0a0a0; stop-opacity: 1" />
      </linearGradient>
      <linearGradient id="bucklePinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: #5c6e7d; stop-opacity: 1" />
        <stop offset="50%" style="stop-color: #34495e; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: #1e2833; stop-opacity: 1" />
      </linearGradient>
    </defs>

    <!-- Shirt -->
    <path
      bind:this={bodyShape}
      d="M 20 0 L 20 45 L 80 45 L 80 0 Z"
      fill={bodyShapeFill}
      stroke="#333"
      stroke-width="1"
      transform-origin="50 30"
    ></path>

    <!-- Pants -->
    <path
      bind:this={pantsShape}
      d="M 80 45 L 80 55 L 80 90 C 80 100, 70 105, 53 105 L 53 80 L 48 80 L 48 105 C 30 105, 20 100, 20 90 L 20 55 L 20 45 Z"
      fill={pantsShapeFill}
      stroke={pantsShapeStroke}
      stroke-width="1"
      transform-origin="50 75"
    ></path>

    <!-- Belt -->
    <rect bind:this={belt} x="20" y="52" width="60" height="10" fill={beltFill} rx="3" ry="3"
    ></rect>

    <!-- Belt Buckle -->
    <rect
      bind:this={buckleFrame}
      x="42"
      y="50"
      width="16"
      height="14"
      rx="3"
      ry="3"
      fill={buckleFrameFill}
      stroke="#7f8c8d"
      stroke-width="1.5"
      transform-origin="50 57"
    ></rect>

    <!-- Belt Pin -->
    <rect
      bind:this={bucklePin}
      x="48"
      y="53"
      width="4"
      height="8"
      rx="1"
      ry="1"
      fill={bucklePinFill}
      stroke="#2c3e50"
      stroke-width="0.5"
      transform-origin="50 57"
    ></rect>
  </svg>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em 0em;

    flex: 1; /* Allows it to take equal space */
    min-width: 300px;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden; /* Prevent scrolling */
    box-sizing: border-box; /* Include padding in height calculation */
  }

  svg {
    border: 2px solid #bdc3c7;
    border-radius: 8px;
    background-color: #ecf0f1;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    flex: 1; /* Allow SVG to shrink if needed */
    min-height: 0;
    object-fit: contain;
  }

  path,
  rect {
    transform-box: fill-box;
    transform-origin: center;
    transition:
      fill 0.5s ease-in-out,
      stroke 0.5s ease-in-out;
  }
</style>
