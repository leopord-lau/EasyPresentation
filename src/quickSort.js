function quickSort(array, left, right) {
  let index;

  if(array.length > 1) {
    index = split(array, left, right);
    if(left < index - 1) {
      quickSort(array, left, index - 1);
    }
    if(index < right) {
      quickSort(array, index, right);
    }
  }
  return array;
}

function split(array, left, right) {
  let mid = array[(left + right) >> 1];
  while(left <= right) {
    while(array[left] < mid) {
      left++;
    }
    while(array[right] > mid) {
      right--;
    }
    if(left <= right) {
      swap(array, left, right);
      left++;
      right--;
    }
  }
  return left;
}

function swap(array, left, right) {
  let temp = array[right];
  array[right] = array[left];
  array[left] = temp;
}