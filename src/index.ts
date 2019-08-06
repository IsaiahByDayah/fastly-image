/**
 * A Regex to test if percent strings are properly formatted
 */
export const PERCENT_REGEX = /^(d+)p$/

/**
 * String of format `${whole number}p`
 */
type Percentage = string

/**
 * Either a whole number as pixels or a string of format `${whole number}p`
 */
type PixelOrPercentage = number | Percentage

/**
 * Whole number between `1` and `10000` or float between `0.0` and `9999.999`
 */
type DevicePixelRation = number

/**
 * A croping scheme object to apply to the image or raw value string
 */
type Crop = SizeValues | CoordValues | OffsetValues | AspectRatioValues | SmartValues | string

/**
 * @member type The type of value
 * @member width The width of the image
 * @member height The height of the image]
 */
interface SizeValues<T = 'Size'> {
  type: T
  width: PixelOrPercentage
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
  x: PixelOrPercentage
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
  xOffset: Percentage
  yOffset: Percentage
}

/**
 * @member type The type of value
 * @member width The width of the image
 * @member height The height of the image
 * @member xOffset The horizontal offset of the source image
 * @member yOffset The vertical offset of the source image
 */
type AspectRatioValues = SizeValues<'AspectRatio'> | OffsetValues<'AspectRatio'>

/**
 * @member width The width of the image
 * @member height The height of the image
 */
type SmartValues = SizeValues<'Smart'>

/**
 * Describes values for the edges of an image
 */
interface EdgeValues {
  top?: PixelOrPercentage
  right?: PixelOrPercentage
  bottom?: PixelOrPercentage
  left?: PixelOrPercentage
}

/**
 * An edge values object of how much to trim from each side or a raw value string
 */
type Trim = EdgeValues | string

/**
 * An edge values object of how much to pad to each side or a raw value string
 *
 * Ignored if `canvas` is also supplied
 */
type Padding = EdgeValues | string

/**
 * Increases the size of the canvas around an image
 */
type Canvas = SizeValues | CoordValues | OffsetValues | AspectRatioValues | string

/**
 * A hex value string (without '#')
 */
type Hex = string

/**
 * @member r Red color value between `0` and `255`
 * @member g Green color value between `0` and `255`
 * @member b Blue color value between `0` and `255`
 * @member a Alpha color value between `0.0` and `1.0`
 */
interface RGBA {
  r: number
  g: number
  b: number
  a?: number
}

type Color = Hex | RGBA

/**
 * Orientation style to apply to image
 */
enum Orientation {
  Default = '1',
  RotateRight = 'r',
  RotateLeft = 'l',
  FlipHorizontal = 'h',
  FlipVertical = 'v',
  Upsidedown = 'hv',
  MirrorLeft = '5',
  MirrorRight = '7',
}

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
  amount: number
  radius: number
  threshold: number
}

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

/**
 * Number between `1` and `100`
 *
 * Output image quality for lossy file formats
 *
 * If the `auto` is enabled through params or in the service settings, an array of 2 numbers can be supplied with the second value used as the quality value if the requestor sends the `accept: image/webp` request header
 */
type Quality = number | number[]

/**
 * Turns on functionality that automates certain optimization features
 *
 * Overrides the `format` parameter in browsers that support WebP
 */
type Auto = boolean

/**
 * Enables image upscaling
 *
 * Must be used with the `width`, `height` or `dpr/devicePixelRatio` parameters to see the effects in the output image
 */
type Upscaling = boolean

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
  width?: PixelOrPercentage
  height?: PixelOrPercentage
  dpr?: DevicePixelRation // Alias for `devicePixelRatio`
  devicePixelRatio?: DevicePixelRation
  fit?: 'bounds' | 'cover' | 'crop'
  crop?: Crop
  trim?: Trim
  pad?: Padding // Alias for `padding`
  padding?: Padding
  canvas?: Canvas
  bgColor?: Color // Alias for `backgroundColor`
  backgroundColor?: Color
  orient?: Orientation // Alias for `orientation`
  orientation?: Orientation
  bright?: Brightness // Alias for `brightness`
  brightness?: Brightness
  con?: Contrast // Alias for `constrast`
  contrast?: Contrast
  sat?: Saturation // Alias for `saturation`
  saturation?: Saturation
  sharpen?: Sharpen
  blur?: Blur
  format?: Format
  frame?: Frame
  quality?: Quality
  auto?: Auto
  upscaling?: Upscaling
  resFil?: ResizeFilter // Alias for `resizeFilter`
  resizeFilter?: ResizeFilter
}
