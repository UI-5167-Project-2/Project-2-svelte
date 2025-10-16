<script>
  import Device from './lib/Device-Viewer/Device.svelte';
  import Header from './lib/Header/Header.svelte';
  import MobileInterface from './lib/Mobile-Interface/Mobile-Interface.svelte';
</script>

<div class="main-container">
  <div class="header-container">
    <Header />
  </div>
  <div class="content-container">
    <div class="content-view">
      <Device />
    </div>
    <div class="content-view">
      <MobileInterface />
    </div>
  </div>
</div>

<style></style>
