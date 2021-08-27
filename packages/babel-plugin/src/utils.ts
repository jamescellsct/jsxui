export function filterDuplicates(collection, getTestValue = (value) => value) {
  return collection.filter((attribute, index) => {
    let duplicateIndex = -1
    collection.forEach((possibleDuplicate, index) => {
      if (getTestValue(possibleDuplicate) === getTestValue(attribute)) {
        duplicateIndex = index
      }
    })
    return duplicateIndex > -1 ? duplicateIndex === index : true
  })
}
