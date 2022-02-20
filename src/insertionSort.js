function insertionSort(array) {
  const length = array.length;
  let prevIndex, current;
  // 从索引1开始
  for(let i = 1; i < length; i++) {
    prevIndex = i - 1;
    current = array[i];
    // 当前的值比前一个小
    while(prevIndex >= 0 && array[prevIndex] > current) {
      array[prevIndex + 1] = array[prevIndex];
      prevIndex--;
    }
    array[prevIndex + 1] = current;
  }
  return array;
}