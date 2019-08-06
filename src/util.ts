interface ICompactObjectOptions {
  null: boolean
  undefined: boolean
  false: boolean
  emptyString: boolean
}

export const compact = (obj: { [key: string]: any }, options?: Partial<ICompactObjectOptions>) => {
  const _options: ICompactObjectOptions = {
    null: true,
    undefined: true,
    false: true,
    emptyString: true,
    ...options,
  }

  const newObj: { [key: string]: any } = {}

  Object.keys(obj).forEach(key => {
    const val = obj[key]
    if (_options.undefined && val === undefined) {
      return
    }
    if (_options.null && val === null) {
      return
    }
    if (_options.false && val === false) {
      return
    }
    if (_options.emptyString && val === '') {
      return
    }
    newObj[key] = val
  })

  return newObj
}
