/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import type {SlideData, SlideEvent} from "../types/slide";
import {checkTargetFather} from "../helper/helper";
import {writable, get} from 'svelte/store';
import type {Writable} from 'svelte/store';

export function useHandler(
  data: SlideData,
  event: SlideEvent,
) {
  let state: Writable<{ thumbLeft: number; dragLeft: number }> = writable({dragLeft: 0, thumbLeft: data.thumbX || 0})

  let containerRef: HTMLElement
  let tileRef: HTMLElement
  let dragBlockRef: HTMLElement
  let dragBarRef: HTMLElement

  const clear = () => {
    state.set({dragLeft: 0, thumbLeft: data.thumbX || 0})
  }

  const dragEvent = (e: Event|any) => {
    const touch = e.touches && e.touches[0];
    const offsetLeft = dragBlockRef.offsetLeft
    const width = containerRef.offsetWidth
    const blockWidth = dragBlockRef.offsetWidth
    const maxWidth =width - blockWidth
    const thumbX = data.thumbX || 0

    const tileWith  = tileRef.offsetWidth
    const ad = blockWidth - tileWith
    const ratio = ((maxWidth - thumbX) + ad) / maxWidth

    let isMoving = false
    let startX = 0
    let currentThumbX = 0
    if (touch) {
      startX = touch.pageX - offsetLeft
    } else {
      startX = e.clientX - offsetLeft
    }

    const moveEvent = (e: Event|any) => {
      isMoving = true
      const mTouche = e.touches && e.touches[0];
      const curState = get(state)

      let left = 0;
      if (mTouche) {
        left = mTouche.pageX - startX
      } else {
        left = e.clientX - startX
      }

      if (left >= maxWidth) {
        state.set({...curState, dragLeft: maxWidth})
        return
      }

      if (left <= 0) {
        state.set({...curState, dragLeft: 0})
        return
      }

      currentThumbX = thumbX + (left * ratio)
      state.set({thumbLeft: currentThumbX, dragLeft: left})

      event.move && event.move(currentThumbX, data.thumbY || 0)

      e.cancelBubble = true
      e.preventDefault()
    }

    const upEvent = (e: Event|any) => {
      if (!checkTargetFather(dragBarRef, e)) {
        return
      }

      if (!isMoving) {
        return
      }

      dragBarRef.removeEventListener("mousemove", moveEvent, false)
      // @ts-ignore
      dragBarRef.removeEventListener("touchmove", moveEvent, { passive: false })

      dragBarRef.removeEventListener( "mouseup", upEvent, false)
      dragBarRef.removeEventListener( "mouseout", upEvent, false)
      dragBarRef.removeEventListener("touchend", upEvent, false)

      isMoving = false
      event.confirm && event.confirm({x: parseInt(currentThumbX.toString()), y: data.thumbY || 0}, () => {
        clear()
      })

      e.cancelBubble = true
      e.preventDefault()
    }

    dragBarRef.addEventListener("mousemove", moveEvent, false)
    dragBarRef.addEventListener("touchmove", moveEvent, { passive: false })
    dragBarRef.addEventListener( "mouseup", upEvent, false)
    dragBarRef.addEventListener( "mouseout", upEvent, false)
    dragBarRef.addEventListener("touchend", upEvent, false)
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

  const initRefs = (container: HTMLElement, tile: HTMLElement, dragBlock: HTMLElement, dragBar: HTMLElement) => {
    containerRef = container
    tileRef = tile
    dragBlockRef = dragBlock
    dragBarRef = dragBar
  }

  return {
    state,
    initRefs,
    dragEvent,
    closeEvent,
    refreshEvent,
  }
}
