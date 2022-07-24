function upperBound (list: Array<any>, left: number, x: number): number {
  let l = left;
  let h = list.length - 1;
  while (l < h) {
    const mid = Math.floor((l + h + 1) / 2);
    if (list[mid] <= x) {
      l = mid;
    } else {
      h = mid - 1;
    }
  }

  return h + 1;
}

export class Profile {
  times: Array<number> = new Array<number>();
  values: Array<number> = new Array<number>();

  seekIndex = 0;

  resetSeek () {
    this.seekIndex = 0;
  }

  seekForward (time: number): number {
    if (!this.times.length) {
      return 0;
    }

    if (time <= this.times[0] || time >= this.times[this.times.length - 1]) {
      return 0;
    }

    let i = this.seekIndex + 1;
    for (; i < this.times.length; i++) {
      if (this.times[i] >= time) {
        break;
      }
    }

    if (i >= this.times.length - 1) {
      this.seekIndex = this.times.length;
      return 0;
    } else {
      this.seekIndex = i - 1;
      return this.interpolation(this.seekIndex, time);
    }
  }

  private interpolation (index: number, time: number): number {
    const percentage = (time - this.times[index]) / (this.times[index + 1] - this.times[index]);
    return this.values[index] + percentage * (this.values[index + 1] - this.values[index]);
  }

  addPoint (time: number, value: number): void {
    if (this.times.length === 0) {
      this.times.push(time);
      this.values.push(value);
      return;
    }

    if (time < this.times[0]) {
      this.times.unshift(time);
      this.values.unshift(value);
      return;
    }

    const index = upperBound(this.times, 0, time);
    if (index >= this.times.length) {
      this.times.push(time);
      this.values.push(value);
    } else {
      this.times.splice(index, 0, time);
      this.values.splice(index, 0, value);
    }
  }

  addPoints (paires: Array<[number, number]>) {
    for (const point of paires) {
      this.addPoint(point[0], point[1]);
    }
  }
}
