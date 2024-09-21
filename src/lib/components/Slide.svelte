<script lang="ts">
  import { onMount } from 'svelte';

  import type {SlideConfig, SlideData, SlideEvent} from "../types/slide";
  import {defaultConfig} from "../types/slide";
  import {useHandler} from "../handler/slide";

  import LoadingIcon from "../assets/icons/LoadingIcon.svelte";
  import CloseIcon from "../assets/icons/CloseIcon.svelte";
  import RefreshIcon from "../assets/icons/RefreshIcon.svelte";
  import ArrowsIcon from "../assets/icons/ArrowsIcon.svelte";

  export let config:SlideConfig = defaultConfig()
  export let data:SlideData = { thumbX: 0, thumbY: 0, thumbWidth: 0, thumbHeight: 0, image: "", thumb: "" }
  export let events:SlideEvent = {}

  let dragBarRef: HTMLElement
  let dragBlockRef: HTMLElement
  let containerRef: HTMLElement
  let tileRef: HTMLElement

  config = {...defaultConfig(), ...config}

  const handler = useHandler(data, events)
  const state = handler.state

  const hPadding = config.horizontalPadding || 0
  const vPadding = config.verticalPadding || 0
  const width = (config.width || 0) + ( hPadding * 2) + (config.showTheme ? 2 : 0)

  onMount(() => {
    handler.initRefs(containerRef, tileRef, dragBlockRef, dragBarRef)
    if (dragBlockRef) {
      dragBlockRef.addEventListener('dragstart', (event: any) => event.preventDefault());
    }
  })

  $: wrapperClass = config.showTheme ? 'gc-theme' : ''
  $: wrapperStyle = `width: ${width}px; padding: ${vPadding}px ${hPadding}px;`
  $: imageStyle = `width: ${config.width}px; height: ${config.height}px`
  $: thumbStyle = `width: ${data.thumbWidth}px; height: ${data.thumbHeight}px; top: ${data.thumbY}px; left: ${$state.thumbLeft}px`
  $: dragStyle = `left: ${$state.dragLeft}px`
</script>

<div class={`go-captcha gc-wrapper ${wrapperClass}`} style={wrapperStyle}>
  <div class="gc-header">
    <span>{ config.title }</span>
    <div class="gc-icon-block">
      <CloseIcon width={22} height={22} clickEvent={handler.closeEvent}/>
      <RefreshIcon width={22} height={22} clickEvent={handler.refreshEvent}/>
    </div>
  </div>
  <div class="gc-body" bind:this={containerRef} style={imageStyle}>
    <div class="gc-loading">
      <LoadingIcon />
    </div>
    <div class="gc-picture" style={imageStyle}>
      <img class={`${data.image === '' ? 'gc-hide' : ''}`} src={data.image} alt="..." />
      <div class="gc-round"></div>
    </div>
    <img class={`gc-picture ${data.image === '' ? 'gc-hide' : ''}`} style={imageStyle} src={data.image} alt="..."/>
    <div class:gc-tile={true} bind:this={tileRef} style={thumbStyle}>
      <img class={`${data.thumb === '' ? 'gc-hide' : ''}`} src={data.thumb} alt="..."/>
    </div>
  </div>
  <div class="gc-footer">
    <div class="gc-drag-slide-bar" bind:this={dragBarRef}>
      <div class="gc-drag-line"></div>
      <div class="gc-drag-block" bind:this={dragBlockRef} on:mousedown={handler.dragEvent} style={dragStyle}>
        <div class="drag-block-inline" on:touchstart={handler.dragEvent}>
          <ArrowsIcon />
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="less">
  .go-captcha {
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