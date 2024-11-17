<script lang="ts">
  export let width:number = 84
  export let height:number = 84
  export let clickEvent: Function = () => {}
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={width} height={height} {...$$props} on:click={clickEvent}>
  <circle cx="50" cy="36.8101" r="10">
    <animate attributeName="cy" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9" keyTimes="0;0.5;1" values="23;77;23"></animate>
  </circle>
</svg>