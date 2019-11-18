import Slider from './slider.js'
import Authorize from './githubAuthorize.js'

let matrixSize = 1;
let instrument = 'pencil';
let colorPrev = localStorage.getItem('colorPrev') ||'#000';
let color = localStorage.getItem('color') ||'#008000';
const randomImageUrl = `https://api.unsplash.com/photos/random`;
const sizeSlider = new Slider();
const maxCanvasSize = 512;
let koff = 1;
let isImageLoaded = localStorage.getItem('isImageLoaded') || false;
let canvasSize = localStorage.getItem('canvasSize') || maxCanvasSize;
let inputRangeValue = localStorage.getItem('inputRangeValue') || sizeSlider.maxRealValue;
const auth = new Authorize();
const query = auth.parseQueryString(document.location.search.substring(1));
if(query.error) {
    alert('Error returned from authorization server: '+ query.error);
}
if(query.code)
    auth.getAccess_token(query.code);

window.onload = function() {

    const authorizationBtn = document.getElementById('authorization');
    authorizationBtn.innerHTML = 'Sign in';
    const smallMatrixChecker = document.getElementById('small');
    const largeMatrixChecker = document.getElementById('large');
    const defaultMatrixChecker = document.getElementById('default');
    const canvas = document.getElementById('work-canvas');

    const pencil = document.getElementById('pencil');
    const bucket = document.getElementById('bucket');
    const colorPicker = document.getElementById('color-picker');
    const grayscale = document.getElementById('grayscale');

    const blueColor = document.getElementById('blue');
    const redColor = document.getElementById('red');
    const currColor = document.getElementById('current-color');
    const prevColor = document.getElementById('prev-color');
    const inputColor = document.getElementById('input-color');
    const currColorContainer = document.getElementById('current-color-container');
    const loadImageButton = document.getElementById('load-image');
    currColor.style.backgroundColor = color;
    prevColor.style.backgroundColor = colorPrev;
    let lastX = 0;
    let lastY = 0;

    document.onkeydown = (e) => {
        if (e.ctrlKey && e.code === 'KeyB') {
            bucket.click();
        }
        if (e.ctrlKey && e.code === 'KeyP') {
            pencil.click();
        }
        if (e.ctrlKey && e.code === 'KeyC') {
            colorPicker.click();
        }
      };

    authorizationBtn.addEventListener('click', (e) => {
        
        const query = auth.parseQueryString(document.location.search.substring(1));
        if(query.error) {
            alert('Error returned from authorization server: '+ query.error);
        }
        if(!query.code)
            auth.signIn();
        else
            auth.signOut();
    });

    inputColor.addEventListener('change', (e) => {
        color = inputColor.value;
        prevColor.style.backgroundColor = currColor.style.backgroundColor;
        currColor.style.backgroundColor = color;
        localStorage.setItem('color', color);
        localStorage.setItem('colorPrev', prevColor.style.backgroundColor);
    });
    currColorContainer.addEventListener('click', () => {
        inputColor.click();
    });  
    prevColor.parentElement.addEventListener('click', () => {
        color = prevColor.style.backgroundColor;
        prevColor.style.backgroundColor = currColor.style.backgroundColor;
        currColor.style.backgroundColor = color;
        localStorage.setItem('color', color);
        localStorage.setItem('colorPrev', prevColor.style.backgroundColor);
    });
    blueColor.addEventListener('click', () => {
        color = '#0000ff';
        prevColor.style.backgroundColor = currColor.style.backgroundColor;
        currColor.style.backgroundColor = color;
        localStorage.setItem('color', color);
        localStorage.setItem('colorPrev', prevColor.style.backgroundColor)
    });
    redColor.addEventListener('click', () =>{
        color = '#ff0000';
        prevColor.style.backgroundColor = currColor.style.backgroundColor;
        currColor.style.backgroundColor = color;
        localStorage.setItem('color', color);
        localStorage.setItem('colorPrev', prevColor.style.backgroundColor)
    });

    pencil.addEventListener('click', () => {
        instrument = 'pencil';
        if(pencil.className.search('selected-button') >= 0) {
            pencil.className = pencil.className.replace(/selected-button/g, '');
        }
        else {
            pencil.className += ' selected-button';
            bucket.className = bucket.className.replace(/selected-button/g, '');
            colorPicker.className = colorPicker.className.replace(/selected-button/g, '');
            grayscale.className = grayscale.className.replace(/selected-button/g, '');
        }
    });
    bucket.addEventListener('click', () =>{
        instrument = 'bucket';
        if(bucket.className.search('selected-button') >= 0) {
            bucket.className = bucket.className.replace(/selected-button/g, '');
        }
        else {
            bucket.className += ' selected-button';
            pencil.className = pencil.className.replace(/selected-button/g, '');
            colorPicker.className = colorPicker.className.replace(/selected-button/g, '');
            grayscale.className = grayscale.className.replace(/selected-button/g, '');
        }
    });
    colorPicker.addEventListener('click', (e) =>{
        instrument = 'color-picker';
        if(colorPicker.className.search('selected-button') >= 0) {
            colorPicker.className = colorPicker.className.replace(/selected-button/g, '');
        }
        else {
            colorPicker.className += ' selected-button';
            pencil.className = pencil.className.replace(/selected-button/g, '');
            bucket.className = bucket.className.replace(/selected-button/g, '');
            grayscale.className = grayscale.className.replace(/selected-button/g, '');
        }
    });

    grayscale.addEventListener('click', () => {
        instrument = 'grayscale';
        if(grayscale.className.search('selected-button') >= 0) {
            grayscale.className = grayscale.className.replace(/selected-button/g, '');
        }
        else {
            grayscale.className += ' selected-button';
            pencil.className = pencil.className.replace(/selected-button/g, '');
            bucket.className = bucket.className.replace(/selected-button/g, '');
            colorPicker.className = colorPicker.className.replace(/selected-button/g, '');
        }
    });

    smallMatrixChecker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            smallMatrixChecker.checked = true;
            matrixSize = 4;
        }
    });
    largeMatrixChecker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            largeMatrixChecker.checked = true;
            matrixSize = 32;
        }
    });
    defaultMatrixChecker.parentElement.addEventListener('click', (e) => {
        if (e.returnValue) {
            defaultMatrixChecker.checked = true;
            matrixSize = 1;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if(!isDrawing) { return; }
        if(instrument === 'pencil') { 
            drawWithAlgorithm(lastX, lastY, e.offsetX, e.offsetY);
            lastX = e.offsetX;
            lastY = e.offsetY;
        }
    });
    canvas.addEventListener('mousedown', (e) => { 
        isDrawing = true; 
        lastX = e.offsetX;
        lastY = e.offsetY;
        if(instrument === 'bucket') { 
            fillCanvasZone(e);
        }
        if(instrument === 'pencil') { 
            const point = getRectStartPoint(new Point(e.offsetX, e.offsetY));
            draw(point);
            lastX = e.offsetX;
            lastY = e.offsetY;
        }

        
    });
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        setCanvasImageToLocalStorage(canvas);
    });
    this.document.body.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('click', (e) => {
        let ctx = canvas.getContext('2d');
        if(instrument === 'color-picker') {
            const newColor = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
            color = `rgba(${newColor[0]},${newColor[1]},${newColor[2]},${newColor[3]})`;
            prevColor.style.backgroundColor = currColor.style.backgroundColor;
            currColor.style.backgroundColor = color;
            localStorage.setItem('color', color);
            localStorage.setItem('colorPrev', prevColor.style.backgroundColor);
        }
        if(instrument === 'grayscale') {
            if(!isImageLoaded) {
                this.alert('Error! Please download image!');
                return;
            }
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (var i = 0; i < data.length; i += 4) {
                var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i]     = avg; 
                data[i + 1] = avg; 
                data[i + 2] = avg; 
            }
            ctx.putImageData(imageData, 0, 0);
            setCanvasImageToLocalStorage(canvas);
        }
    });

    
    if(localStorage.getItem('currentImage')) {
        setPictureToCanvas(localStorage.getItem('currentImage'));
    }
    else {
        setPictureToCanvas();
    }
    defaultMatrixChecker.checked = true;
    let isDrawing = false;
    pencil.click();
     loadImageButton.addEventListener('click', getRandomImage);
    sizeSlider.Init(inputRangeValue);
    canvasSize = sizeSlider.getValue();
    localStorage.getItem('canvasSize', canvasSize);
    sizeSlider.onChange(() => {
        localStorage.setItem('inputRangeValue', sizeSlider.getRealValue());
        canvasSize = sizeSlider.getValue();
        localStorage.setItem('canvasSize', canvasSize);
        koff = maxCanvasSize/canvasSize;
        setPictureToCanvas(localStorage.getItem('currentImage'));
    })
    if(localStorage.getItem('currentImage'))
        setPictureToCanvas(localStorage.getItem('currentImage'));
};

function draw(point) {
    const canvas = document.getElementById('work-canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(point.x, point.y, matrixSize, matrixSize );
}

function getRectStartPoint(point) {
    
    return new Point(Math.floor(point.x/koff/matrixSize)*matrixSize, Math.floor(point.y/koff/matrixSize)*matrixSize);
}

function fillCanvasZone(e){
    const canvas = document.getElementById('work-canvas');
    const ctx = canvas.getContext('2d');
    const startPoint = getRectStartPoint(new Point(e.offsetX, e.offsetY));
    ctx.width = sizeSlider.getValue();
    ctx.height = sizeSlider.getValue();
    ctx.fillStyle = color;
    const sumColor = ctx.getImageData(startPoint.x, startPoint.y, 1, 1).data.reduce((x,y,i) => x + y*(i+1), 0);
    const queue = [startPoint];
    const usedPoint =  new Set();
    while(queue.length > 0) {
        let point = queue.shift();
        if(usedPoint.has(point.toString())) { 
            continue;
        }
        usedPoint.add(point.toString());
        if(point.x < 0 || point.x > ctx.width || point.y < 0 || point.y > ctx.width) {
            continue;
        }
        let newSumColor = ctx.getImageData(point.x, point.y, 1, 1).data.reduce((x,y,i) => x + y*(i+1), 0);
        if(newSumColor !== sumColor) {
            continue;
        }
        ctx.fillRect(point.x, point.y, matrixSize, matrixSize);
        queue.push(new Point(point.x - matrixSize, point.y));
        queue.push(new Point(point.x, point.y - matrixSize));
        queue.push(new Point(point.x + matrixSize, point.y));
        queue.push(new Point(point.x, point.y + matrixSize));
    }
  }

function drawWithAlgorithm(x1, y1, x2, y2) {
    const point1 = getRectStartPoint(new Point(x1, y1));
    const point2 = getRectStartPoint(new Point(x2, y2));
    const deltaX = Math.abs(point2.x - point1.x);
    const deltaY = Math.abs(point2.y - point1.y);
    const signX = point1.x < point2.x ? matrixSize : -matrixSize;
    const signY = point1.y < point2.y ? matrixSize : -matrixSize;
    let error = deltaX - deltaY;
    draw(point2);
    while(point1.x != point2.x || point1.y != point2.y) {
        draw(point1);
        let error2 = error * 2;
        if(error2 > -deltaY) {
            error -= deltaY;
            point1.x += signX;
        }
        if(error2 < deltaX) {
            error += deltaX;
            point1.y += signY;
        }
    }
}

function setPictureToCanvas(imgUrl)
{
    const canvas = document.getElementById('work-canvas')
    imgUrl = imgUrl;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'annonymous';
    image.src = imgUrl;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    image.onload = () => { 
        const xPosition = maxCanvasSize - image.width === 0 ? 0 : Math.floor(Math.abs(maxCanvasSize - image.width)/2);
        const yPosition = maxCanvasSize - image.height === 0 ? 0 : Math.floor(Math.abs(maxCanvasSize - image.height)/2);
        const pixelSize = maxCanvasSize/canvasSize;
        const heightProp = image.height/ maxCanvasSize;
        const widthProp = image.width/ maxCanvasSize;
        if(image.width <= maxCanvasSize && image.height <= maxCanvasSize)
            ctx.drawImage(image, xPosition/pixelSize, yPosition/pixelSize, widthProp*canvasSize, heightProp*canvasSize)
        else if(image.width > maxCanvasSize)
            ctx.drawImage(image, 0, yPosition/pixelSize, canvasSize, heightProp*canvasSize)
        else if(image.height > maxCanvasSize)
            ctx.drawImage(image, xPosition/pixelSize, 0, widthProp*canvasSize, canvasSize)
        else 
            ctx.drawImage(image, 0, 0, canvasSize, canvasSize)
    };
} 

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString(){
        return `${this.x} ${this.y}`;
    }
}

async function getRandomImage(event)
{
    const canvas = document.getElementById('work-canvas');
    const searchLine = document.getElementById('search-input');
    const queryString = `?query=town,${searchLine.value === '' ? 'Copenhagen' : searchLine.value}&client_id=90bd65afe3864739c33072768bf7c9d1ad8ce7cd908cc12681abf5986f4c80b8`;
    try {
        const response = await fetch(randomImageUrl+queryString);
        const data = await response.json();
        setPictureToCanvas(data.urls.small);
        isImageLoaded = true;
        localStorage.setItem('isImageLoaded', isImageLoaded);
        localStorage.setItem('currentImage', data.urls.small);
    } catch(error) {
        alert(error);
    }
 }

function setCanvasImageToLocalStorage(canvas) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 512;
    tempCanvas.height = 512;
    const ctx = tempCanvas.getContext('2d');
    const image = new Image();
    image.src = canvas.toDataURL();
    image.onload = () => {
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        tempCanvas.style.imageRendering = 'pixelated';
        ctx.drawImage(image, 0,0, tempCanvas.width, tempCanvas.height)
        localStorage.setItem('currentImage', tempCanvas.toDataURL());
    }
}

