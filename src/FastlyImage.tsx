import * as React from 'react'
import { DetailedHTMLProps, FunctionComponent, ImgHTMLAttributes } from 'react'
import { FastlyImageParams, fastlyImageUrl } from '.'
import { isBlobUrl } from './util'

export interface FastlyImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  fastlyParams: FastlyImageParams
  supportBlobs?: boolean
}

const FastlyImage: FunctionComponent<FastlyImageProps> = ({ fastlyParams, src, supportBlobs = false, ...rest }) => {
  if (!supportBlobs && src && isBlobUrl(src)) {
    fastlyParams = {}
  }

  return <img src={src ? fastlyImageUrl(src, fastlyParams) : undefined} {...rest} />
}

export default FastlyImage
