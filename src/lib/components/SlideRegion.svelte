<script lang="ts">
  import { onMount } from 'svelte';

  import type {SlideRegionConfig, SlideRegionData, SlideRegionEvent} from "../types/slide-region";
  import {defaultRegionConfig} from "../types/slide-region";
  import {useHandler} from "../handler/slide-region";

  import LoadingIcon from "../assets/icons/LoadingIcon.svelte";
  import CloseIcon from "../assets/icons/CloseIcon.svelte";
  import RefreshIcon from "../assets/icons/RefreshIcon.svelte";

  export let config:SlideRegionConfig = defaultRegionConfig()
  export let data:SlideRegionData = { thumbX: 0, thumbY: 0, thumbWidth: 0, thumbHeight: 0, image: "", thumb: "" }
  export let events:SlideRegionEvent = {}

  let containerRef: HTMLElement
  let tileRef: HTMLElement

  config = {...defaultRegionConfig(), ...config}

  const handler = useHandler(data, events)
  const state = handler.state

  const hPadding = config.horizontalPadding || 0
  const vPadding = config.verticalPadding || 0
  const width = (config.width || 0) + ( hPadding * 2) + (config.showTheme ? 2 : 0)

  onMount(() => {
    handler.initRefs(containerRef, tileRef)
    if (tileRef) {
      tileRef.addEventListener('dragstart', (event: any) => event.preventDefault());
    }
  })

  $: wrapperClass = config.showTheme ? 'gc-theme' : ''
  $: wrapperStyle = `width: ${width}px; padding: ${vPadding}px ${hPadding}px;`
  $: imageStyle = `width: ${config.width}px; height: ${config.height}px`
  $: thumbStyle = `width: ${data.thumbWidth}px; height: ${data.thumbHeight}px; top: ${$state.y}px; left: ${$state.x}px`
</script>

<div class={`go-captcha gc-wrapper ${wrapperClass}`} style={wrapperStyle}>
  <div class="gc-header" class:gc-header2={true}>
    <span>{ config.title }</span>
  </div>
  <div class="gc-body" bind:this={containerRef} style={imageStyle}>
    <div class="gc-loading">
      <LoadingIcon />
    </div>
    <img class={`gc-picture ${data.image === '' ? 'gc-hide' : ''}`} style={imageStyle} src={data.image} alt="..."/>
    <div class:gc-tile={true} bind:this={tileRef} style={thumbStyle} on:mousedown={handler.dragEvent} on:touchstart={handler.dragEvent}>
      <img class={`${data.thumb === '' ? 'gc-hide' : ''}`} src={data.thumb} alt="..."/>
    </div>
  </div>
  <div class="gc-footer">
    <div class="gc-icon-block">
      <CloseIcon width={22} height={22} clickEvent={handler.closeEvent}/>
      <RefreshIcon width={22} height={22} clickEvent={handler.refreshEvent}/>
    </div>
  </div>
</div>

<style lang="less">
  .go-captcha {
    .gc-header2 {
      text-align: center;
    }

    .gc-tile {
      position: absolute;
      z-index: 2;
      cursor: pointer;

      img {
        display: block;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>