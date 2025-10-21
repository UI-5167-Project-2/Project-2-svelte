<!-- 
  @component
  A number line representing a 24-hour time span with support for up to two time ranges. When ranges overlap,  
  they show an alert and can disable a button in its parent component
  @param {Array} ranges - Array of time ranges [{start: number, end: number}, ...] (max 2 ranges)
  @param {bool} disableButton - Bindable boolean. True when time ranges are invalid in some way.
  @param {string} label - Label for the number line
 -->
<script>
  let { 
    ranges = $bindable([]), 
    disableButton = $bindable(false),
    label = '24-Hour Timeline',
  } = $props();
  
  let dragging = null; // {rangeIndex: number, type: 'start'|'end'}
  let numberLineRef = null;
  
  // Ensure we have at most 2 ranges
  $effect(() => {
    if (ranges.length > 2) {
      ranges = ranges.slice(0, 2);
    }
  });
  
  // Convert hour to percentage position (0-24 hours to 0-100%)
  function hourToPercent(hour) {
    // Adjust for 1% padding on each side (98% usable space)
    return 1 + ((hour / 24) * 98);
  }
  
  // Convert percentage position to hour (0-100% to 0-24 hours)
  function percentToHour(percent) {
    // Adjust for 1% padding on each side (98% usable space)
    const adjustedPercent = Math.max(0, Math.min(100, ((percent - 1) / 98) * 100));
    return Math.round((adjustedPercent / 100) * 24 * 2) / 2; // Round to nearest 0.5 hour
  }
  
  // Format hour as time string (e.g., 0 -> "00:00", 13.5 -> "13:30")
  function formatTime(hour) {
    const h = Math.floor(hour);
    const m = (hour % 1) * 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  
  // Handle mouse down on handle
  function handleMouseDown(rangeIndex, type, event) {
    event.preventDefault();
    dragging = { rangeIndex, type };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
  
  // Handle mouse move while dragging
  function handleMouseMove(event) {
    if (!dragging || !numberLineRef) return;
    
    const rect = numberLineRef.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newHour = percentToHour(percent);
    
    const range = ranges[dragging.rangeIndex];
    if (dragging.type === 'start') {
      range.start = newHour;
    } else {
      range.end = newHour;
    }
    ranges = [...ranges]; // Trigger reactivity
  }
  
  // Handle mouse up
  function handleMouseUp() {
    dragging = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
  
  // Add a new range
  function addRange() {
    if (ranges.length < 2) {
      ranges = [...ranges, { start: 8, end: 17 }];
    }
  }
  
  // Remove a range
  function removeRange(index) {
    ranges = ranges.filter((_, i) => i !== index);
  }
  
  // Check if two ranges overlap
  function rangesOverlap(range1, range2) {
    // TODO: fix both endpoints being the same (two ranges are exactly equal).
    const wrap1 = range1.end < range1.start;
    const wrap2 = range2.end < range2.start;
    // Special case: one range completely contains the other
    // For wrapped ranges, check if they overlap at midnight
    if (wrap1 && wrap2) return true;
    
    // Helper function to check if a time falls within a range (exclusive of endpoints for touching check)
    function timeInRange(time, rangeStart, rangeEnd, wraps) {
      if (time === rangeStart || time === rangeEnd) return false; 
      
      // Range wraps around midnight
      if (wraps) return time >= rangeStart || time <= rangeEnd;
      // Normal range
      else return time >= rangeStart && time <= rangeEnd;
      
    }
    
    // Check if any endpoint of range1 is inside range2 or vice versa (excluding exact matches)
    if (timeInRange(range1.start, range2.start, range2.end, wrap2)) return true;
    if (timeInRange(range1.end, range2.start, range2.end, wrap2)) return true;
    if (timeInRange(range2.start, range1.start, range1.end, wrap1)) return true;
    if (timeInRange(range2.end, range1.start, range1.end, wrap1)) return true;
    
    return false;
  }
  
  // Check if ranges have any overlaps
  function hasOverlap() {
    if (ranges.length < 2) return false;
    return rangesOverlap(ranges[0], ranges[1])
  }

  $effect(() => {
    disableButton = hasOverlap();
  })

</script>

<div class="number-line-container">
  <div style="display: flex; flex-direction: row; gap: 1em; align-items: center">
    Do Not Disturb Hours: 
    {#if disableButton}
      <div class="alert alert-warning" role="alert">
        Time ranges overlap
      </div>
    {/if}
  </div>
  <div class="number-line-wrapper">
    <!-- Number line -->
    <div 
      class="number-line" 
      bind:this={numberLineRef}
    >
      <!-- Hour markers -->
      {#each Array(25) as _, i}
        {@const leftPercent = 1 + ((i / 24) * 98)}
        <div 
          class="hour-marker" 
          style="left: {leftPercent}%"
        >
          <div class="marker-line"></div>
          {#if i <= 24}
            <div class="marker-label">{i}</div>
          {/if}
        </div>
      {/each}
      
      <!-- Time ranges -->
      {#each ranges as range, index}
        {@const startPercent = hourToPercent(range.start)}
        {@const endPercent = hourToPercent(range.end)}
        {@const wrapsAround = range.end < range.start}
        
        {#if wrapsAround}
          <!-- First segment: from start to midnight (24) -->
          {@const width1 = hourToPercent(24) - startPercent}
          <div 
            class="time-range range-{index + 1}"
            style="left: {startPercent}%; width: {width1}%"
          >
            <!-- Start handle -->
            <div 
              class="handle start-handle"
              onmousedown={(e) => handleMouseDown(index, 'start', e)}
              role="button"
              tabindex="0"
              aria-label="Start time: {formatTime(range.start)}"
            >
              <div class="handle-label">{formatTime(range.start)}</div>
            </div>
            
            <!-- Range bar -->
            <div class="range-bar"></div>
          </div>
          
          <!-- Second segment: from midnight (0) to end -->
          {@const width2 = endPercent - hourToPercent(0)}
          <div 
            class="time-range range-{index + 1}"
            style="left: {hourToPercent(0)}%; width: {width2}%"
          >
            <!-- Range bar -->
            <div class="range-bar"></div>
            
            <!-- End handle -->
            <div 
              class="handle end-handle"
              onmousedown={(e) => handleMouseDown(index, 'end', e)}
              role="button"
              tabindex="0"
              aria-label="End time: {formatTime(range.end)}"
            >
              <div class="handle-label">{formatTime(range.end)}</div>
            </div>
          </div>
        {:else}
          <!-- Normal range: from start to end -->
          {@const width = endPercent - startPercent}
          <div 
            class="time-range range-{index + 1}"
            style="left: {startPercent}%; width: {width}%"
          >
            <!-- Start handle -->
            <div 
              class="handle start-handle"
              onmousedown={(e) => handleMouseDown(index, 'start', e)}
              role="button"
              tabindex="0"
              aria-label="Start time: {formatTime(range.start)}"
            >
              <div class="handle-label">{formatTime(range.start)}</div>
            </div>
            
            <!-- Range bar -->
            <div class="range-bar"></div>
            
            <!-- End handle -->
            <div 
              class="handle end-handle"
              onmousedown={(e) => handleMouseDown(index, 'end', e)}
              role="button"
              tabindex="0"
              aria-label="End time: {formatTime(range.end)}"
            >
              <div class="handle-label">{formatTime(range.end)}</div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
  
  <!-- Controls -->
  <div class="controls mt-3">
    
    
    {#each ranges as range, index}
      {@const wrapsAround = range.end < range.start}
      <div class="range-control">
        <span class="range-badge range-{index + 1}">Range {index + 1}</span>
        <span class="range-info">
          {formatTime(range.start)} - {formatTime(range.end)}
          {#if wrapsAround}
            <span class="wrap-indicator">(next day)</span>
          {/if}
        </span>
        <button 
          class="btn btn-sm btn-outline-danger"
          onclick={() => removeRange(index)}
        >
          Remove
        </button>
      </div>
    {/each}
    
    {#if ranges.length < 2}
      <button 
        class="btn btn-sm btn-primary"
        onclick={addRange}
      >
        Add Time Range
      </button>
    {/if}
  </div>
</div>

<style>
  .number-line-container {
    margin-bottom: 1rem;
  }
  
  .number-line-wrapper {
    padding: 1.5rem 0 1.5rem 0;
  }
  
  .number-line {
    position: relative;
    height: 40px;
    background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
    border: 2px solid #dee2e6;
    border-radius: 8px;
    user-select: none;
    padding: 0px 5px;
  }
  
  .hour-marker {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
  }
  
  .marker-line {
    width: 2px;
    height: 10px;
    background-color: #6c757d;
    margin-top: 5px;
  }
  
  .marker-label {
    font-size: 0.75rem;
    color: #6c757d;
    margin-top: 2px;
  }
  
  .time-range {
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    pointer-events: none;
  }
  
  .time-range.range-1 {
    --range-color: #0d6efd;
  }
  
  .time-range.range-2 {
    --range-color: #198754;
  }
  
  .range-bar {
    flex: 1;
    height: 60%;
    background-color: var(--range-color);
    opacity: 0.5;
    border-radius: 4px;
  }
  
  .handle {
    position: relative;
    width: 20px;
    height: 30px;
    background-color: var(--range-color);
    border: 2px solid white;
    border-radius: 4px;
    cursor: grab;
    pointer-events: all;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .handle:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  }
  
  .handle:active {
    cursor: grabbing;
  }
  
  .handle-label {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--range-color);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.7rem;
    white-space: nowrap;
    pointer-events: none;
    font-weight: 500;
  }
  
  .start-handle .handle-label {
    left: 0;
    transform: translateX(0);
  }
  
  .end-handle .handle-label {
    left: auto;
    right: 0;
    transform: translateX(0);
  }
  
  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .range-control {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-radius: 6px;
  }
  
  .range-badge {
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    color: white;
    font-size: 0.85rem;
  }
  
  .range-badge.range-1 {
    background-color: #0d6efd;
  }
  
  .range-badge.range-2 {
    background-color: #198754;
  }
  
  .range-info {
    flex: 1;
    font-family: monospace;
    font-size: 0.95rem;
  }
  
  .wrap-indicator {
    font-size: 0.8rem;
    font-style: italic;
    color: #6c757d;
    margin-left: 0.5rem;
  }
  
  .alert {
    padding: 0.125rem;
  }
  
  .alert-warning {
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    color: #856404;
  }
  
  @media (max-width: 768px) {
    .number-line {
      height: 50px;
    }
    
    .handle {
      width: 24px;
      height: 36px;
    }
    
    .handle-label {
      font-size: 0.65rem;
    }
  }
</style>
