/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import type {SlideRegionData, SlideRegionEvent} from "../types/slide-region";
import {checkTargetFather} from "../helper/helper";
import {writable, get} from 'svelte/store';
import type {Writable} from 'svelte/store';

export function useHandler(
  data: SlideRegionData,
  event: SlideRegionEvent,
) {
  const state: Writable<{ x: number; y: number }> = writable({x: data.thumbX || 0, y: data.thumbY || 0})
  let containerRef: HTMLElement
  let tileRef: HTMLElement

  const clear = () => {
    state.set({x: data.thumbX || 0, y: data.thumbY || 0})
  }

  const dragEvent = (e: Event|any) => {
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
      event.move && event.move(left, top)

      e.cancelBubble = true
      e.preventDefault()
    }

    const upEvent = (e: Event|any) => {
      if (!checkTargetFather(containerRef, e)) {
        return
      }

      if (!isMoving) {
        return
      }
      isMoving = false
      clearEvent()

      event.confirm && event.confirm({x: tileLeft, y: tileTop}, () => {
        clear()
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

    const clearEvent = () => {
      containerRef.removeEventListener("mousemove", moveEvent, false)
      // @ts-ignore
      containerRef.removeEventListener("touchmove", moveEvent, { passive: false })

      containerRef.removeEventListener( "mouseup", upEvent, false)
      // containerRef.removeEventListener( "mouseout", upEvent, false)
      containerRef.removeEventListener( "mouseenter", enterDragBlockEvent, false)
      containerRef.removeEventListener( "mouseleave", leaveDragBlockEvent, false)
      containerRef.removeEventListener("touchend", upEvent, false)

      document.body.removeEventListener("mouseleave", upEvent, false)
      document.body.removeEventListener("mouseup", leaveUpEvent, false)
    }

    containerRef.addEventListener("mousemove", moveEvent, false)
    containerRef.addEventListener("touchmove", moveEvent, { passive: false })
    containerRef.addEventListener( "mouseup", upEvent, false)
    // containerRef.addEventListener( "mouseout", upEvent, false)
    containerRef.addEventListener( "mouseenter", enterDragBlockEvent, false)
    containerRef.addEventListener( "mouseleave", leaveDragBlockEvent, false)
    containerRef.addEventListener("touchend", upEvent, false)

    document.body.addEventListener("mouseleave", upEvent, false)
    document.body.addEventListener("mouseup", leaveUpEvent, false)
  }

  const closeEvent = (e: Event|any) => {
    event && event.close && event.close()
    clear()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const refreshEvent = (e: Event|any) => {
    event && event.refresh && event.refresh()
    clear()
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const initRefs = (container: HTMLElement, tile: HTMLElement) => {
    containerRef = container
    tileRef = tile
  }

  return {
    state,
    initRefs,
    dragEvent,
    closeEvent,
    refreshEvent,
  }
}
