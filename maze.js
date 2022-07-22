const map = serverMaze;

let start = [0, 0],
    end = [19, 19];

let cool_moves = Array();
let least_moves = 100;

YES(0, 0, 0, []); // YES(0, 0);

async function YES(x, y, prev, moves){
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
            console.log(least_moves);
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

    if(!top && !check[0])YES(x, y-1, coords, current_moves);
    if(!left && !check[1])YES(x-1, y, coords, current_moves);
    if(!bottom && !check[2])YES(x, y+1, coords, current_moves);
    if(!right && !check[3])YES(x+1, y, coords, current_moves);


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
    console.log(moves);
    var i =0;
    var interval = setInterval(()=>{
        let lastMove = moves[i],
            currentMove = moves[i+1];
        if(typeof currentMove === 'undefined')return;
        if(lastMove[0] +1 == currentMove[0])move('right');
        if(lastMove[0] -1 == currentMove[0])move('left');
        if(lastMove[1] +1 == currentMove[1])move('down');
        if(lastMove[1] -1 == currentMove[1])move('up');
        i++
    },200);
}

function move(direction){
    connection.emit("dir", direction);
    console.log(direction);
}



