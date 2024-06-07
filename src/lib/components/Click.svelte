<script lang="ts">
  import type {ClickConfig, ClickEvent, ClickData} from  "../types/click";
  import {defaultConfig} from  "../types/click";
  import {useHandler} from "../handler/click";

  import LoadingIcon from "../assets/icons/LoadingIcon.svelte";
  import CloseIcon from "../assets/icons/CloseIcon.svelte";
  import RefreshIcon from "../assets/icons/RefreshIcon.svelte";

  export let config:ClickConfig = defaultConfig()
  export let data:ClickData = { image: "", thumb: "" }
  export let events:ClickEvent = {}

  config = {...defaultConfig(), ...config}

  const handler = useHandler(data, events)
  const dots = handler.dots

  const hPadding = config.horizontalPadding || 0
  const vPadding = config.verticalPadding || 0
  const width = (config.width || 0) + ( hPadding * 2)

  $: wrapperClass = config.showTheme ? 'gc-theme' : ''
  $: wrapperStyle = `width: ${width}px; padding: ${vPadding}px ${hPadding}px;`
  $: imageStyle = `width: ${config.width}px; height: ${config.height}px`
  $: thumbStyle = `width: ${config.thumbWidth}px; height: ${config.thumbHeight}px`
</script>

<div class={`go-captcha gc-wrapper ${wrapperClass}`} style={wrapperStyle}>
  <div class="gc-header">
    <span>{ config.title }</span>
    <img class={data.thumb === '' ? 'gc-hide' : ''} style={thumbStyle} src={data.thumb} alt="..." />
  </div>
  <div class="gc-body" style={imageStyle}>
    <div class="gc-loading">
      <LoadingIcon />
    </div>
    <img style={imageStyle} class={`gc-picture ${data.image === '' ? 'gc-hide' : ''}`} src={data.image} alt="..." on:click={handler.clickEvent}/>
    <div class:gc-dots={true}>
      {#each $dots as dot}
      <div class:gc-dot={true} style={`top: ${(dot.y - 11)}px; left: ${(dot.x - 11)}px`}>{dot.index}</div>
      {/each}
    </div>
  </div>
  <div class="gc-footer">
    <div class="gc-icon-block" class:gc-icon-block2={true}>
      <CloseIcon width={22} height={22} clickEvent={handler.closeEvent}/>
      <RefreshIcon width={22} height={22} clickEvent={handler.refreshEvent}/>
    </div>
    <div class="gc-button-block">
      <button on:click={handler.confirmEvent}>{ config.buttonText }</button>
    </div>
  </div>
</div>

<style lang="less">
  .go-captcha {
    .gc-icon-block2 {
      flex: 1;
    }

    .gc-dots{
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      .gc-dot {
        position: absolute;
        z-index: 2;
        width: 20px;
        height: 20px;
        color: #cedffe;
        background: #3e7cff;
        border: 2px solid #f7f9fb;
        display:-webkit-box;
        display:-webkit-flex;
        display:-ms-flexbox;
        display:flex;
        -webkit-box-align:center;
        -webkit-align-items:center;
        -ms-flex-align:center;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        cursor: default;
        font-weight: 600;
      }
    }
  }
</style>