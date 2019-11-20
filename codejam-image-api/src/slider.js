
export default class Slider {
  constructor() {
    this.values = [32, 64, 128, 256, 512];
    this.rangeSlider = document.getElementById('rs-range-line');
    this.rangeBullet = document.getElementById('rs-bullet');
    this.rangeBulletValue = document.getElementById('rs-bullet-value');
    this.maxRealValue = this.rangeSlider.max;
  }

  Init(value) {
    this.rangeSlider.value = value;
    this.value = this.values[this.rangeSlider.value];
    this.setBulletPosition();
    this.rangeSlider.addEventListener('input', () => {
      this.value = this.values[this.rangeSlider.value];
      this.setBulletPosition();
    });
  }

  setBulletPosition() {
    this.rangeBulletValue.innerHTML = this.values[this.rangeSlider.value];
    const bulletPosition = (this.rangeSlider.value / this.rangeSlider.max);
    this.rangeBullet.style.left = `${bulletPosition * 490}px`;
  }

  getValue() {
    return this.value;
  }

  getRealValue() {
    return this.rangeSlider.value;
  }

  onChange(func) {
    this.rangeSlider.addEventListener('input', func);
    return this;
  }
}
