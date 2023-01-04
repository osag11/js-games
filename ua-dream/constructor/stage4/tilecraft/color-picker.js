// https://codepen.io/pizza3/pen/BVzYNP
// pickerModel:
var colorBlock = document.getElementById('color-block');
var ctxColor = colorBlock.getContext('2d', { willReadFrequently: true });

var colorStrip = document.getElementById('color-strip');
var ctxColorStrip = colorStrip.getContext('2d', { willReadFrequently: true });

var colorLabel = document.getElementById('color-label');

let pickerModel = {
    x: 0,
    y: 0,
    drag: false,
    rgbaColor: 'rgba(0,255,0,1)'
}

function initPicker() {
    ctxColor.rect(0, 0, colorBlock.width, colorBlock.height);
    fillGradient();

    ctxColorStrip.rect(0, 0, colorStrip.width, colorStrip.height);
    var grd1 = ctxColorStrip.createLinearGradient(0, 0, 0, colorBlock.height);
    grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
    grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
    ctxColorStrip.fillStyle = grd1;
    ctxColorStrip.fill();
}

// ---------------------------- added by cerginio -------------------------------

function injectColor(color) {
    pickerModel.rgbaColor = color;
    colorLabel.style.backgroundColor = pickerModel.rgbaColor;
    fillGradient();
}

const contrastColor = c => ["black", "white"][~~([1, 3, 5].map(p => parseInt(c.substr(p, 2), 16)).reduce((r, v, i) => [.299, .587, .114][i] * v + r, 0) < 128)];

function alfaChannel(transparency) {
    if (transparency && transparency < 255)
        return (transparency + 0x10000).toString(16).substr(-2).toUpperCase();
    else
        return null;
}

function rgba2hex(orig) {
    var a, isPercent,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

    // if (alpha !== "") {
    //     a = alpha;
    // } else {
    //     a = 01;
    // }
    // // multiply before convert to HEX
    // a = ((a * 255) | 1 << 8).toString(16).slice(1)
    // hex = hex + a;
    if (rgb)
        return '#' + hex;
    else
        return orig;
}    

let colors = new Map();

const colorByName = (name)=>{ 
    if(colors.size ==0){
        const names =  getColorArr("names");
        const hex =  getColorArr("hexs");

        for(let i=0;i<names.length;i++)
        {
            colors.set(names[i].toLowerCase(),hex[i]);
        }
    }
    return colors.get(name.toLowerCase());
}

function getColorArr(x) {
    if (x == "names") {return ['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen']; }
    if (x == "hexs") {return ['f0f8ff','faebd7','00ffff','7fffd4','f0ffff','f5f5dc','ffe4c4','000000','ffebcd','0000ff','8a2be2','a52a2a','deb887','5f9ea0','7fff00','d2691e','ff7f50','6495ed','fff8dc','dc143c','00ffff','00008b','008b8b','b8860b','a9a9a9','a9a9a9','006400','bdb76b','8b008b','556b2f','ff8c00','9932cc','8b0000','e9967a','8fbc8f','483d8b','2f4f4f','2f4f4f','00ced1','9400d3','ff1493','00bfff','696969','696969','1e90ff','b22222','fffaf0','228b22','ff00ff','dcdcdc','f8f8ff','ffd700','daa520','808080','808080','008000','adff2f','f0fff0','ff69b4','cd5c5c','4b0082','fffff0','f0e68c','e6e6fa','fff0f5','7cfc00','fffacd','add8e6','f08080','e0ffff','fafad2','d3d3d3','d3d3d3','90ee90','ffb6c1','ffa07a','20b2aa','87cefa','778899','778899','b0c4de','ffffe0','00ff00','32cd32','faf0e6','ff00ff','800000','66cdaa','0000cd','ba55d3','9370db','3cb371','7b68ee','00fa9a','48d1cc','c71585','191970','f5fffa','ffe4e1','ffe4b5','ffdead','000080','fdf5e6','808000','6b8e23','ffa500','ff4500','da70d6','eee8aa','98fb98','afeeee','db7093','ffefd5','ffdab9','cd853f','ffc0cb','dda0dd','b0e0e6','800080','663399','ff0000','bc8f8f','4169e1','8b4513','fa8072','f4a460','2e8b57','fff5ee','a0522d','c0c0c0','87ceeb','6a5acd','708090','708090','fffafa','00ff7f','4682b4','d2b48c','008080','d8bfd8','ff6347','40e0d0','ee82ee','f5deb3','ffffff','f5f5f5','ffff00','9acd32']; }
  }

// --------------------------------------------------------------------------

function click(e) {
    pickerModel.x = e.offsetX;
    pickerModel.y = e.offsetY;
    var imageData = ctxColorStrip.getImageData(pickerModel.x, pickerModel.y, 1, 1).data;
    pickerModel.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    randomColorState(false);
    fillGradient();
}

function fillGradient() {
    ctxColor.fillStyle = pickerModel.rgbaColor;
    ctxColor.fillRect(0, 0, colorBlock.width, colorBlock.height);

    var grdWhite = ctxColorStrip.createLinearGradient(0, 0, colorBlock.width, 0);
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctxColor.fillStyle = grdWhite;
    ctxColor.fillRect(0, 0, colorBlock.width, colorBlock.height);

    var grdBlack = ctxColorStrip.createLinearGradient(0, 0, 0, colorBlock.height);
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
    ctxColor.fillStyle = grdBlack;
    ctxColor.fillRect(0, 0, colorBlock.width, colorBlock.height);
}

function mousedown(e) {
    pickerModel.drag = true;
    changeColor(e);
}

function mousemove(e) {
    if (pickerModel.drag) {
        changeColor(e);
    }
}

function mouseup(e) {
    pickerModel.drag = false;
}

function changeColor(e) {
    pickerModel.x = e.offsetX;
    pickerModel.y = e.offsetY;
    var imageData = ctxColor.getImageData(pickerModel.x, pickerModel.y, 1, 1).data;
    pickerModel.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    colorLabel.style.backgroundColor = pickerModel.rgbaColor;

    // turn off random color addon
    randomColorState(false);
}

colorStrip.addEventListener("click", click, false);
colorBlock.addEventListener("mousedown", mousedown, false);
colorBlock.addEventListener("mouseup", mouseup, false);
colorBlock.addEventListener("mousemove", mousemove, false);

initPicker();