var serverMaze;
let yes =0;
let connection = io("https://maze-game-online.herokuapp.com");
var map;
connection.on("starting-data", (data) => {
    serverMaze = data.maze;
    map = serverMaze;
    if(yes)return;
    path_find(0,0,0,[]);
    yes = 1;
})

let start = [0, 0],
    end = [19, 19];

let Stop = 0;

let cool_moves = Array();
let least_moves = 100;

async function path_find(x, y, prev, moves){
    //console.log(x, y);
    let point = map[y][x],
        coords = [x, y];
    let top = point.top,
        left = point.left,
        bottom = point.bottom,
        right = point.right;

    let current_moves = Array.from(moves);
    current_moves.push([x,y]);

    if(x == 19 && y == 19){
        if(moves.length < least_moves){
            least_moves = current_moves.length;
            cool_moves = current_moves;
            //console.log(current_moves);
            completeMoves(current_moves);
        }

        return;
    }
    

    let check = prev? await checkPrevious(x, y, prev): [0,0,0,0];

    /*
    console.log(x, y);
    console.log(check);*/

    if(!top && !check[0])path_find(x, y-1, coords, current_moves);
    if(!left && !check[1])path_find(x-1, y, coords, current_moves);
    if(!bottom && !check[2])path_find(x, y+1, coords, current_moves);
    if(!right && !check[3])path_find(x+1, y, coords, current_moves);


}

function checkPrevious(x, y, prev){
    return new Promise((resolve)=>{
        let check = Array();
        check.push(y-1 == prev[1]);
        check.push(x-1 == prev[0]);
        check.push(y+1 == prev[1]);
        check.push(x+1 == prev[0]);
        resolve(check);
    });
}

function completeMoves(moves){
    var i =0;
    var interval = setInterval(()=>{
        if(Stop)clearInterval(interval);
        let lastMove = moves[i],
            currentMove = moves[i+1];
        if(typeof currentMove === 'undefined')return;
        if(lastMove[0] +1 == currentMove[0])move('right');
        if(lastMove[0] -1 == currentMove[0])move('left');
        if(lastMove[1] +1 == currentMove[1])move('down');
        if(lastMove[1] -1 == currentMove[1])move('up');
        i++
    },140);
}

function move(direction){
    connection.emit("dir", direction);
}

function stop(){
    Stop = 1;
}

