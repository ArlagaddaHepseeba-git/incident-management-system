function validateRCA(rca) {
  if (!rca) return false
  if (!rca.rootCause) return false
  if (!rca.fixApplied) return false
  if (!rca.preventionSteps) return false
  return true
}

test('RCA is valid when all fields are filled', () => {
  const rca = {
    rootCause: 'Hardware Failure',
    fixApplied: 'Replaced disk',
    preventionSteps: 'Add monitoring'
  }
  expect(validateRCA(rca)).toBe(true)
})

test('RCA is invalid when rootCause is missing', () => {
  const rca = {
    fixApplied: 'Replaced disk',
    preventionSteps: 'Add monitoring'
  }
  expect(validateRCA(rca)).toBe(false)
})

test('RCA is invalid when rca is null', () => {
  expect(validateRCA(null)).toBe(false)
})
