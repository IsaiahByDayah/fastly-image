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

export interface IFastlyImageParams {
  width?: PixelOrPercentage
  height?: PixelOrPercentage
  dpr?: DevicePixelRation
  devicePixelRatio?: DevicePixelRation
  fit?: 'bounds' | 'cover' | 'crop'
  crop?: Crop
  trim?: Trim
  pad?: Padding
  padding?: Padding
  canvas?: Canvas
  bgColor?: Color
  backgroundColor?: Color
  orient?: Orientation
  orientation?: Orientation
  brightness?: Brightness
  contrast?: Contrast
  saturation?: Saturation
  sharpen?: Sharpen
}
