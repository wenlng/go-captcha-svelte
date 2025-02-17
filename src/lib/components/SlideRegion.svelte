<script lang="ts">
  import {onDestroy, onMount} from 'svelte';

  import type {SlideRegionConfig, SlideRegionData, SlideRegionEvent} from "../types/slide-region";
  import {defaultRegionConfig, defaultSlideRegionData} from "../types/slide-region";
  import {useHandler} from "../handler/slide-region";

  import LoadingIcon from "../assets/icons/LoadingIcon.svelte";
  import CloseIcon from "../assets/icons/CloseIcon.svelte";
  import RefreshIcon from "../assets/icons/RefreshIcon.svelte";
  import {mergeTo} from "../helper/helper";
  import {writable} from "svelte/store";
  import type {Writable} from 'svelte/store';

  export let config:SlideRegionConfig = defaultRegionConfig()
  export let data:SlideRegionData = defaultSlideRegionData()
  export let events:SlideRegionEvent = {}

  const localConfig: Writable<SlideRegionConfig> = writable({...config})
  $: watchConfig(config)
  function watchConfig(c: SlideRegionConfig) {
    mergeTo(defaultRegionConfig(), c)
    localConfig.set(c)
  }

  const localData: Writable<SlideRegionData> = writable({...data})
  $: watchData(data)
  function watchData(c: SlideRegionData) {
    mergeTo(defaultSlideRegionData(), c)
    localData.set(c)
  }

  const localEvents: Writable<SlideRegionEvent> = writable({...events})
  $: watchEvents(events)
  function watchEvents(c: SlideRegionEvent) {
    localEvents.set(c)
  }

  const handler = useHandler(localData, localEvents, localConfig, () => {
    localData.set({...defaultSlideRegionData()})
    data.thumbX = 0
    data.thumbY = 0
    data.thumbWidth = 0
    data.thumbHeight = 0
    data.image = ""
    data.thumb = ""
  })

  export const clear = handler.clearData
  export const reset = handler.resetData
  export const close = handler.close
  export const refresh = handler.refresh

  const state = handler.state

  let rootRef: HTMLElement
  let containerRef: HTMLElement
  let tileRef: HTMLElement

  const fn = (event: any) => event.preventDefault()
  onMount(() => {
    handler.initRefs(rootRef, containerRef, tileRef)
    tileRef && tileRef.addEventListener('dragstart', fn);
  })

  onDestroy(() => {
    handler.unsubscribe && handler.unsubscribe()
    tileRef && tileRef.removeEventListener('dragstart', fn);
  })

  $: width = (config.width || 0) + ( (config.horizontalPadding || 0) * 2) + (config.showTheme ? 2 : 0)
  $: hasDisplayWrapperState = (config.width || 0) > 0 || (config.height || 0) > 0
  $: hasDisplayImageState = (data.image && data.image.length > 0) || (data.thumb && data.thumb.length > 0)

  $: wrapperClass = config.showTheme ? 'gc-theme' : ''
  $: wrapperStyle = `width: ${width}px; padding: ${config.verticalPadding || 0}px ${config.horizontalPadding || 0}px; display: ${hasDisplayWrapperState ? 'block' : 'none'}`
  $: bodyStyle = `width: ${config.width}px; height: ${config.height}px;`
  $: imageStyle = `width: ${config.width}px; height: ${config.height}px; display: ${hasDisplayImageState ? 'block' : 'none'}`
  $: thumbStyle = `width: ${data.thumbWidth}px; height: ${data.thumbHeight}px; top: ${$state.y}px; left: ${$state.x}px; display: ${hasDisplayImageState ? 'block' : 'none'}`
</script>

<div
  class={`go-captcha gc-wrapper ${wrapperClass}`}
  style={wrapperStyle}
  bind:this={rootRef}
>
  <div class="gc-header" class:gc-header2={true}>
    <span>{ config.title }</span>
  </div>
  <div
    class="gc-body"
    bind:this={containerRef}
    style={bodyStyle}
  >
    <div class="gc-loading">
      <LoadingIcon />
    </div>
    <img class={`gc-picture ${data.image === '' ? 'gc-hide' : ''}`} style={imageStyle} src={data.image} alt="..."/>
    <div
      class:gc-tile={true}
      bind:this={tileRef}
      style={thumbStyle}
      on:mousedown={handler.dragEvent}
      on:touchstart={handler.dragEvent}
    >
      <img
        class={`${data.thumb === '' ? 'gc-hide' : ''}`}
        src={data.thumb}
        alt=""
      />
    </div>
  </div>
  <div class="gc-footer">
    <div class="gc-icon-block">
      <CloseIcon
        width={config.iconSize}
        height={config.iconSize}
        clickEvent={handler.closeEvent}
      />
      <RefreshIcon
        width={config.iconSize}
        height={config.iconSize}
        clickEvent={handler.refreshEvent}
      />
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