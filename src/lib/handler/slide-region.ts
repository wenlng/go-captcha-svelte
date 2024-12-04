/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import type {SlideRegionConfig, SlideRegionData, SlideRegionEvent} from "../types/slide-region";
import {checkTargetFather} from "../helper/helper";
import {writable, get} from 'svelte/store';
import type {Writable} from 'svelte/store';

export function useHandler(
  data: Writable<SlideRegionData> | any,
  event: Writable<SlideRegionEvent> | any,
  config: Writable<SlideRegionConfig> | any,
  clearCbs: () => void
) {
  const state: Writable<{ x: number; y: number }> = writable({x: get(data).thumbX || 0, y: get(data).thumbY || 0})
  let isFreeze: boolean = false

  let rootRef: HTMLElement
  let containerRef: HTMLElement
  let tileRef: HTMLElement

  const unsubscribe = data.subscribe(() => {
    if(!isFreeze){
      state.set({x: get(data).thumbX || 0, y: get(data).thumbY || 0})
    }
  })

  const dragEvent = (e: Event|any) => {
    if (!checkTargetFather(containerRef, e)) {
      return
    }

    const touch = e.touches && e.touches[0];
    const offsetLeft = tileRef.offsetLeft
    const offsetTop = tileRef.offsetTop
    const width = containerRef.offsetWidth
    const height = containerRef.offsetHeight
    const tileWidth = tileRef.offsetWidth
    const tileHeight = tileRef.offsetHeight
    const maxWidth = width - tileWidth
    const maxHeight = height - tileHeight

    let isMoving = false
    let tmpLeaveDragEvent: Event|any = null
    let startX = 0
    let startY = 0
    let tileLeft = 0
    let tileTop = 0
    if (touch) {
      startX = touch.pageX - offsetLeft
      startY = touch.pageY - offsetTop
    } else {
      startX = e.clientX - offsetLeft
      startY = e.clientY - offsetTop
    }

    const moveEvent = (e: Event|any) => {
      isMoving = true
      const mTouche = e.touches && e.touches[0];

      let left = 0;
      let top = 0;
      if (mTouche) {
        left = mTouche.pageX - startX
        top = mTouche.pageY - startY
      } else {
        left = e.clientX - startX
        top = e.clientY - startY
      }

      if (left <= 0) {
        left = 0
      }

      if (top <= 0) {
        top = 0
      }

      if (left >= maxWidth) {
        left = maxWidth
      }

      if (top >= maxHeight) {
        top = maxHeight
      }

      state.set({x: left, y: top})
      tileLeft = left
      tileTop = top
      const ec = get(event)
      ec.move && ec.move(left, top)

      e.cancelBubble = true
      e.preventDefault()
    }

    const upEvent = (e: Event|any) => {
      if (!checkTargetFather(containerRef, e)) {
        return
      }

      clearEvent()
      if (!isMoving) {
        return
      }
      isMoving = false

      if (tileLeft < 0 || tileTop < 0) {
        return
      }

      const ec = get(event)
      ec.confirm && ec.confirm({x: tileLeft, y: tileTop}, () => {
        resetData()
      })

      e.cancelBubble = true
      e.preventDefault()
    }

    const leaveDragBlockEvent = (e: Event|any) => {
      tmpLeaveDragEvent = e
    }

    const enterDragBlockEvent = () => {
      tmpLeaveDragEvent = null
    }

    const leaveUpEvent = (_: Event|any) => {
      if(!tmpLeaveDragEvent) {
        return
      }

      upEvent(tmpLeaveDragEvent)
      clearEvent()
    }

    const scope = get(config).scope
    const dragDom = scope ? rootRef : containerRef
    const scopeDom = scope ? rootRef : document.body

    const clearEvent = () => {
      scopeDom.removeEventListener("mousemove", moveEvent, false)
      // @ts-ignore
      scopeDom.removeEventListener("touchmove", moveEvent, { passive: false })

      dragDom.removeEventListener( "mouseup", upEvent, false)
      dragDom.removeEventListener( "mouseenter", enterDragBlockEvent, false)
      dragDom.removeEventListener( "mouseleave", leaveDragBlockEvent, false)
      dragDom.removeEventListener("touchend", upEvent, false)

      scopeDom.removeEventListener("mouseleave", upEvent, false)
      scopeDom.removeEventListener("mouseup", leaveUpEvent, false)

      isFreeze = false
    }
    isFreeze = true

    scopeDom.addEventListener("mousemove", moveEvent, false)
    scopeDom.addEventListener("touchmove", moveEvent, { passive: false })

    dragDom.addEventListener( "mouseup", upEvent, false)
    dragDom.addEventListener( "mouseenter", enterDragBlockEvent, false)
    dragDom.addEventListener( "mouseleave", leaveDragBlockEvent, false)
    dragDom.addEventListener("touchend", upEvent, false)

    scopeDom.addEventListener("mouseleave", upEvent, false)
    scopeDom.addEventListener("mouseup", leaveUpEvent, false)
  }

  const closeEvent = (e: Event|any) => {
    close()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const refreshEvent = (e: Event|any) => {
    refresh()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const resetData = () => {
    state.set({x: get(data).thumbX || 0, y: get(data).thumbY || 0})
  }

  const clearData = () => {
    resetData()
    clearCbs && clearCbs()
  }

  const close = () => {
    const ec = get(event)
    ec.close && ec.close()
    resetData()
  }

  const refresh = () => {
    const ec = get(event)
    ec.refresh && ec.refresh()
    resetData()
  }

  const initRefs = (root: HTMLElement, container: HTMLElement, tile: HTMLElement) => {
    rootRef = root
    containerRef = container
    tileRef = tile
  }

  return {
    state,
    initRefs,
    unsubscribe,
    dragEvent,
    closeEvent,
    refreshEvent,
    resetData,
    clearData,
    close,
    refresh,
  }
}
