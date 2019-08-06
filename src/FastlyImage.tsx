import * as React from 'react'
import { DetailedHTMLProps, FunctionComponent, ImgHTMLAttributes } from 'react'
import { FastlyImageParams, fastlyImageUrl } from '.'

export interface FastlyImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  fastlyParams: FastlyImageParams
}

const FastlyImage: FunctionComponent<FastlyImageProps> = ({ fastlyParams, src, ...rest }) => (
  <img src={src ? fastlyImageUrl(src, fastlyParams) : undefined} {...rest} />
)

export default FastlyImage
