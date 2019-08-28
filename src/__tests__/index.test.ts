import { fastlyImageUrl } from '../index'

const IMAGE_URL = 'https://www.example.com/image.jpg'

test('Sanity Check', () => {
  expect(true).toBe(true)
})
describe('Fastly Params', () => {
  describe('Width', () => {
    test('pixels', () => {
      expect(fastlyImageUrl(IMAGE_URL, { width: 200 })).toEqual(`${IMAGE_URL}?width=200`)
    })

    test('percentage', () => {
      expect(fastlyImageUrl(IMAGE_URL, { width: '200p' })).toEqual(`${IMAGE_URL}?width=200p`)
    })
  })

  describe('Height', () => {
    test('pixels', () => {
      expect(fastlyImageUrl(IMAGE_URL, { height: 200 })).toEqual(`${IMAGE_URL}?height=200`)
    })

    test('percentage', () => {
      expect(fastlyImageUrl(IMAGE_URL, { height: '200p' })).toEqual(`${IMAGE_URL}?height=200p`)
    })
  })

  describe('Device Pixel Ratio', () => {
    test('integer', () => {
      expect(fastlyImageUrl(IMAGE_URL, { dpr: 2 })).toEqual(`${IMAGE_URL}?dpr=2`)
    })

    test('float', () => {
      expect(fastlyImageUrl(IMAGE_URL, { devicePixelRatio: 1.5 })).toEqual(`${IMAGE_URL}?dpr=1.5`)
    })
  })

  describe('Fit', () => {
    test('bounds', () => {
      expect(fastlyImageUrl(IMAGE_URL, { fit: 'bounds' })).toEqual(`${IMAGE_URL}?fit=bounds`)
    })

    test('cover', () => {
      expect(fastlyImageUrl(IMAGE_URL, { fit: 'cover' })).toEqual(`${IMAGE_URL}?fit=cover`)
    })

    test('crop', () => {
      expect(fastlyImageUrl(IMAGE_URL, { fit: 'crop' })).toEqual(`${IMAGE_URL}?fit=crop`)
    })
  })

  describe('Crop', () => {
    test('raw', () => {
      expect(fastlyImageUrl(IMAGE_URL, { crop: 'foo' })).toEqual(`${IMAGE_URL}?crop=foo`)
    })

    test('size', () => {
      expect(fastlyImageUrl(IMAGE_URL, { crop: { type: 'Size', height: 900, width: 1600 } })).toEqual(
        `${IMAGE_URL}?crop=1600,900`
      )
    })

    test('coordinates', () => {
      expect(
        fastlyImageUrl(IMAGE_URL, { crop: { type: 'Coord', height: 900, width: 1600, x: 100, y: '50p' } })
      ).toEqual(`${IMAGE_URL}?crop=1600,900,x100,y50p`)
    })

    test('offset', () => {
      expect(
        fastlyImageUrl(IMAGE_URL, {
          crop: { type: 'Offset', height: 900, width: 1600, xOffset: '100p', yOffset: '50p' },
        })
      ).toEqual(`${IMAGE_URL}?crop=1600,900,offset-x100p,offset-y50p`)
    })

    test('aspect ratio', () => {
      expect(fastlyImageUrl(IMAGE_URL, { crop: { type: 'AspectRatio', height: 9, width: 16 } })).toEqual(
        `${IMAGE_URL}?crop=16:9`
      )
    })

    test('aspect ratio w/ offset', () => {
      expect(
        fastlyImageUrl(IMAGE_URL, {
          crop: { type: 'AspectRatioOffset', height: 9, width: 16, xOffset: '100p', yOffset: '50p' },
        })
      ).toEqual(`${IMAGE_URL}?crop=16:9,offset-x100p,offset-y50p`)
    })

    test('smart', () => {
      expect(
        fastlyImageUrl(IMAGE_URL, {
          crop: { type: 'Smart', height: 9, width: 16 },
        })
      ).toEqual(`${IMAGE_URL}?crop=16:9,smart`)
    })
  })

  describe('Trim', () => {
    test('raw', () => {
      expect(fastlyImageUrl(IMAGE_URL, { trim: 'foo' })).toEqual(`${IMAGE_URL}?trim=foo`)
    })

    test('values', () => {
      expect(fastlyImageUrl(IMAGE_URL, { trim: { top: 100, right: '50p', bottom: 200, left: '25p' } })).toEqual(
        `${IMAGE_URL}?trim=100,50p,200,25p`
      )
    })
  })

  describe('Padding', () => {
    test('raw', () => {
      expect(fastlyImageUrl(IMAGE_URL, { pad: 'foo' })).toEqual(`${IMAGE_URL}?pad=foo`)
    })

    test('values', () => {
      expect(fastlyImageUrl(IMAGE_URL, { padding: { top: 100, right: '50p', bottom: 200, left: '25p' } })).toEqual(
        `${IMAGE_URL}?pad=100,50p,200,25p`
      )
    })
  })

  describe('Canvas', () => {
    test('raw', () => {
      expect(fastlyImageUrl(IMAGE_URL, { canvas: 'foo' })).toEqual(`${IMAGE_URL}?canvas=foo`)
    })

    test('size', () => {
      expect(fastlyImageUrl(IMAGE_URL, { canvas: { type: 'Size', height: 900, width: 1600 } })).toEqual(
        `${IMAGE_URL}?canvas=1600,900`
      )
    })

    test('coordinates', () => {
      expect(
        fastlyImageUrl(IMAGE_URL, { canvas: { type: 'Coord', height: 900, width: 1600, x: 100, y: '50p' } })
      ).toEqual(`${IMAGE_URL}?canvas=1600,900,x100,y50p`)
    })

    test('offset', () => {
      expect(
        fastlyImageUrl(IMAGE_URL, {
          canvas: { type: 'Offset', height: 900, width: 1600, xOffset: '100p', yOffset: '50p' },
        })
      ).toEqual(`${IMAGE_URL}?canvas=1600,900,offset-x100p,offset-y50p`)
    })

    test('aspect ratio', () => {
      expect(fastlyImageUrl(IMAGE_URL, { canvas: { type: 'AspectRatio', height: 9, width: 16 } })).toEqual(
        `${IMAGE_URL}?canvas=16:9`
      )
    })

    test('aspect ratio w/ offset', () => {
      expect(
        fastlyImageUrl(IMAGE_URL, {
          canvas: { type: 'AspectRatioOffset', height: 9, width: 16, xOffset: '100p', yOffset: '50p' },
        })
      ).toEqual(`${IMAGE_URL}?canvas=16:9,offset-x100p,offset-y50p`)
    })
  })

  describe('Background Color', () => {
    test('hex', () => {
      expect(fastlyImageUrl(IMAGE_URL, { bgColor: 'fff' })).toEqual(`${IMAGE_URL}?bg-color=fff`)
    })

    test('rgb', () => {
      expect(fastlyImageUrl(IMAGE_URL, { bgColor: { r: 255, g: 255, b: 255 } })).toEqual(
        `${IMAGE_URL}?bg-color=255,255,255`
      )
    })

    test('rgba', () => {
      expect(fastlyImageUrl(IMAGE_URL, { backgroundColor: { r: 255, g: 255, b: 255, a: 0.5 } })).toEqual(
        `${IMAGE_URL}?bg-color=255,255,255,0.5`
      )
    })
  })

  describe('Orientation', () => {
    test('default', () => {
      expect(fastlyImageUrl(IMAGE_URL, { orient: 'Default' })).toEqual(`${IMAGE_URL}?orient=1`)
    })

    test('rotate right', () => {
      expect(fastlyImageUrl(IMAGE_URL, { orient: 'RotateRight' })).toEqual(`${IMAGE_URL}?orient=r`)
    })

    test('rotate left', () => {
      expect(fastlyImageUrl(IMAGE_URL, { orient: 'RotateLeft' })).toEqual(`${IMAGE_URL}?orient=l`)
    })

    test('flip horizontally', () => {
      expect(fastlyImageUrl(IMAGE_URL, { orient: 'FlipHorizontal' })).toEqual(`${IMAGE_URL}?orient=h`)
    })

    test('flip vertically', () => {
      expect(fastlyImageUrl(IMAGE_URL, { orient: 'FlipVertical' })).toEqual(`${IMAGE_URL}?orient=v`)
    })

    test('upside-down', () => {
      expect(fastlyImageUrl(IMAGE_URL, { orient: 'Upsidedown' })).toEqual(`${IMAGE_URL}?orient=hv`)
    })

    test('mirror left', () => {
      expect(fastlyImageUrl(IMAGE_URL, { orient: 'MirrorLeft' })).toEqual(`${IMAGE_URL}?orient=5`)
    })

    test('mirror right', () => {
      expect(fastlyImageUrl(IMAGE_URL, { orient: 'MirrorRight' })).toEqual(`${IMAGE_URL}?orient=7`)
    })
  })

  describe('Brightness', () => {
    test('integer', () => {
      expect(fastlyImageUrl(IMAGE_URL, { bright: -50 })).toEqual(`${IMAGE_URL}?brightness=-50`)
    })

    test('float', () => {
      expect(fastlyImageUrl(IMAGE_URL, { brightness: 25.75 })).toEqual(`${IMAGE_URL}?brightness=25.75`)
    })
  })

  describe('Contrast', () => {
    test('integer', () => {
      expect(fastlyImageUrl(IMAGE_URL, { con: -50 })).toEqual(`${IMAGE_URL}?contrast=-50`)
    })

    test('float', () => {
      expect(fastlyImageUrl(IMAGE_URL, { contrast: 25.75 })).toEqual(`${IMAGE_URL}?contrast=25.75`)
    })
  })

  describe('Saturation', () => {
    test('integer', () => {
      expect(fastlyImageUrl(IMAGE_URL, { sat: -50 })).toEqual(`${IMAGE_URL}?saturation=-50`)
    })

    test('float', () => {
      expect(fastlyImageUrl(IMAGE_URL, { saturation: 25.75 })).toEqual(`${IMAGE_URL}?saturation=25.75`)
    })
  })

  describe('Sharpen', () => {
    test('value', () => {
      expect(fastlyImageUrl(IMAGE_URL, { sharpen: { amount: 5, radius: 500, threshold: 156 } })).toEqual(
        `${IMAGE_URL}?sharpen=a5,r500,t156`
      )
    })
  })

  describe('Blur', () => {
    test('value', () => {
      expect(fastlyImageUrl(IMAGE_URL, { blur: 500 })).toEqual(`${IMAGE_URL}?blur=500`)
    })
  })

  describe('Format', () => {
    test('gif', () => {
      expect(fastlyImageUrl(IMAGE_URL, { format: 'gif' })).toEqual(`${IMAGE_URL}?format=gif`)
    })

    test('jpg', () => {
      expect(fastlyImageUrl(IMAGE_URL, { format: 'jpg' })).toEqual(`${IMAGE_URL}?format=jpg`)
    })

    test('pjpg', () => {
      expect(fastlyImageUrl(IMAGE_URL, { format: 'pjpg' })).toEqual(`${IMAGE_URL}?format=pjpg`)
    })

    test('png', () => {
      expect(fastlyImageUrl(IMAGE_URL, { format: 'png' })).toEqual(`${IMAGE_URL}?format=png`)
    })

    test('png8', () => {
      expect(fastlyImageUrl(IMAGE_URL, { format: 'png8' })).toEqual(`${IMAGE_URL}?format=png8`)
    })

    test('webp', () => {
      expect(fastlyImageUrl(IMAGE_URL, { format: 'webp' })).toEqual(`${IMAGE_URL}?format=webp`)
    })

    test('webpll', () => {
      expect(fastlyImageUrl(IMAGE_URL, { format: 'webpll' })).toEqual(`${IMAGE_URL}?format=webpll`)
    })

    test('webply', () => {
      expect(fastlyImageUrl(IMAGE_URL, { format: 'webply' })).toEqual(`${IMAGE_URL}?format=webply`)
    })
  })

  describe('Frame', () => {
    test('value', () => {
      expect(fastlyImageUrl(IMAGE_URL, { frame: true })).toEqual(`${IMAGE_URL}?frame=1`)
    })
  })

  describe('Quality', () => {
    test('default', () => {
      expect(fastlyImageUrl(IMAGE_URL, { quality: 50 })).toEqual(`${IMAGE_URL}?quality=50`)
    })

    test('w/ webp value', () => {
      expect(fastlyImageUrl(IMAGE_URL, { quality: [50, 75] })).toEqual(`${IMAGE_URL}?quality=50,75`)
    })

    test('not enough numbers supplied', () => {
      expect(fastlyImageUrl(IMAGE_URL, { quality: [] })).toEqual(`${IMAGE_URL}`)
    })

    test('too many numbers supplied', () => {
      expect(fastlyImageUrl(IMAGE_URL, { quality: [1, 2, 3] })).toEqual(`${IMAGE_URL}`)
    })
  })

  describe('Auto', () => {
    test('value', () => {
      expect(fastlyImageUrl(IMAGE_URL, { auto: true })).toEqual(`${IMAGE_URL}?auto=webp`)
    })
  })

  describe('Upscaling', () => {
    test('value', () => {
      expect(fastlyImageUrl(IMAGE_URL, { upscaling: true })).toEqual(`${IMAGE_URL}?enable=upscale`)
    })
  })

  describe('Resize Filter', () => {
    test('nearest', () => {
      expect(fastlyImageUrl(IMAGE_URL, { resFil: 'nearest' })).toEqual(`${IMAGE_URL}?resize-filter=nearest`)
    })

    test('bilinear', () => {
      expect(fastlyImageUrl(IMAGE_URL, { resizeFilter: 'bilinear' })).toEqual(`${IMAGE_URL}?resize-filter=bilinear`)
    })

    test('bicubic', () => {
      expect(fastlyImageUrl(IMAGE_URL, { resizeFilter: 'bicubic' })).toEqual(`${IMAGE_URL}?resize-filter=bicubic`)
    })

    test('lanczos', () => {
      expect(fastlyImageUrl(IMAGE_URL, { resizeFilter: 'lanczos' })).toEqual(`${IMAGE_URL}?resize-filter=lanczos`)
    })

    test('lanczos2', () => {
      expect(fastlyImageUrl(IMAGE_URL, { resizeFilter: 'lanczos2' })).toEqual(`${IMAGE_URL}?resize-filter=lanczos2`)
    })
  })

  describe('Upscaling', () => {
    test('value', () => {
      expect(fastlyImageUrl(IMAGE_URL, { upscaling: true })).toEqual(`${IMAGE_URL}?enable=upscale`)
    })
  })

  describe('Number of Fastly Params', () => {
    describe('Zero', () => {
      test('Incoming URL w/o params', () => {
        expect(fastlyImageUrl(IMAGE_URL, {})).toEqual(IMAGE_URL)
      })

      test('Incoming URL w/ params', () => {
        expect(fastlyImageUrl(`${IMAGE_URL}?foo=bar`, {})).toEqual(`${IMAGE_URL}?foo=bar`)
      })
    })

    describe('One', () => {
      test('Incoming URL w/o params', () => {
        expect(fastlyImageUrl(IMAGE_URL, { height: 100 })).toEqual(`${IMAGE_URL}?height=100`)
      })

      test('Incoming URL w/ params', () => {
        expect(fastlyImageUrl(`${IMAGE_URL}?foo=bar`, { height: 100 })).toEqual(`${IMAGE_URL}?foo=bar&height=100`)
      })
    })

    describe('Multiple', () => {
      test('Incoming URL w/o params', () => {
        expect(fastlyImageUrl(IMAGE_URL, { height: 100, width: 200, auto: true, blur: 500 })).toEqual(
          `${IMAGE_URL}?auto=webp&blur=500&height=100&width=200`
        )
      })

      test('Incoming URL w/ params', () => {
        expect(fastlyImageUrl(`${IMAGE_URL}?foo=bar`, { height: 100, width: 200, auto: true, blur: 500 })).toEqual(
          `${IMAGE_URL}?auto=webp&blur=500&foo=bar&height=100&width=200`
        )
      })
    })
  })
})

describe('Fastly Options', () => {
  describe('supportsBlobs', () => {
    const BLOB_URL = `blob:${IMAGE_URL}`
    test('without support (default)', () => {
      expect(fastlyImageUrl(BLOB_URL, { width: 200 })).toEqual(BLOB_URL)
    })
    test('with support', () => {
      expect(fastlyImageUrl(BLOB_URL, { width: 200 }, { supportBlobs: true })).toEqual(`${BLOB_URL}?width=200`)
    })
  })

  describe('disable', () => {
    test('not disabled (default)', () => {
      expect(fastlyImageUrl(IMAGE_URL, { width: 200 })).toEqual(`${IMAGE_URL}?width=200`)
    })
    test('disabled', () => {
      expect(fastlyImageUrl(IMAGE_URL, { width: 200 }, { disable: true })).toEqual(IMAGE_URL)
    })
  })
})
