import { isEmpty } from 'lodash'
import * as queryString from 'query-string'
import { compact, isBlobUrl } from './util'

/**
 * A Regex to test if percent strings are properly formatted
 */
export const PERCENT_REGEX = /^(d+)p$/

/**
 * String of format `${whole number}p`
 */
type Percentage = string

/**
 * Either a whole number for pixels or a string of format `${whole number}p` for percentage
 */
type PixelOrPercentage = number | Percentage

/**
 * Whole number between `1` and `10000` or float between `0.0` and `9999.999`
 */
type DevicePixelRation = number

/**
 * A croping scheme object to apply to the image or raw value string
 */
type Crop = SizeValues | CoordValues | OffsetValues | AspectRatioValues | AspectRatioOffsetValues | SmartValues | string
const cropToString = (crop: Crop) => {
  if (typeof crop === 'string') {
    return crop
  } else {
    switch (crop.type) {
      case 'Size':
        return `${crop.width},${crop.height}`
      case 'Coord':
        return `${crop.width},${crop.height},x${crop.x},y${crop.y}`
      case 'Offset':
        return `${crop.width},${crop.height},offset-x${crop.xOffset},offset-y${crop.yOffset}`
      case 'AspectRatio':
        return `${crop.width}:${crop.height}`
      case 'AspectRatioOffset':
        return `${crop.width}:${crop.height},offset-x${crop.xOffset},offset-y${crop.yOffset}`
      case 'Smart':
        return `${crop.width}:${crop.height},smart`
    }
  }
}

/**
 * @member type The type of value
 * @member width The width of the image
 * @member height The height of the image]
 */
interface SizeValues<T = 'Size'> {
  /** The type of value */
  type: T
  /** The width of the image */
  width: PixelOrPercentage
  /** The width of the image */
  height: PixelOrPercentage
}

/**
 * @member type The type of value
 * @member width The width of the image
 * @member height The height of the image
 * @member x The x coordinate sub-region of the source image
 * @member y The y coordinate sub-region of the source image
 */
interface CoordValues extends SizeValues<'Coord'> {
  /** The x coordinate sub-region of the source image */
  x: PixelOrPercentage
  /** The y coordinate sub-region of the source image */
  y: PixelOrPercentage
}

/**
 * @member type The type of value
 * @member width The width of the image
 * @member height The height of the image
 * @member xOffset The horizontal offset of the source image
 * @member yOffset The vertical offset of the source image
 */
interface OffsetValues<T = 'Offset'> extends SizeValues<T> {
  /** The horizontal offset of the source image */
  xOffset: Percentage
  /** The vertical offset of the source image */
  yOffset: Percentage
}

/**
 * @member type The type of value
 * @member width The width of the image
 * @member height The height of the image
 */
type AspectRatioValues = SizeValues<'AspectRatio'>

/**
 * @member type The type of value
 * @member width The width of the image
 * @member height The height of the image
 * @member xOffset The horizontal offset of the source image
 * @member yOffset The vertical offset of the source image
 */
type AspectRatioOffsetValues = OffsetValues<'AspectRatioOffset'>

/**
 * @member width The width of the image
 * @member height The height of the image
 */
type SmartValues = SizeValues<'Smart'>

/**
 * Describes values for the edges of an image
 */
interface EdgeValues {
  /** Either a whole number for pixels or a string of format `${whole number}p` for percentage */
  top: PixelOrPercentage
  /** Either a whole number for pixels or a string of format `${whole number}p` for percentage */
  right: PixelOrPercentage
  /** Either a whole number for pixels or a string of format `${whole number}p` for percentage */
  bottom: PixelOrPercentage
  /** Either a whole number for pixels or a string of format `${whole number}p` for percentage */
  left: PixelOrPercentage
}
const edgeValuesToString = ({ top, right, bottom, left }: EdgeValues): string => `${top},${right},${bottom},${left}`

/**
 * An edge values object of how much to trim from each side or a raw value string
 *
 * As a string, values can be specified using CSS style shorthand values
 */
type Trim = EdgeValues | string
const trimToString = (trim: Trim): string => {
  if (typeof trim === 'string') {
    return trim
  } else {
    return edgeValuesToString(trim)
  }
}

/**
 * An edge values object of how much to pad to each side or a raw value string
 *
 * As a string, values can be specified using CSS style shorthand values
 *
 * Ignored if `canvas` is also supplied
 */
type Padding = EdgeValues | string
const paddingToString = (padding: Padding): string => {
  if (typeof padding === 'string') {
    return padding
  } else {
    return edgeValuesToString(padding)
  }
}

/**
 * Increases the size of the canvas around an image
 */
type Canvas = SizeValues | CoordValues | OffsetValues | AspectRatioValues | AspectRatioOffsetValues | string
const canvasToString = (canvas: Canvas) => {
  if (typeof canvas === 'string') {
    return canvas
  } else {
    switch (canvas.type) {
      case 'Size':
        return `${canvas.width},${canvas.height}`
      case 'Coord':
        return `${canvas.width},${canvas.height},x${canvas.x},y${canvas.y}`
      case 'Offset':
        return `${canvas.width},${canvas.height},offset-x${canvas.xOffset},offset-y${canvas.yOffset}`
      case 'AspectRatio':
        return `${canvas.width}:${canvas.height}`
      case 'AspectRatioOffset':
        return `${canvas.width}:${canvas.height},offset-x${canvas.xOffset},offset-y${canvas.yOffset}`
    }
  }
}

/**
 * A hex value string (without `#`)
 */
type Hex = string

/**
 * @member r Red color value between `0` and `255`
 * @member g Green color value between `0` and `255`
 * @member b Blue color value between `0` and `255`
 * @member a Alpha color value between `0.0` and `1.0`
 */
interface RGBA {
  /** Red color value between `0` and `255` */
  r: number
  /** Green color value between `0` and `255` */
  g: number
  /** Blue color value between `0` and `255` */
  b: number
  /** Alpha color value between `0.0` and `1.0` */
  a?: number
}

/**
 * A hex value string (without `#`) OR an object describing the color via rgba
 */
type Color = Hex | RGBA
const colorToString = (color: Color) =>
  typeof color === 'string' ? color : `${color.r},${color.g},${color.b}${color.a !== undefined ? `,${color.a}` : ''}`

/**
 * Orientation style to apply to image
 */
type Orientation = keyof typeof Orientations
const Orientations = {
  Default: '1',
  RotateRight: 'r',
  RotateLeft: 'l',
  FlipHorizontal: 'h',
  FlipVertical: 'v',
  Upsidedown: 'hv',
  MirrorLeft: '5',
  MirrorRight: '7',
}
const orientationToString = (orientation: Orientation) => Orientations[orientation]

/**
 * Value between `-100` and `100`
 *
 * Increases or decreases the amount of perceived light an image radiates or reflects
 *
 * `-100` will be fully black. `100` will be fully white. Default is `0`
 */
type Brightness = number

/**
 * Value between `-100` and `100`
 *
 * Increases or decreases the difference between the darkest and lightest tones in an image
 *
 * `-100` will be fully black. `100` will be fully white. Default is `0`
 */
type Contrast = number

/**
 * Value between `-100` and `100`
 *
 * Increases or decreases the intensity of the colors in an image
 *
 * `-100` will be fully black. `100` will be fully white. Default is `0`
 */
type Saturation = number

/**
 * Increases the definition of the edges of objects in an image
 *
 * @member amount value between `0` and `10`
 * @member radius value between `1` and `1000`
 * @member threshold value between `0` and `255`
 */
interface Sharpen {
  /** value between `0` and `10` */
  amount: number
  /** value between `1` and `1000` */
  radius: number
  /** value between `0` and `255` */
  threshold: number
}
const sharpenToString = ({ amount, radius, threshold }: Sharpen) => `a${amount},r${radius},t${threshold}`

/**
 * Value between `1` and `1000`
 *
 * Decreases the definition and focus of an image
 */
type Blur = number

/**
 * Enables the source image to be converted (a.k.a., "transcoded") from one encoded format to another. This is very useful when the source image has been saved in a sub-optimal file format that hinders performance
 *
 * The source image can be any of the following image formats: `JPEG`, `PNG`, `GIF`, `WEBP`
 */
type Format = 'gif' | 'png' | 'png8' | 'jpg' | 'pjpg' | 'webp' | 'webpll' | 'webply'

/**
 * Extract the first frame from an animated image sequence
 *
 * Only supported when the source image is an Animated GIF
 *
 * The first frame is currently the only frame able to be returned
 */
type Frame = boolean
const frameToString = (frame: Frame) => (frame ? '1' : undefined)

/**
 * Number between `1` and `100`
 *
 * Sets the output image's quality for lossy file formats
 *
 * If the `auto` is enabled through params or in the service settings, an array of 2 numbers can be supplied with the second value used as the quality value if the requestor sends the `accept: image/webp` request header
 */
type Quality = number | number[]
const qualityToString = (quality: Quality) =>
  typeof quality === 'number' ? `${quality}` : quality.length === 2 ? `${quality[0]},${quality[1]}` : undefined

/**
 * Turns on functionality that automates certain optimization features
 *
 * Overrides the `format` parameter in browsers that support WebP
 */
type Auto = boolean
const autoToString = (auto: Auto) => (auto ? 'webp' : undefined)

/**
 * Enables image upscaling
 *
 * Must be used with the `width`, `height` or `devicePixelRatio` parameters to see the effects in the output image
 */
type Upscaling = boolean
const upscalingToString = (upscaling: Upscaling) => (upscaling ? 'upscale' : undefined)

/**
 * Control the resizing filter used to generate a new image with a higher or lower number of pixels
 *
 * When making an image smaller, use `bicubic`, which has a natural sharpening effect
 *
 * When making an image larger, use `bilinear`, which has a natural smoothing effect
 *
 * When resizing pixel art, use `nearest`, which has a natural pixelation effect
 *
 * When quality is the main concern, use `lanczos`, which typically renders the best results
 */
type ResizeFilter = 'nearest' | 'bilinear' | 'bicubic' | 'lanczos' | 'lanczos2'

export interface FastlyImageParams {
  /** Either a whole number for pixels or a string of format `${whole number}p` for percentage */
  width?: PixelOrPercentage
  /** Either a whole number for pixels or a string of format `${whole number}p` for percentage */
  height?: PixelOrPercentage
  /** Whole number between `1` and `10000` or float between `0.0` and `9999.999` */
  dpr?: DevicePixelRation
  /**
   * Whole number between `1` and `10000` or float between `0.0` and `9999.999`
   * @alias dpr
   */
  devicePixelRatio?: DevicePixelRation
  fit?: 'bounds' | 'cover' | 'crop'
  /** A croping scheme object to apply to the image or raw value string */
  crop?: Crop
  /**
   * An edge values object of how much to trim from each side or a raw value string
   *
   * As a string, values can be specified using CSS style shorthand values
   */
  trim?: Trim
  /**
   * An edge values object of how much to pad to each side or a raw value string
   *
   * As a string, values can be specified using CSS style shorthand values
   *
   * Ignored if `canvas` is also supplied
   */
  pad?: Padding
  /**
   * An edge values object of how much to pad to each side or a raw value string
   *
   * As a string, values can be specified using CSS style shorthand values
   *
   * Ignored if `canvas` is also supplied
   * @alias pad
   */
  padding?: Padding
  /** Object describing the size of the canvas around an image or a raw value string */
  canvas?: Canvas
  /** A hex value string (without `#`) OR an object describing the color via rgba */
  bgColor?: Color
  /**
   * A hex value string (without `#`) OR an object describing the color via rgba
   * @alias bgColor
   */
  backgroundColor?: Color
  /** Orientation style to apply to image */
  orient?: Orientation
  /**
   * Orientation style to apply to image
   * @alias orient
   */
  orientation?: Orientation
  /**
   * Value between `-100` and `100`
   *
   * Increases or decreases the amount of perceived light an image radiates or reflects
   *
   * `-100` will be fully black. `100` will be fully white. Default is `0`
   */
  bright?: Brightness
  /**
   * Value between `-100` and `100`
   *
   * Increases or decreases the amount of perceived light an image radiates or reflects
   *
   * `-100` will be fully black. `100` will be fully white. Default is `0`
   * @alias bright
   */
  brightness?: Brightness
  /**
   * Value between `-100` and `100`
   *
   * Increases or decreases the difference between the darkest and lightest tones in an image
   *
   * `-100` will be fully black. `100` will be fully white. Default is `0`
   */
  con?: Contrast
  /**
   * Value between `-100` and `100`
   *
   * Increases or decreases the difference between the darkest and lightest tones in an image
   *
   * `-100` will be fully black. `100` will be fully white. Default is `0`
   * @alias con
   */
  contrast?: Contrast
  /**
   * Value between `-100` and `100`
   *
   * Increases or decreases the intensity of the colors in an image
   *
   * `-100` will be fully black. `100` will be fully white. Default is `0`
   */
  sat?: Saturation
  /**
   * Value between `-100` and `100`
   * @alias sat
   */
  saturation?: Saturation
  /** Increases the definition of the edges of objects in an image */
  sharpen?: Sharpen
  /**
   * Value between `1` and `1000`
   *
   * Decreases the definition and focus of an image
   */
  blur?: Blur
  /**
   * Enables the source image to be converted (a.k.a., "transcoded") from one encoded format to another. This is very useful when the source image has been saved in a sub-optimal file format that hinders performance
   *
   * The source image can be any of the following image formats: `JPEG`, `PNG`, `GIF`, `WEBP`
   */
  format?: Format
  /**
   * Extract the first frame from an animated image sequence
   *
   * Only supported when the source image is an Animated GIF
   *
   * The first frame is currently the only frame able to be returned
   */
  frame?: Frame
  /**
   * Number between `1` and `100`
   *
   * Sets the output image's quality for lossy file formats
   *
   * If the `auto` is enabled through params or in the service settings, an array of 2 numbers can be supplied with the second value used as the quality value if the requestor sends the `accept: image/webp` request header
   */
  quality?: Quality
  /**
   * Turns on functionality that automates certain optimization features
   *
   * Overrides the `format` parameter in browsers that support WebP
   */
  auto?: Auto
  /**
   * Enables image upscaling
   *
   * Must be used with the `width`, `height` or `devicePixelRatio` parameters to see the effects in the output image
   */
  upscaling?: Upscaling
  /**
   * Control the resizing filter used to generate a new image with a higher or lower number of pixels
   *
   * When making an image smaller, use `bicubic`, which has a natural sharpening effect
   *
   * When making an image larger, use `bilinear`, which has a natural smoothing effect
   *
   * When resizing pixel art, use `nearest`, which has a natural pixelation effect
   *
   * When quality is the main concern, use `lanczos`, which typically renders the best results
   */
  resFil?: ResizeFilter
  /**
   * Control the resizing filter used to generate a new image with a higher or lower number of pixels
   *
   * When making an image smaller, use `bicubic`, which has a natural sharpening effect
   *
   * When making an image larger, use `bilinear`, which has a natural smoothing effect
   *
   * When resizing pixel art, use `nearest`, which has a natural pixelation effect
   *
   * When quality is the main concern, use `lanczos`, which typically renders the best results
   * @alias resFil
   */
  resizeFilter?: ResizeFilter
}

export interface FastlyImageOptions {
  /**
   * Rather fastly params should be applied to blob URLs
   *
   * Default: `false`
   */
  supportBlobs?: boolean
}

const DEFAULT_OPTIONS: FastlyImageOptions = {
  supportBlobs: false,
}

const fastlyImageUrl = (imageUrl: string, params: FastlyImageParams, options?: FastlyImageOptions): string => {
  // Apple option overrides
  const _options = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  // Handle Blob Url Support
  if (!_options.supportBlobs && isBlobUrl(imageUrl)) {
    return imageUrl
  }

  const { url, query } = queryString.parseUrl(imageUrl, { decode: false })

  // Destructure
  const {
    width,
    height,
    fit,
    crop,
    trim,
    canvas,
    devicePixelRatio,
    padding,
    backgroundColor,
    orientation,
    bright,
    con,
    sat,
    sharpen,
    blur,
    format,
    frame,
    quality,
    auto,
    upscaling,
    resFil,
  } = params

  let { dpr, pad, bgColor, orient, brightness, contrast, saturation, resizeFilter } = params

  dpr = dpr || devicePixelRatio
  pad = pad || padding
  bgColor = bgColor || backgroundColor
  orient = orient || orientation
  brightness = bright || brightness
  contrast = con || contrast
  saturation = sat || saturation
  resizeFilter = resFil || resizeFilter

  const input = compact(
    {
      dpr: (dpr !== undefined && dpr) || undefined,
      pad: (pad && paddingToString(pad)) || undefined,
      'bg-color': (bgColor && colorToString(bgColor)) || undefined,
      orient: (orient && orientationToString(orient)) || undefined,
      brightness,
      contrast,
      saturation,
      'resize-filter': resizeFilter,
      crop: (crop && cropToString(crop)) || undefined,
      width,
      height,
      fit,
      trim: (trim && trimToString(trim)) || undefined,
      canvas: (canvas && canvasToString(canvas)) || undefined,
      sharpen: (sharpen && sharpenToString(sharpen)) || undefined,
      blur,
      format,
      frame: (frame !== undefined && frameToString(frame)) || undefined,
      quality: (quality !== undefined && qualityToString(quality)) || undefined,
      auto: (auto !== undefined && autoToString(auto)) || undefined,
      enable: (upscaling !== undefined && upscalingToString(upscaling)) || undefined,
    },
    { false: false }
  )

  const finalQuery = { ...query, ...input }

  return `${url}${isEmpty(finalQuery) ? '' : `?${queryString.stringify(finalQuery, { encode: false })}`}`
}

export default fastlyImageUrl
