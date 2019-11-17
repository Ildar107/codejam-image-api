

export default class Slider {
    constructor() {
        this.value = 0;
        this.rangeSlider = document.getElementById("rs-range-line");
        this.rangeBullet = document.getElementById("rs-bullet");
        this.rangeBulletValue = document.getElementById("rs-bullet-value");
    }

    Init() {
        const values = [32, 64,128, 256, 512];  
        this.rangeSlider.addEventListener("input", () => {
            this.rangeBulletValue.innerHTML = values[this.rangeSlider.value];
            this.value = values[this.rangeSlider.value];
            let bulletPosition = (this.rangeSlider.value /this.rangeSlider.max);
            this.rangeBullet.style.left = (bulletPosition * 490) + "px";
        })
    }

    getValue = () => this.value;

    onChange = (func) => {
        this.rangeSlider.addEventListener('input', func);
        return this;
    }
}

