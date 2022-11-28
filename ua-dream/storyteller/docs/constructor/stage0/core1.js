const canvas = document.getElementById("cw");
const ctx = canvas.getContext("2d");

var x = 150;//250;//#1
var y = 100;//200;//#1

let radius = 80;//200;//#2
let color = 'white';//'green'//#3

ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2, true);
ctx.closePath();
ctx.fillStyle = color;
ctx.fill();