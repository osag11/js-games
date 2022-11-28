
Investigate:
1. Open task.MD in preview mode using VSCode feature. Read this text there.
1. Start chrome browser and paste the path of game.html file.
1. Uncomment #1, #2, etc, replace, save and restart page in browser. 
Observe and try to understand difference in behavior.
Try to explain why.
1. In html file uncomment script with code2.js (lines marked #4)
1. In html file comment out script with code1.js (lines marked #5). Fix problem with undefined variable ctx.
1. clone file game.html with new name game2.html and connect only code1.js. Open it on new Tab in browser. What will happen on both pages if you will change code in code1.js?
1. Open Chrome browser dev console (key F12), go to console tab. Paste radius=500 and then color='orange'. Then refresh the page, what was happen?
1. call function drawCircle(...) from Dev console with your own parameters a few times. 
1. Enter `x+=10; drawCircle(x, y,radius, color);` to Dev console a few times.
1. Type `console.log(x)` to know about current x value. And then `console.log(`${x}, ${y}, ${radius}`)` to know current values of variables.


Implement:
1. Change canvas height equal to this width.
1. Change circle color to yellow
1. Change circle size to 80px
1. Draw second ball of blue color. Move on top of the first to ovelap them. What will happen if switch order of drawing ball #1 and #2?
1. Draw 3 circles from the same center to get an image of target for shooting
1. Draw red rectangle (see https://www.w3schools.com/tags/canvas_rect.asp)


Topics to learn:
1. javascript keywords
1. Comments in js and html. What happening with commented out code or html markup?
1. html file structure: html, head, body, canvas tags
1. `script` tag, `src` attribute
1. Connection of `.js` files to `.html`
1. canvas and drawing with `2d` context 
1. Key words `let`, `var`, `const` in javascript
1. `2dcontext.arc()` function

Advanced topics:
1. Learn about `.css` and styles
1. Names of colors in javascript, how many of them exist?
1. brackets and quotes using in js
1. What does `` quotes with string? Is there a differnce between "" and ''?


Answer the questions:
1. what is difference between code in code1.js and code2.js? Do they give the same result?
1. what is the benefit of using `function` comapring to plain code?
1. What does `;` in javascript? Is it possible to type all js code in 1 line? Ready to try?
1. What kind of brackets using in coding and what for?

CBT:
1. What names of files do would you like to use for your code? 
1. What code structure do you like more in `code1.js` or `code2.js`? Why?
1. Do you like how simple is html page to develop?
1. What you would like to improve or add?
1. Do you like Dev console possibilities?
1. What canvas color do you like more `black` or `white`? What do you feel about other colors?
1. If you would have unlimited number of usages of function `drawCircle` what would you draw? Are you ready to try find the limits? Use `code2.js` for experiment.
1. What ideas came to your mind could be implemented?
