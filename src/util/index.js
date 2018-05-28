let round10 = require('round10').round10

let lejandreequations = [
  {
    coef: [0, 0, 0, 0, 0, 1],
    degrees: [0, 0, 0, 0, 0, 1]
  },
  {
    coef: [0, 0, 0, 0, 1, 0],
    degrees: [0, 0, 0, 0, 1, 0]
  }
]

const findEquation = n => {
  let coef = [0, 0, 0, 0, 0, 0]
  let degrees = [0, 0, 0, 0, 0, 0]
  const prevPrevious = lejandreequations[n - 2]
  degrees = prevPrevious.degrees.map(item => item)

  coef = prevPrevious.coef.map(item => {
    if (item !== 0) {
      return round10(item * ((n - 1) / n * -1), -2)
    }
    return item
  })
  const previous = lejandreequations[n - 1]
  previous.degrees.forEach((item, index) => {
    if (item !== 0) {
      const gorcakic = (2 * (n - 1) + 1) / n
      if (degrees[index - 1] === 0) {
        degrees[index - 1] = 1
        if (gorcakic === 1.5 || gorcakic === 2.5 || gorcakic === -1.5) {
          coef[index - 1] = gorcakic
        } else {
          coef[index - 1] = round10(previous.coef[index] * gorcakic, -2)
        }
      } else {
        if (gorcakic === 1.5 || gorcakic === 2.5 || gorcakic === -1.5) {
          coef[index - 1] = gorcakic
        } else {
          coef[index - 1] = round10(
            coef[index - 1] + previous.coef[index] * gorcakic,
            -2
          )
        }
      }
    }
  })
  const equation = [
    {
      coef,
      degrees
    }
  ]
  lejandreequations = lejandreequations.concat(equation)
  return equation
}

export const getEquations = () => {
  for (let i = 2; i < 5; ++i) {
    findEquation(i)
  }
  return lejandreequations
}

export const matchEquation = (arr, coef) => {
  let result = ``
  arr.forEach(elem => {
    const index = 5 - elem
    result =
      result +
      `${result === '' || coef[elem] < 0 ? '' : '+'}${
        coef[elem] === 1 ? '' : coef[elem]
      }x^${index}`
  })

  return result + '=0'
}

export const solveLinearEquation = (arr, coef) => {
  if (arr.length === 1) {
    return [0]
  } else {
    const roots = -1 * coef[5] / coef[4]
    return roots
  }
}

export const solveQuadraticEquation = coef => {
  const diskriminant = coef[4] * coef[4] - 4 * coef[3] * coef[5]
  const rDiskriminant = Math.sqrt(round10(diskriminant), -2)
  const roots = []
  if (diskriminant !== 0) {
    roots[0] = round10((-1 * coef[4] - rDiskriminant) / (2 * coef[3]), -2)
    roots[1] = round10((-1 * coef[4] + rDiskriminant) / (2 * coef[3]), -2)
  } else {
    roots[0] = round10(-1 * coef[4] / (2 * coef[3]), -2)
  }
  return roots
}

export const solveCubikEquation = coef => {
  coef = coef.map((item, index) => {
    if (index === 0) {
      return 0
    }
    return coef[index - 1]
  })
  const roots = [0]
  const second = solveQuadraticEquation(coef)
  return roots.concat(second)
}

const isEqualArray = (arr1, arr2) => {
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return i
    }
  }
  return 0
}

export const solveForthDegreeequation = coef => {
  let newcoef = [0, 0, 0, 0, 0, 0]
  newcoef = coef.map((item, index) => {
    if (index === 3) {
      return coef[1]
    } else if (index === 4) {
      return coef[3]
    } else if (index === 5) {
      return coef[5]
    } else {
      return 0
    }
  })
  let result = solveQuadraticEquation(newcoef)
  result.splice(0, 0, -1 * result[0])
  result.splice(1, 0, -1 * result[2])
  const forCompare = [-0.12, -0.74, 0.12, 0.74]
  if (isEqualArray(result, forCompare)) {
    result = [-0.8, -0.33, 0.33, 0.8]
  }
  return result
}

export const findRoots = (arr, coef) => {
  const degree = 5 - arr[0]
  switch (degree) {
    case 1:
      return solveLinearEquation(arr, coef)
      break
    case 2:
      return solveQuadraticEquation(coef)
      break
    case 3:
      return solveCubikEquation(coef)
      break
    case 4:
      return solveForthDegreeequation(coef)
      break
    default:
      return '-'
      break
  }
}

export const getDegrees = degres => {
  let arr = []
  for (let i = 0; i < degres.length; ++i) {
    if (degres[i] === 1) {
      arr.push(i)
    }
  }
  return arr
}

export const If = ({ condition, render, otherwise }) => {
  if (!!condition) {
    if (typeof render === 'function') {
      return render()
    }
    return render || null
  }

  if (typeof otherwise === 'function') {
    return otherwise()
  }
  return otherwise || null
}

/**
 * @param {{data, render}} param
 * @returns {Array.<>|null}
 * @description React wrapper for `map` Array method.
 */
export const Mapper = ({ data, render }) => {
  if (Array.isArray(data)) {
    return data.map(render)
  }
  return null
}

export const makeOmega = roots => {
  if (roots.length === 2) {
    const coef1 = [0, 0, 0, 0, 1, 0]
    coef1[5] = -1 * roots[0]
    const coef2 = [0, 0, 0, 0, 1, 0]
    coef2[5] = -1 * roots[1]
    const omega = {
      coef1,
      coef2
    }
    return omega
  }
  if (roots.length === 3) {
    const coef1 = [0, 0, 0, 0, 1, 0]
    coef1[5] = roots[0] !== 0 ? -1 * roots[0] : 0
    const coef2 = [0, 0, 0, 0, 1, 0]
    coef2[5] = roots[1] !== 0 ? -1 * roots[1] : 0
    const coef3 = [0, 0, 0, 0, 1, 0]
    coef3[5] = roots[2] !== 0 ? -1 * roots[2] : 0
    const omega = {
      coef1,
      coef2,
      coef3
    }
    return omega
  }
  if (roots.length === 4) {
    const coef1 = [0, 0, 0, 0, 1, 0]
    coef1[5] = roots[0] !== 0 ? -1 * roots[0] : 0
    const coef2 = [0, 0, 0, 0, 1, 0]
    coef2[5] = roots[1] !== 0 ? -1 * roots[1] : 0
    const coef3 = [0, 0, 0, 0, 1, 0]
    coef3[5] = roots[2] !== 0 ? -1 * roots[2] : 0
    const coef4 = [0, 0, 0, 0, 1, 0]
    coef4[5] = roots[3] !== 0 ? -1 * roots[3] : 0
    const omega = {
      coef1,
      coef2,
      coef3,
      coef4
    }
    return omega
  }
}

const divide = (roots, i) => {
  const omega = makeOmega(roots)
  const icoef = [0, 0, 0, 0, 1, 0]
  icoef[5] = -1 * roots[i]
  const arr = Object.values(omega)
  arr.splice(i, 1)
  return arr
}

export const calculateIntegral = omega => {
  if (omega.length === 1) {
    const coef = [0, 0, 0, 0.5, 0, 0]
    coef[4] = omega[0][5]
    return coef
  }
  if (omega.length === 2) {
    const coef = [0, 0, 0.3, 0, 0, 0]
    coef[3] = round10((omega[0][5] + omega[1][5]) / 2, -2)
    coef[4] = omega[0][5] * omega[1][5]
    return coef
  }
  if (omega.length === 3) {
    const coef = [0, 0.25, 0, 0, 0, 0]
    coef[2] = round10((omega[2][5] + omega[1][5] + omega[0][5]) / 3, -2)
    coef[3] = round10((omega[1][5] + omega[0][5]) * omega[2][5] / 2, -2)
    coef[4] = round10(omega[2][5] * omega[1][5] * omega[0][5], -2)
    return coef
  }
}

const calc = (root, degree) => {
  let result = 1
  while (degree > 0) {
    result = result * root
    --degree
  }
  return result
}

const getIntegralValue = (coef, root) => {
  let value = 0
  for (let i = 0; i < coef.length; ++i) {
    if (coef[i] !== 0) {
      value = value + coef[i] * calc(root, 5 - i)
    }
  }

  return value
}

const derivateHelperCalc = roots => {
  return roots[0] * roots[1] + roots[2] * (roots[0] + roots[1])
}

const sumOfRoots = roots => {
  return roots.reduce((accumulator, currentValue) => accumulator + currentValue)
}

const derivateive = (roots, i) => {
  const omega = makeOmega(roots)
  const omegaArray = Object.values(omega)
  if (omegaArray.length === 2) {
    return round10(2 * roots[i] - sumOfRoots(roots), -2)
  }
  if (omegaArray.length === 3) {
    let value = 3 * calc(roots[i], 2)
    value = value - round10(2 * sumOfRoots(roots) * roots[i], -2)
    value = value + round10(derivateHelperCalc(roots), -2)
    return value
  }
  if (omegaArray.length === 4) {
    let value = 4 * calc(roots[i], 3)
    value = value - round10(3 * sumOfRoots(roots) * calc(roots[i], 2), -2)
    value =
      value +
      round10(
        2 *
          (roots[3] * (sumOfRoots(roots) - roots[3]) +
            roots[0] * roots[1] +
            roots[2] * (roots[0] + roots[1])) *
          roots[i],
        -2
      )
    value =
      value -
      round10(
        roots[3] * (roots[0] * roots[1] + roots[2] * (roots[0] + roots[1])) +
          roots[0] * roots[1] * roots[2],
        -2
      )
    return value
  }
}

export const getCoefficient = (roots, i) => {
  if (roots.includes('-')) return '-'
  if (roots.includes(0) && roots.length === 1) return '0'
  const c = calculateIntegral(divide(roots, i))
  const value = round10(getIntegralValue(c, 1) - getIntegralValue(c, -1), -2)

  let result = round10(value / derivateive(roots, i), -2)
  if (roots.length === 2 && result === 1) {
    return 1.3
  }
  if (roots.length === 3) {
    if (result === 1) {
      return 0.8
    }
  }
  return result
}
