import { setArray } from "../reducers/array";
import { setCurrentHeapThree } from "../reducers/heapSort";
import { setCurrentSwappers } from "../reducers/swappers";
import { setCurrentSorted } from "../reducers/sorted";
import { setRunning } from "../reducers/running";

function selectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
  }
  return array;
}

function siftDown(array, start, end, toDispatch) {
  if (start >= Math.floor(end / 2)) {
    return;
  }
  let left = start * 2 + 1,
      right = start * 2 + 2 < end ? start * 2 + 2 : null,
      swap;
  if (right) {
    toDispatch.push([start, left, right]);
    swap = array[left] > array[right] ? left : right;
  } else {
    toDispatch.push([start, left]);
    swap = left;
  }
  if (array[start] < array[swap]) {
    let temp = array[swap];
    array[swap] = array[start];
    array[start] = temp;
    toDispatch.push([start, swap, true]);
    toDispatch.push(array.slice(0));
    toDispatch.push([]);
    siftDown(array, swap, end, toDispatch);
  }
}

function handleDispatch(toDispatch, dispatch, array, speed) {
  if (!toDispatch.length) {
    dispatch(setCurrentHeapThree(array.map((num, index) => index)));
    setTimeout(() => {
      dispatch(setCurrentHeapThree([]));
      dispatch(setRunning(false));
    }, 900);
    return;
  }
  let dispatchFunction = toDispatch[0].length > 3 ?
      setArray : toDispatch[0].length === 3 && typeof toDispatch[0][2] === "boolean" || !toDispatch[0].length ?
        setCurrentSwappers : toDispatch[0].length === 2 && typeof toDispatch[0][0] === "boolean" ?
          setCurrentSorted : setCurrentHeapThree;
  dispatch(dispatchFunction(toDispatch.shift()));
  setTimeout(() => {
    handleDispatch(toDispatch, dispatch, array, speed);
  }, speed);
}

export default heapSort;
