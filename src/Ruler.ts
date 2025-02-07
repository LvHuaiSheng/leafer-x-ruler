import { ICanvasContext2D, IUI } from '@leafer-ui/interface'
import { App, LayoutEvent, Leafer, RenderEvent, ResizeEvent } from '@leafer-ui/core'
import { EditorEvent } from '@leafer-in/editor'
import _ from 'lodash'

type TAxis = 'x' | 'y';
type Rect = { left: number; top: number; width: number; height: number }

const PiBy180 = Math.PI / 180

export interface ThemeOption {
  /**
   * 背景颜色
   */
  backgroundColor: string

  /**
   * 文字颜色
   */
  textColor: string

  /**
   * 边框颜色
   */
  borderColor: string

  /**
   * 高亮颜色
   */
  highlightColor: string
}

export interface ConversionFactor {
  /**
   * 自定义单位对应的像素数，比如英寸单位：1英寸对应96px，那这里就是96
   */
  px: number

  /**
   * 缩放倍率，对应缩放比例：[0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
   */
  gaps: number[]

  /**
   * 默认缩放倍率（如果没有匹配到缩放比例对应的倍率，则使用默认值defaultGap）
   */
  defaultGap: number
}

const DEFAULT_CONVERSION_FACTORS: ConversionFactor = {
  px: 1, // 像素
  gaps: [5000, 2500, 1000, 500, 200, 100, 50, 20, 10], // 缩放基准间隔
  defaultGap: 10000 // 默认缩放基准间隔
}

export interface RulerOptions {
  ruleSize?: number; // 标尺宽高
  fontSize?: number; // 字体大小
  themes?: { [key: string]: ThemeOption } // 主题，默认存在明亮、暗黑主题
  conversionFactors?: { [key: string]: ConversionFactor }; // 定义单位转换因子 (每单位对应的像素数)
}

export interface RulerConfig extends RulerOptions {
  /**
   * 是否启用标尺线
   */
  enabled?: boolean
  /**
   * 标尺线主题
   */
  theme?: string

  /**
   * 标尺单位
   */
  unit?: string;
}

export type HighlightRect = {
  skip?: TAxis
} & Rect

export const defaultConfig: RulerConfig = {
  enabled: true,
  theme: 'light',
  ruleSize: 20,
  fontSize: 10,
  unit: 'px',
  themes: {
    light: {
      backgroundColor: '#fff',
      textColor: '#444',
      borderColor: '#ccc',
      highlightColor: '#165dff3b'
    },
    dark: {
      backgroundColor: '#242424',
      textColor: '#ddd',
      borderColor: '#555',
      highlightColor: 'rgba(22,93,255,0.55)'
    }
  },
  conversionFactors: {
    // 像素
    px: {
      px: 1,
      gaps: [5000, 2500, 1000, 500, 200, 100, 50, 20, 10],
      defaultGap: 10000
    },
    // 英寸
    in: {
      px: 96,
      gaps: [100, 50, 30, 20, 6, 1, 2, 0.8, 0.5],
      defaultGap: 1000
    },
    // 厘米
    cm: {
      px: 96 / 2.54,
      gaps: [100, 50, 30, 20, 6, 4, 2, 1, 0.5],
      defaultGap: 1000
    },
    // 毫米
    mm: {
      px: 96 / 25.4,
      gaps: [1000, 500, 200, 100, 50, 20, 10, 5, 2],
      defaultGap: 2000
    },
    // 点
    pt: {
      px: 96 / 72,
      gaps: [5000, 2500, 1000, 500, 200, 100, 50, 20, 10],
      defaultGap: 10000
    },
    // 派卡
    pc: {
      px: 96 / 6,
      gaps: [100, 80, 50, 30, 15, 12, 8, 6, 4],
      defaultGap: 1000
    }
  }
}

export class Ruler {

  private app: App
  public readonly rulerLeafer: Leafer
  private readonly contextContainer: ICanvasContext2D

  public config: RulerConfig

  /**
   * 选取对象矩形坐标
   */
  private objectRect:
    | undefined
    | {
    x: HighlightRect[]
    y: HighlightRect[]
  }

  constructor(app: App, config?: RulerConfig) {
    this.app = app
    this.rulerLeafer = app.addLeafer()
    this.contextContainer = this.rulerLeafer.canvas.context

    this.config = _.merge({}, defaultConfig, config)

    this.forceRender = this.forceRender.bind(this)
    this.resize = this.resize.bind(this)
    this.enabled = this.config.enabled
  }

  public set theme(value: string) {
    this.config.theme = value
    this.forceRender()
  }

  public get theme() {
    return this.config.theme
  }

  /**
   * 添加主题
   * @param key
   * @param theme
   */
  public addTheme(key: string, theme: ThemeOption) {
    this.config.themes[key] = theme
  }

  /**
   * 删除主题
   * @param key
   */
  public removeTheme(key: string) {
    delete this.config.themes[key]
  }


  public changeTheme(value: string) {
    this.theme = value
  }

  /**
   * 添加单位
   * @param key
   * @param conversionFactor
   */
  public addUnit(key: string, conversionFactor: ConversionFactor) {
    this.config.conversionFactors[key] = conversionFactor
  }

  /**
   * 删除单位
   * @param key
   */
  public removeUnit(key: string) {
    delete this.config.conversionFactors[key]
  }

  public changeUnit(unit: string) {
    this.config.unit = unit
    this.forceRender()
  }

  public changeEnabled(value: boolean) {
    this.enabled = value
  }

  public get enabled() {
    return this.config.enabled
  }

  public set enabled(value: boolean) {
    this.config.enabled = value
    if (value) {
      this.app.tree.on(LayoutEvent.AFTER, this.forceRender)
      this.app.tree.on(ResizeEvent.RESIZE, this.resize)
      this.app.editor?.on(EditorEvent.SELECT, this.forceRender)
      this.resize()
    } else {
      this.app.tree.off(LayoutEvent.AFTER, this.forceRender)
      this.app.tree.off(ResizeEvent.RESIZE, this.resize)
      this.app.editor?.off(EditorEvent.SELECT, this.forceRender)
      this.rulerLeafer.forceRender()
    }
  }

  public forceRender() {
    if (this.enabled) {
      this.render({ ctx: this.contextContainer })
    }
  }

  public resize() {
    setTimeout(() => {
      if (this.enabled) {
        this.render({ ctx: this.contextContainer })
      }
    }, 100)
  }

  /**
   * 获取画板尺寸
   */
  private getSize() {
    return {
      width: this.app.width,
      height: this.app.height
    }
  }

  private render({ ctx }: { ctx: ICanvasContext2D }) {
    // 设置画布的矩阵信息（默认会带上屏幕像素比），用于解决屏幕像素比的问题
    this.rulerLeafer.canvas.setWorld({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })

    const { worldTransform } = this.app.tree
    const vpt = [worldTransform.a, worldTransform.b, worldTransform.c, worldTransform.d, worldTransform.e, worldTransform.f]
    // 计算元素矩形
    this.calcObjectRect()
    // 绘制水平尺子
    this.draw({
      ctx,
      isHorizontal: true,
      rulerLength: this.getSize().width,
      startCalibration: -(vpt[4] / vpt[0]),
      unit: this.config.unit || 'px' // 默认单位为像素
    })
    // 绘制垂直尺子
    this.draw({
      ctx,
      isHorizontal: false,
      rulerLength: this.getSize().height,
      startCalibration: -(vpt[5] / vpt[3]),
      unit: this.config.unit || 'px'
    })
    // 绘制标尺底部矩形和文字
    const themeOption = this.config.themes[this.config.theme]
    this.darwRect(ctx, {
      left: 0,
      top: 0,
      width: this.config.ruleSize,
      height: this.config.ruleSize,
      fill: themeOption.backgroundColor,
      stroke: themeOption.borderColor
    })

    this.darwText(ctx, {
      text: this.config.unit || 'px',
      left: this.config.ruleSize / 2,
      top: this.config.ruleSize / 2,
      align: 'center',
      baseline: 'middle',
      fill: themeOption.textColor
    })

    // TODO 待官方支持手动触发app canvas渲染的方法后替换下面方法
    // 临时先这么用，不然拖动frame时标尺层画布渲染会有延迟
    this.app.tree.emit(RenderEvent.END, { renderBounds: this.app.tree.canvas.bounds })
  }

  private draw(opt: {
    ctx: ICanvasContext2D
    isHorizontal: boolean
    rulerLength: number
    startCalibration: number
    unit: string
  }) {
    const { ctx, isHorizontal, rulerLength, startCalibration, unit } = opt
    const zoom = this.getZoom()
    const gapInPx = this.getGap(zoom, unit)
    const unitLength = Math.ceil(rulerLength / zoom)
    const startValue = Math.floor(startCalibration / gapInPx) * gapInPx
    const startOffset = startValue - startCalibration
    const canvasSize = this.getSize()

    const themeOption = this.config.themes[this.config.theme]
    const { ruleSize } = this.config
    // 文字顶部偏移
    const padding = 2.5

    // 背景
    this.darwRect(ctx, {
      left: 0,
      top: 0,
      width: isHorizontal ? canvasSize.width : ruleSize,
      height: isHorizontal ? ruleSize : canvasSize.height,
      fill: themeOption.backgroundColor,
      stroke: themeOption.borderColor
    })

    // 标尺刻度线显示
    for (let pos = 0; pos + startOffset <= unitLength; pos += gapInPx) {
      for (let index = 0; index < 10; index++) {
        const position = Math.round((startOffset + pos + (gapInPx * index) / 10) * zoom)
        const isMajorLine = index === 0
        const [left, top] = isHorizontal
          ? [position, isMajorLine ? 0 : ruleSize - 8]
          : [isMajorLine ? 0 : ruleSize - 8, position]
        const [width, height] = isHorizontal ? [0, ruleSize - top] : [ruleSize - left, 0]
        this.darwLine(ctx, {
          left,
          top,
          width,
          height,
          stroke: themeOption.borderColor
        })
      }
    }

    // 标尺蓝色遮罩
    if (this.objectRect) {
      const axis = isHorizontal ? 'x' : 'y'
      this.objectRect[axis].forEach((rect) => {
        // 跳过指定矩形
        if (rect.skip === axis) {
          return
        }
        // TODO
        const [left, top, width, height] = isHorizontal
          ? [(rect.left - startCalibration) * zoom, 0, rect.width * zoom, ruleSize]
          : [0, (rect.top - startCalibration) * zoom, ruleSize, rect.height * zoom]

        // 高亮遮罩
        // ctx.save()
        this.darwRect(ctx, {
          left,
          top,
          width,
          height,
          fill: themeOption.highlightColor
        })
        // ctx.restore()
      })
    }

    // 标尺文字显示
    for (let pos = 0; pos + startOffset <= unitLength; pos += gapInPx) {
      const position = (startOffset + pos) * zoom
      const textValue = (startValue + pos) / this.convertUnitsToPx(1, unit)

      const [left, top, angle] = isHorizontal
        ? [position + 6, padding, 0]
        : [padding, position - 6, -90]

      this.darwText(ctx, {
        text: `${Number(textValue.toFixed(2))}`,
        left,
        top,
        fill: themeOption.textColor,
        angle
      })
    }
    // draw end
  }


  private getGap(zoom: number, unit: string): number {
    // 获取当前单位对应的基准间隔倍率
    const gaps = this.config.conversionFactors[unit].gaps || DEFAULT_CONVERSION_FACTORS.gaps
    const base = this.config.conversionFactors[unit].px || DEFAULT_CONVERSION_FACTORS.px

    // 定义缩放比例数组
    const zooms = [0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
    let i = 0
    while (i < zooms.length && zooms[i] < zoom) {
      i++
    }
    return gaps[i - 1] * base || this.config.conversionFactors[unit].defaultGap * base // 如果没有匹配到，返回默认值defaultGap
  }
  private convertUnitsToPx(value: number, toUnit: string): number {
    return value * this.config.conversionFactors[toUnit].px || DEFAULT_CONVERSION_FACTORS.px
  }

  private darwRect(
    ctx: ICanvasContext2D,
    {
      left,
      top,
      width,
      height,
      fill,
      stroke,
      strokeWidth
    }: {
      left: number
      top: number
      width: number
      height: number
      fill?: string | CanvasGradient | CanvasPattern
      stroke?: string
      strokeWidth?: number
    }
  ) {
    ctx.save()
    ctx.beginPath()
    fill && (ctx.fillStyle = fill)
    ctx.rect(left, top, width, height)
    ctx.fill()
    if (stroke) {
      ctx.strokeStyle = stroke
      ctx.lineWidth = strokeWidth ?? 1
      ctx.stroke()
    }
    ctx.restore()
  }

  private darwText(
    ctx: ICanvasContext2D,
    {
      left,
      top,
      text,
      fill,
      align,
      angle,
      fontSize,
      baseline
    }: {
      left: number
      top: number
      text: string
      fill?: string | CanvasGradient | CanvasPattern
      align?: CanvasTextAlign
      baseline?: CanvasTextBaseline
      angle?: number
      fontSize?: number
    }
  ) {
    ctx.save()
    fill && (ctx.fillStyle = fill)
    ctx.textAlign = align ?? 'left'
    ctx.textBaseline = baseline ?? 'top'
    ctx.font = `${fontSize ?? 12}px Helvetica`
    if (angle) {
      ctx.translate(left, top)
      ctx.rotate(PiBy180 * angle)
      ctx.translate(-left, -top)
    }
    ctx.fillText(text, left, top)
    ctx.restore()
  }

  private darwLine(
    ctx: ICanvasContext2D,
    {
      left,
      top,
      width,
      height,
      stroke,
      lineWidth
    }: {
      left: number
      top: number
      width: number
      height: number
      stroke?: string | CanvasGradient | CanvasPattern
      lineWidth?: number
    }
  ) {
    ctx.save()
    ctx.beginPath()
    stroke && (ctx.strokeStyle = stroke)
    ctx.lineWidth = lineWidth ?? 1
    ctx.moveTo(left, top)
    ctx.lineTo(left + width, top + height)
    ctx.stroke()
    ctx.restore()
  }

  private calcObjectRect() {
    const activeObjects = this.app.editor?.list || []
    if (activeObjects.length === 0) {
      this.objectRect = undefined
      return
    }

    const allRect = activeObjects.reduce((rects: HighlightRect[], obj: IUI) => {
      const bounds = obj.getBounds('box', this.app.tree)
      const rect: HighlightRect = { left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height }
      rects.push(rect)
      return rects
    }, [] as HighlightRect[])
    if (allRect.length === 0) return
    this.objectRect = {
      x: this.mergeLines(allRect, true),
      y: this.mergeLines(allRect, false)
    }
  }

  private mergeLines(rect: Rect[], isHorizontal: boolean) {
    const axis = isHorizontal ? 'left' : 'top'
    const length = isHorizontal ? 'width' : 'height'
    // 先按照 axis 的大小排序
    rect.sort((a, b) => a[axis] - b[axis])
    const mergedLines = []
    let currentLine = Object.assign({}, rect[0])
    for (let i = 1; i < rect.length; i++) {
      const line = Object.assign({}, rect[i])
      if (currentLine[axis] + currentLine[length] >= line[axis]) {
        // 当前线段和下一个线段相交，合并宽度
        currentLine[length] =
          Math.max(currentLine[axis] + currentLine[length], line[axis] + line[length]) -
          currentLine[axis]
      } else {
        // 当前线段和下一个线段不相交，将当前线段加入结果数组中，并更新当前线段为下一个线段
        mergedLines.push(currentLine)
        currentLine = Object.assign({}, line)
      }
    }
    // 加入数组
    mergedLines.push(currentLine)
    return mergedLines
  }

  public getZoom(): number {
    if (this.app.tree) {
      if (typeof this.app.tree.scale === 'number') {
        return this.app.tree.scale
      } else {
        return 1
      }
    } else {
      return 1
    }
  }

  public dispose(): void {
    this.rulerLeafer.destroy()
    this.enabled = false
  }
}
