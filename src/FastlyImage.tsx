import * as React from 'react'
import { DetailedHTMLProps, FunctionComponent, ImgHTMLAttributes } from 'react'
import { FastlyImageOptions, FastlyImageParams, fastlyImageUrl } from '.'

export interface FastlyImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  fastlyParams: FastlyImageParams
  fastlyImageOptions?: FastlyImageOptions
}

const FastlyImage: FunctionComponent<FastlyImageProps> = ({ fastlyParams, fastlyImageOptions, src, ...rest }) => (
  <img src={src ? fastlyImageUrl(src, fastlyParams, fastlyImageOptions) : undefined} {...rest} />
)

export default FastlyImage
