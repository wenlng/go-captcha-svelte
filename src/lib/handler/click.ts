/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import type {ClickData, ClickDot, ClickEvent} from "../types/click";
import {getDomXY} from "../helper/helper";
import {writable, get} from 'svelte/store';
import type {Writable} from 'svelte/store';

export const useHandler = (
  _data: ClickData,
  events: ClickEvent,
) => {
  let dots: Writable<any[]> = writable([])

  const clickEvent = (e: Event|any) => {
    const dom = e.currentTarget
    const xy = getDomXY(dom)

    const mouseX = e.pageX || e.clientX
    const mouseY = e.pageY || e.clientY

    const domX = xy.domX
    const domY = xy.domY

    const xPos = mouseX - domX;
    const yPos = mouseY - domY;

    const xx = parseInt(xPos.toString())
    const yy = parseInt(yPos.toString())
    const date = new Date()
    const d = get(dots)
    const index = d.length
    dots.set([...d, {key: date.getTime(), index: index + 1, x: xx, y: yy}])

    events.click && events.click(xx, yy)
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const confirmEvent = (e: Event|any) => {
    const dotsStr = JSON.stringify(get(dots))
    let ds: Array<ClickDot> = []
    try {
      ds = JSON.parse(dotsStr)
    } catch (e) {
      console.warn("parse dots error", e)
    }

    events.confirm && events.confirm(ds, () => {
      dots.set([])
    })
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const closeEvent = (e: Event|any) => {
    events.close && events.close()
    dots.set([])
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  const refreshEvent = (e: Event|any) => {
    events.refresh && events.refresh()
    dots.set([])
    e.cancelBubble = true
    e.preventDefault()
    return false
  }

  return {
    dots,
    clickEvent,
    confirmEvent,
    closeEvent,
    refreshEvent,
  }
}