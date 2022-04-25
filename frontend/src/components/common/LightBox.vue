<script setup>
</script>
<template>
  <div class="fixed inset-0 w-[100vw] h-[100vh] z-10 bg-black/50">
    <div class="fixed w-[60%] h-[400px] left-1/2 top-1/4 -translate-x-1/2 bg-white">
      <header class="border-b">
        <slot name="header"></slot>
      </header>
      <main>
        <slot name="main"></slot>
      </main>
    </div>
  </div>
</template>
