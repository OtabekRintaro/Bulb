// Independant variables
let blackSquares = generateArray(7);// location: *; purpose: saves the location of the black squares and their numbers
let bulbs = generateArray(7);
let isGame =  true; // location: *; purpose: tells if the game is going
let interval; //location: script.js/run; purpose: saving the interval variable of the clock, so that we can clear it and stop the time
let min = 0; let sec = 0;
let time; // location: timer; purpose: string representation of time
let allBsCount = 0; // location: timer; purpose: telling if there are any bulbs on the map, so that we won't check the map when it's unnecessary 
let username = "";

// Generating matrix array of the given size
function generateArray(size)
{
  let temp = new Array(size);
  for(let i = 0; i < size; i++)
  {
    temp[i] = new Array(size);
    for(let j = 0; j < size; j++)
    {
      temp[i][j] = -1;
    }
  }
  return temp;
}

// Delegate function
function delegate(parent, child, when, what){
    function eventHandlerFunction(event){
        let eventTarget  = event.target;
        let eventHandler = this;
        let closestChild = eventTarget.closest(child);
  
        if(eventHandler.contains(closestChild)){
            what(event, closestChild);
        }
    } 

    parent.addEventListener(when, eventHandlerFunction);
}

//Time changer
function timer()
{
    if(isGame)
    {  
        sec++;
        if(sec == 60)
        {
            sec = 0;
            min++;
        }
        time = `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
        document.getElementById('timer').innerHTML = time;
        if(allBsCount) check();
    }
    else
    {
        clearInterval(interval);
    }
}

// Prepares level
function level(n)
{
  if(n == 7)
  {
    blackSquares[0][3] = 1;
    blackSquares[1][1] = 0;
    blackSquares[1][5] = 2;
    blackSquares[3][0] = 4;
    blackSquares[3][3] = 4;
    blackSquares[3][6] = 4;
    blackSquares[5][1] = 4;
    blackSquares[5][5] = 2;
    blackSquares[6][3] = 3;
  }
  
}

//lighting up different directions of the lamp
function lightRight(elem, tds, j)
{
    if(j < tds.length)
    {
        if(tds[j].classList.contains('wall'))
        {
            return;
        }
        else{
            if(!tds[j].classList.contains('lightcell'))
            {
                tds[j].classList.add('lightcell');
            }
            tds[j].dataset.bulbs++;
            if(tds[j].classList.contains('taken') && tds[j] != elem)
            {
                if(!elem.classList.contains('illuminated')) 
                {
                    elem.classList.add('illuminated');
                    elem.classList.remove('lightcell');
                }
                if(!tds[j].classList.contains('illuminated'))
                {
                    tds[j].classList.add('illuminated');
                    tds[j].classList.remove('lightcell');
                } 
            }
        }
        setTimeout(function() {lightRight(elem, tds, parseInt(j)+1)}, 140);
    }
}
function lightLeft(elem, tds, j)
{
    if(j >= 0)
    {
        if(tds[j].classList.contains('wall'))
        {
        return;
        }
        else{
        if(!tds[j].classList.contains('lightcell'))
        {
            tds[j].classList += ' lightcell';
        }
        tds[j].dataset.bulbs++;
        if(tds[j].classList.contains('taken') && tds[j] != elem)
        {
            if(!elem.classList.contains('illuminated')) 
            {
                elem.classList.add('illuminated');
                elem.classList.remove('lightcell');
            }
            if(!tds[j].classList.contains('illuminated'))
            {
                tds[j].classList.add('illuminated');
                tds[j].classList.remove('lightcell');
            } 
        }
        }
        setTimeout(function() {lightLeft(elem, tds, parseInt(j)-1)}, 140);
    }
}
function lightTop(elem, trs, j)
{
    if(j >= 0)
    {
        if(trs[j].children[elem.dataset.col].classList.contains('wall'))
        {
            return
        }
        else{
            if(!trs[j].children[elem.dataset.col].classList.contains('lightcell'))
            {
                trs[j].children[elem.dataset.col].classList.add('lightcell');
            }
            trs[j].children[elem.dataset.col].dataset.bulbs++;
            if(trs[j].children[elem.dataset.col].classList.contains('taken') && trs[j].children[elem.dataset.col] != elem)
            {
                if(!elem.classList.contains('illuminated')) 
                {
                    elem.classList.add('illuminated');
                    elem.classList.remove('lightcell');
                }
                if(!trs[j].children[elem.dataset.col].classList.contains('illuminated'))
                {
                    trs[j].children[elem.dataset.col].classList.add('illuminated');
                    trs[j].children[elem.dataset.col].classList.remove('lightcell');
                } 
            }
        }
        setTimeout(function() {lightTop(elem, trs, parseInt(j)-1)}, 140);
    }
}
function lightBottom(elem, trs, j)
{
    if(j < trs.length)
    {
        if(trs[j].children[elem.dataset.col].classList.contains('wall'))
        {
            return
        }
        else{
            if(!trs[j].children[elem.dataset.col].classList.contains('lightcell'))
            {
                trs[j].children[elem.dataset.col].classList += ' lightcell';
            }
            trs[j].children[elem.dataset.col].dataset.bulbs++;
            if(trs[j].children[elem.dataset.col].classList.contains('taken') && trs[j].children[elem.dataset.col] != elem)
            {
                if(!elem.classList.contains('illuminated')) 
                {
                    elem.classList.add('illuminated');
                    elem.classList.remove('lightcell');
                }
                if(!trs[j].children[elem.dataset.col].classList.contains('illuminated'))
                {
                    trs[j].children[elem.dataset.col].classList.add('illuminated');
                    trs[j].children[elem.dataset.col].classList.remove('lightcell');
                } 
            }
        }
        setTimeout(function() {lightBottom(elem, trs, parseInt(j)+1)}, 140);
    }
}

//unlight different directions 
function unlightRight(elem, tds, j)
{
    if(j < tds.length)
    {
        if(tds[j].classList.contains('wall'))
        {
            return;
        }
        else{
            tds[j].dataset.bulbs--;
            if(tds[j].classList.contains('taken') && tds[j] != elem && tds[j].dataset.bulbs == 1)
            {
                tds[j].classList.remove('illuminated');
                if(!tds[j].classList.contains('lightcell'))
                    tds[j].classList.add('lightcell');
            }
            if(tds[j].dataset.bulbs == 0)
            {
                tds[j].classList = 'cell';
            }
        }
        setTimeout(function() {unlightRight(elem, tds, parseInt(j)+1)}, 140);
    }
}
function unlightLeft(elem, tds, j)
{
    if(j >= 0)
    {
        if(tds[j].classList.contains('wall'))
        {
            return;
        }
        else{
            tds[j].dataset.bulbs--;
            if(tds[j].classList.contains('taken') && tds[j] != elem && tds[j].dataset.bulbs == 1)
            {
                tds[j].classList.remove('illuminated');
                if(!tds[j].classList.contains('lightcell'))
                    tds[j].classList.add('lightcell');
            }
            if(tds[j].dataset.bulbs == 0)
            {
                tds[j].classList = 'cell';
            }
        }
        setTimeout(function() {unlightLeft(elem, tds, parseInt(j)-1)}, 140);
    }
}
function unlightTop(elem, trs, j)
{
    if(j >= 0)
    {
        if(trs[j].children[elem.dataset.col].classList.contains('wall'))
        {
            return;
        }
        else{
            trs[j].children[elem.dataset.col].dataset.bulbs--;
            if(trs[j].children[elem.dataset.col].classList.contains('taken') && trs[j].children[elem.dataset.col] != elem 
                && trs[j].children[elem.dataset.col].dataset.bulbs == 1)
            {
                trs[j].children[elem.dataset.col].classList.remove('illuminated');
                if(!trs[j].children[elem.dataset.col].classList.contains('lightcell'))
                    trs[j].children[elem.dataset.col].classList.add('lightcell');
            }
            if(trs[j].children[elem.dataset.col].dataset.bulbs == 0)
            {
                trs[j].children[elem.dataset.col].classList = 'cell';
            }
        }
        setTimeout(function() {unlightTop(elem, trs, parseInt(j)-1)}, 140);
    }
}
function unlightBottom(elem, trs, j)
{
    if(j < trs.length)
    {
        if(trs[j].children[elem.dataset.col].classList.contains('wall'))
        {
            return;
        }
        else{
            trs[j].children[elem.dataset.col].dataset.bulbs--;
            if(trs[j].children[elem.dataset.col].classList.contains('taken') && trs[j].children[elem.dataset.col] != elem 
                && trs[j].children[elem.dataset.col].dataset.bulbs == 1)
            {
                trs[j].children[elem.dataset.col].classList.remove('illuminated');
                if(!trs[j].children[elem.dataset.col].classList.contains('lightcell'))
                    trs[j].children[elem.dataset.col].classList.add('lightcell');
            }
            if(trs[j].children[elem.dataset.col].dataset.bulbs == 0)
            {
                trs[j].children[elem.dataset.col].classList = 'cell';
            }
        }
        setTimeout(function() {unlightBottom(elem, trs, parseInt(j)+1)}, 140);
    }
}

//Checks if the wall has the right amount of bulbs around
function checkWall(node)
{
    if(node.dataset.bCount < blackSquares[node.dataset.row][node.dataset.col])
    {
        node.classList.remove('fit');
    }
    if(node.dataset.bCount == blackSquares[node.dataset.row][node.dataset.col])
    {
        if(node.classList.contains('unfit'))
            node.classList.toggle('unfit');
        node.classList.add('fit');
    }
    else if(node.dataset.bCount > blackSquares[node.dataset.row][node.dataset.col])
    {
        if(node.classList.contains('fit'))
            node.classList.remove('fit');
        if(!node.classList.contains('unfit'));
            node.classList.add('unfit');
    }
}

//Adds the count of bulbs to the walls
function addWallBulb(elem)
{
    let trs = document.querySelector('tbody').children;
    if(parseInt(elem.dataset.col) + 1 < trs.length && trs[elem.dataset.row].children[parseInt(elem.dataset.col) + 1].classList.contains('wall'))
    {
        trs[elem.dataset.row].children[parseInt(elem.dataset.col) + 1].dataset.bCount++;
        checkWall(trs[elem.dataset.row].children[parseInt(elem.dataset.col) + 1]);
    }
    if(parseInt(elem.dataset.col) - 1 >= 0 && trs[elem.dataset.row].children[parseInt(elem.dataset.col) - 1].classList.contains('wall'))
    {
        trs[elem.dataset.row].children[parseInt(elem.dataset.col) - 1].dataset.bCount++;
        checkWall(trs[elem.dataset.row].children[parseInt(elem.dataset.col) - 1]);
    }
    if(parseInt(elem.dataset.row) + 1 < trs.length && trs[parseInt(elem.dataset.row) + 1].children[elem.dataset.col].classList.contains('wall'))
    {
        trs[parseInt(elem.dataset.row) + 1].children[elem.dataset.col].dataset.bCount++;
        checkWall(trs[parseInt(elem.dataset.row) + 1].children[elem.dataset.col]);
    }
    if(parseInt(elem.dataset.row) - 1 >= 0 && trs[parseInt(elem.dataset.row) - 1].children[elem.dataset.col].classList.contains('wall'))
    {
        trs[parseInt(elem.dataset.row) - 1].children[elem.dataset.col].dataset.bCount++;
        checkWall(trs[parseInt(elem.dataset.row) - 1].children[elem.dataset.col]);
    }
}
function removeWallBulb(elem)
{
    let trs = document.querySelector('tbody').children;
    if(parseInt(elem.dataset.col) + 1 < trs.length && trs[elem.dataset.row].children[parseInt(elem.dataset.col) + 1].classList.contains('wall'))
    {
        trs[elem.dataset.row].children[parseInt(elem.dataset.col) + 1].dataset.bCount--;
        checkWall(trs[elem.dataset.row].children[parseInt(elem.dataset.col) + 1]);
    }
    if(parseInt(elem.dataset.col) - 1 >= 0 && trs[elem.dataset.row].children[parseInt(elem.dataset.col) - 1].classList.contains('wall'))
    {
        trs[elem.dataset.row].children[parseInt(elem.dataset.col) - 1].dataset.bCount--;
        checkWall(trs[elem.dataset.row].children[parseInt(elem.dataset.col) - 1]);
    }
    if(parseInt(elem.dataset.row) + 1 < trs.length && trs[parseInt(elem.dataset.row) + 1].children[elem.dataset.col].classList.contains('wall'))
    {
        trs[parseInt(elem.dataset.row) + 1].children[elem.dataset.col].dataset.bCount--;
        checkWall(trs[parseInt(elem.dataset.row) + 1].children[elem.dataset.col]);
    }
    if(parseInt(elem.dataset.row) - 1 >= 0 && trs[parseInt(elem.dataset.row) - 1].children[elem.dataset.col].classList.contains('wall'))
    {
        trs[parseInt(elem.dataset.row) - 1].children[elem.dataset.col].dataset.bCount--;
        checkWall(trs[parseInt(elem.dataset.row) - 1].children[elem.dataset.col]);
    }
}