// Basic tasks (12 pts)
// [ ] Map selector: at least three different maps can be selected and started correctly (1 pt)
// [x] Map selector: the player's name can be entered which is shown during the game and on the scoreboard (1 pt)
// [x] Game board: the elapsed time is always shown and updated (1 pt)
// [x] Game board: all illuminated tiles (including the tiles containing the light bulbs) get yellow background colour (1 pt)
// [x] Game board: the propagation of light is animated, the yellow background colour spreads from the light source after it has been placed (1 pt)
// [x] Game board: show with a different style (e.g. green text colour) if a black tile is surrounded by the correct number of light bulbs (1 pt)
// [x] Game board: show with a different style (e.g. red colour or icon) if two light bulbs illuminate each other (1 pt)
// [ ] Map selector: the latest results can be seen - player's name, map name, time elapsed (1 pt)
// [ ] Map selector: the latest results are stored persistently after the page is closed (1 pt)
// [ ] Map selector: the saved game is shown and can be loaded properly (1 pt)
// [x] Other: nice design (1 pt)
// [x] Game board: the game can be interrupted and saved (1 pt)

// Starting Button Trigger
function startGame(){
    toggleScreen('start-menu', false);
    toggleScreen('name-input', true)
    inputname(true);    
}    
function toggleScreen(id, toggle)
{
  let elem = document.getElementById(id);
  let display = (toggle) ? 'block' : 'none';
  elem.style.display = display;
}
function inputname(isStart)
{
  let s = document.getElementById('name-input');
  
  let inp = document.createElement("input");
  inp.id = "inp";
  inp.type = "text";
  inp.placeholder = `Username`
  let b = document.createElement("button");
  b.innerHTML = `Start`;
  b.id = "inp-submit";
  if(isStart)
  {
    b.addEventListener('click', putUsername);
    inp.addEventListener('keypress', function (e)
    {
      console.log(e.key);
      if(e.key === 'Enter')
      {
        putUsername();
      }
    })
  }
  else
  {
    b.addEventListener('click', putUsernameLoad);
    inp.addEventListener('keypress', (e) =>
    {
      if(e.key === 'Enter')
      {
        putUsernameLoad();
      }
    })
  }
  s.appendChild(inp);s.appendChild(b);
}

//Username putting hadling
function putUsername()
{
  username = document.getElementById("inp").value
  toggleScreen('name-input', false);
  toggleScreen('game-space', true);
  level(7);
  run();
}
function putUsernameLoad()
{
  username = document.getElementById("inp").value
  toggleScreen('name-input', false);
  toggleScreen('game-space', true);
  let temp = window.localStorage.getItem("Game0");
  console.log(temp);
  let json = JSON.parse(temp);

    //Create info block
  let info = document.getElementById('info');
  info.innerHTML = '';
  

  //loop time and fix the interval
  let p = document.createElement('p');
  info.appendChild(p);
  p.id = 'timer';
  time = json["time"];
  p.innerHTML = time;
  
  //Username
  if(username.length == 0)
    username = "Guest";
  let uname = document.createElement('p');
  uname.innerHTML = username;
  uname.id = "username";
  info.appendChild(uname);

  min = parseInt(json["time"].substring(0,2)); sec = parseInt(json["time"].substring(3,5));
  interval = setInterval(timer, 1000); 

  //Save button
  let save = document.createElement('p');
  save.innerHTML = "Save Game";
  save.id = "save"
  save.addEventListener('click', saveGame);
  info.appendChild(save);
  
  //create table
  let board = document.getElementById('board');
  let tbody = document.createElement('tbody');
  board.innerHTML = '';
  for(let i = 0; i < 7; i++)
  {
    let newTr = document.createElement('tr');
    for(let j = 0; j < 7; j++)
    {
      if(!json["cells"][7 * i + j]["class"].includes("wall"))
      {
        blackSquares[i][j] = -1;
        let newTd = document.createElement('td');
        newTd.setAttribute('class', 'cell');
        newTd.dataset.row = i; 
        newTd.dataset.col = j;
        newTd.dataset.bulbs = parseInt(json["cells"][7 * i + j]["data-bulbs"]);
        if(json["cells"][7 * i + j]["class"].includes("taken"))
        {
          newTd.classList.add("taken");
          let img = document.createElement('img');
          img.src = "/bulb.png";
          img.style.width = '50px';
          img.style.height = '50px';
          img.classList = 'bulb';
          newTd.appendChild(img);
        }
        if(json["cells"][7 * i + j]["class"].includes("lightcell"))
        {
          newTd.classList.add("lightcell");
        }
        newTr.append(newTd);
      }
      else
      {
        let newTd = document.createElement('td');
        newTd.setAttribute('class', 'wall');
        newTd.dataset.row = i; 
        newTd.dataset.col = j;
        newTd.dataset.bCount = parseInt(json["cells"][7 * i + j]["data-b-count"]);
        blackSquares[i][j] = parseInt(json["cells"][7 * i + j]["data-black-squares"]); 
        //set the numbers on the black squares
        switch(blackSquares[i][j])
        {
          case 0:
            newTd.innerHTML = `0`;
            newTd.classList.add('fit');
            break;
          case 1:
            newTd.innerHTML = `1`;
            break;
          case 2:
            newTd.innerHTML = `2`;
            break;
          case 3:
            newTd.innerHTML = `3`;
            break;
          default:
        }
        newTr.append(newTd);
      }
    }
    delegate(newTr, 'td', 'click', putBulb)
    tbody.appendChild(newTr);
  }
  board.appendChild(tbody);
  isGame = true;
}

//Loading game function
function loadGame()
{
  if(window.localStorage.length > 0)
  {
    toggleScreen('start-menu', false);
    toggleScreen('name-input', true);
    inputname(false);
  }
}

//Saving game function
function saveGame()
{
  console.log("saved");
  let tbody = document.querySelector('tbody');
  let trs = tbody.children;
  let json = `{"cells":[`;
  for(let i = 0; i < 7; i++)
  {
    let rep = "";
    for(let j = 0; j < 7; j++)
    {
      rep += "{";
      let td = trs[i].children[j];
      let cnt = 0;
      for(let data of td.getAttributeNames())
      {
        let temp = "";
        if(cnt != 0)
          temp += `, `;
        cnt = 1;
        temp += `"${data}"`;
        temp += `:"${td.getAttribute(data)}"`;
        rep += temp;
      }
      rep += "}";
      if(j != 6)
        rep += ","
    }
    json += rep;
    if(i != 6)
      json += ",";
  }
  json += "]";
  let ttime = `,"time" : "${time}"}`
  window.localStorage.setItem(`Game0`, json + ttime);
}

// Game
function run(){
  //Create info block
  let info = document.getElementById('info');
  info.innerHTML = '';
  

  //loop time and fix the interval
  let p = document.createElement('p');
  info.appendChild(p);
  p.id = 'timer';
  time = "00:00";
  p.innerHTML = time;
  
  if(min != 0 && sec != 0) min = 0; sec = 0;
  interval = setInterval(timer, 1000); 

  //Username
  if(username.length == 0)
    username = "Guest";
  let uname = document.createElement('p');
  uname.innerHTML = username;
  uname.id = "username";
  info.appendChild(uname);

  //Save button
  let save = document.createElement('p');
  save.innerHTML = "Save Game";
  save.id = "save";
  save.addEventListener('click', saveGame);
  info.appendChild(save);
  
  //create table
  let board = document.getElementById('board');
  let tbody = document.createElement('tbody');
  board.innerHTML = '';
  for(let i = 0; i < 7; i++)
  {
    let newTr = document.createElement('tr');
    for(let j = 0; j < 7; j++)
    {
      if(blackSquares[i][j] == -1)
      {
        let newTd = document.createElement('td');
        newTd.setAttribute('class', 'cell');
        newTd.dataset.row = i; 
        newTd.dataset.col = j;
        newTd.dataset.bulbs = 0;
        newTr.append(newTd);
      }
      else
      {
        let newTd = document.createElement('td');
        newTd.setAttribute('class', 'wall');
        newTd.dataset.row = i; 
        newTd.dataset.col = j;
        newTd.dataset.bCount = 0;
        newTd.dataset.blackSquares = blackSquares[i][j];
        //set the numbers on the black squares
        switch(blackSquares[i][j])
        {
          case 0:
            newTd.innerHTML = `0`;
            newTd.classList.add('fit');
            break;
          case 1:
            newTd.innerHTML = `1`;
            break;
          case 2:
            newTd.innerHTML = `2`;
            break;
          case 3:
            newTd.innerHTML = `3`;
            break;
          default:
        }
        newTr.append(newTd);
      }
    }
    delegate(newTr, 'td', 'click', putBulb)
    tbody.appendChild(newTr);
  }
  board.appendChild(tbody);
  isGame = true;
}

// Bulb putting function
function putBulb(event, elem)
{
  if(isGame)
  {
    if(!elem.classList.contains('wall'))
    {
      let class_list = elem.classList;
      if(!class_list.contains('taken'))
      {
        addWallBulb(elem);
        let img = document.createElement('img');
        img.src = "./bulb.png";
        img.style.width = '50px';
        img.style.height = '50px';
        img.classList = 'bulb';
        elem.classList.add('taken');
        elem.classList.add('lightcell');
        elem.appendChild(img);
        elem.dataset.bulbs++;
        lightup(elem);
        allBsCount++;
      }
      else{
        removeWallBulb(elem);
        elem.innerHTML = "";
        elem.dataset.bulbs--;
        if(elem.dataset.bulbs == 0)
          elem.classList = 'cell';
        else
          elem.classList = 'cell lightcell'
        unlight(elem)
        allBsCount--;
      }
    }
  }
}

//function for lighting up the bulb
function lightup(elem)
{
  let tbody = document.querySelector('tbody');
  let trs = tbody.children;
  let tds = trs[elem.dataset.row].children;
  //right of the bulb
  lightRight(elem, tds, parseInt(elem.dataset.col) + 1);
  //left of the bulb
  lightLeft(elem, tds, parseInt(elem.dataset.col) - 1);
  //top of the bulb
  lightTop(elem, trs, parseInt(elem.dataset.row) - 1);
  //bottom of the bulb
  lightBottom(elem, trs, parseInt(elem.dataset.row) + 1);
}

//function for unlighting bulbs
function unlight(elem)
{
  let tbody = document.querySelector('tbody');
  let trs = tbody.children;
  let tds = trs[elem.dataset.row].children;
  //right of the bulb
  unlightRight(elem, tds, parseInt(elem.dataset.col) + 1);
  //left of the bulb
  unlightLeft(elem, tds, parseInt(elem.dataset.col) - 1);
  //top of the bulb
  unlightTop(elem, trs, parseInt(elem.dataset.row) - 1);
  //bottom of the bulb
  unlightBottom(elem, trs, parseInt(elem.dataset.row) + 1);
}

//Checks the board if the solution was found
function check()
{
  let tbody = document.querySelector('tbody');
  let win = true;
  let trs = tbody.children
  for(let tr of trs)
  {
    let tds = tr.children
    for(let td of tds)
    {
      if(!td.classList.contains('wall') && (!td.classList.contains('lightcell') || td.classList.contains('wrong')))
      {
        win = false;
        break;
      }
      if(td.classList.contains('wall') && blackSquares[td.dataset.row][td.dataset.col] != 4 
        && (td.classList.contains('unfit') || !td.classList.contains('fit'))
        )
      {
        win = false;
        break;
      }
      if(td.classList.contains('illuminated'))
      {
        win = false;
        break;
      }
    }
    if(!win)
    {
      break;
    }
  }
  if(win)
  {
    p = document.createElement('p');
    button = document.createElement('button');

    p.innerText = 'You have won!';
    p.id = 'winningText';
    button.classlist = 'button';
    button.id = 'restart';
    button.innerText = 'Restart';
    button.addEventListener('click', restart);

    res = document.getElementById('result');
    
    res.appendChild(p);
    res.appendChild(button);
    toggleScreen('result', true);
    isGame = false;
  }
}

//Restart button click event
function restart(e)
{
  res = document.getElementById('result');
  res.innerHTML = '';
  toggleScreen('result', false);
  run();
}