// global variables
const boardGrid = 20
const boardSize = 100

// arrays
let board = []

// objects
let tools = {
    eraser: false,
    fence: false,
    gate: false,
    path: false,
    bench: false,
    tree: false,
    grass: false,
    parking: false,
}

// DOM elements
let boardElementMain = document.querySelector('#board_element_main')

// various
let mousePosX, mousePosY,
    startMouseX, startMouseY,
    curTransX, curTransY,
    transPosX, transPosY,
    movingLoop,
    directions,
    dragging


// takes a string like this one: '11000100' and makes an array
// that can be interpreted by *INSERT FUNCTION*
const numToPiece = (num) => {

    // create empty array
    let arr = []

    // split the string and run through each character
    let numArr = num.split('')
    numArr.forEach((el, i) => {

        // if the character is a 1
        if (el == '1') {

            // declare variables type (type of piece), position (in what position is the piece)
            let type, position

            // type = number of 0s until next 1
            for (let j = 0; j < numArr.length; j++) {
                if (numArr[(j + i + 1) % numArr.length] == '1') {
                    type = j
                    break
                }
            }

            // where does the i sit
            position = i

            // push to arr with type, even and deg
            arr.push([type, position])

        }

    })

    // return the array
    return arr
}

const boardAtPos = (x, y) => {
    if (((x >= 0) && (x < board.length)) && ((y >= 0) && (y < board[0].length))) {
        return board[x][y]
    } else {
        return 0
    }
}


// takes a position in the game array and turns it into a string: '11000100'
// that can be used by numToPiece() to get an array with the correct character
const getPositionNum = (x, y) => {

    // create empty string
    let str = ''

    // add to the string depending on where the other pieces lie
    boardAtPos(x - 1, y + 0) == 1 ? str += '1' : str += '0'
    boardAtPos(x - 1, y + 1) == 1 ? str += '1' : str += '0'
    boardAtPos(x + 0, y + 1) == 1 ? str += '1' : str += '0'
    boardAtPos(x + 1, y + 1) == 1 ? str += '1' : str += '0'
    boardAtPos(x + 1, y + 0) == 1 ? str += '1' : str += '0'
    boardAtPos(x + 1, y - 1) == 1 ? str += '1' : str += '0'
    boardAtPos(x + 0, y - 1) == 1 ? str += '1' : str += '0'
    boardAtPos(x - 1, y - 1) == 1 ? str += '1' : str += '0'

    return str

}


// run this loop when moving board
let moving = () => {

    // if you are dragging
    if (dragging) {

        // calc gradient to check for the direction dragged, th = threshold
        let gradient = (startMouseY - mousePosY) / (mousePosX - startMouseX)
        let th1P = 0.4142
        let th1N = -0.4142
        let th2P = 2.4142
        let th2N = -2.4142

        let gradientFramesToLock = 5

        // check for the various directions, add to them, if you drag in that direction
        if (directions.check) {
            if (gradient < th2N || gradient > th2P || gradient == Infinity || gradient == -Infinity) {
                directions.n_s += 1
            }
            if (gradient < th2P && gradient > th1P) {
                directions.ne_sw += 1
            }
            if ((gradient < th1P && gradient >= 0) || (gradient <= 0 && gradient > th1N)) {
                directions.e_w += 1
            }
            if (gradient < th1N && gradient > th2N) {
                directions.nw_se += 1
            }
        }

        // set the directions, if dragged that direction for x frames or more
        for (const direction in directions) {
            if (directions[direction] >= gradientFramesToLock) {
                directions.dir = direction
                directions.check = false
            }
        }

        // default moves directions freely
        transPosX = curTransX + mousePosX - startMouseX
        transPosY = curTransY + mousePosY - startMouseY

        // overrite default directions depending on direction
        switch (directions.dir) {

            case 'n_s': // dir: north/south; don't translate horizontally
                transPosX = curTransX
                break

            case 'ne_sw': // dir: northeast/southwest; set Y to X if X is larger than Y else set X to Y - and reverse
                if (transPosX > transPosY) {
                    transPosY = curTransY - mousePosX + startMouseX
                } else {
                    transPosX = curTransX - mousePosY + startMouseY
                }
                break

            case 'e_w': // dir: east/west; don't translate vertically
                transPosY = curTransY
                break

            case 'nw_se': // dir: northwest/southeast; set Y to X if X is larger than Y else set X to Y
                if (transPosX > transPosY) {
                    transPosY = curTransY + mousePosX - startMouseX
                } else {
                    transPosX = curTransX + mousePosY - startMouseY
                }
                break
        }

        // stay inside the board
        if (transPosX > 0) {
            transPosX = 0
        }
        if (transPosY > 0) {
            transPosY = 0
        }
        if (transPosX < boardSize - boardSize * boardGrid) {
            transPosX = boardSize - boardSize * boardGrid
        }
        if (transPosY < boardSize - boardSize * boardGrid) {
            transPosY = boardSize - boardSize * boardGrid
        }

        // finally actually perform the transform on main board element
        boardElementMain.style.transform = `translate(${transPosX}px, ${transPosY}px)`

        // snapping precision: 0.5 is no precision, 0 is 100% precision
        let snapPrec = 0.35
        let squareX, squareY
        let restX = Math.abs(transPosX / boardSize - Math.round(transPosX / boardSize))
        let restY = Math.abs(transPosY / boardSize - Math.round(transPosY / boardSize))

        if ((restX < snapPrec || restX > 1 - snapPrec) && (restY < snapPrec || restY > 1 - snapPrec)) {
            squareX = -Math.round(transPosX / boardSize)
            squareY = -Math.round(transPosY / boardSize)

            board[squareX][squareY] = 1
            let squareDOM = boardElementMain.querySelector(`.board_row:nth-child(${squareY + 1}) .board_col:nth-child(${squareX + 1})`)
            squareDOM.innerHTML = ''
            let squareContent = document.createElement('p')
            squareContent.classList.add('board_content')
            squareContent.textContent = '1'
            squareDOM.append(squareContent)

            //console.log(`squareX: ${squareX}\nsquareY: ${squareY}`)
            console.log(getPositionNum(squareX, squareY))
                //console.log(boardAtPos(squareX - 1, squareY + 1))
        }

        // loop if still dragging
        requestAnimationFrame(moving)
    } else {
        // else stop
        cancelAnimationFrame(movingLoop)
    }

}

let str = String.fromCharCode(48)
console.log(str)

// when user starts touching the board
let startOfTouch = (event, touch) => {

    console.log('startOfTouch')

    // you are dragging
    dragging = true

    // reset directions
    directions = {
        n_s: 0,
        ne_sw: 0,
        e_w: 0,
        nw_se: 0,
        dir: '',
        check: true,
    }

    // set transition to .1 when dragging
    boardElementMain.style.transition = 'transform 0.1s cubic-bezier(.2, .8, .2, 1)'

    // receive the current state of the transform before moving to new place
    curTransX = +boardElementMain.style.transform.split('(')[1].split('px')[0] // translate(10px, 20px) => 10
    curTransY = +boardElementMain.style.transform.split(' ')[1].split('px')[0] // translate(10px, 20px) => 20

    // set mouseStart positions
    if (touch) {
        mousePosX = event.touches[0].screenX
        mousePosY = event.touches[0].screenY
    }
    startMouseX = mousePosX
    startMouseY = mousePosY

    // start the moving() loop
    movingLoop = requestAnimationFrame(moving)

}


// when user stops touching the board
let endOfTouch = () => {

    console.log('endOfTouch')

    // no longer dragging (stops the moving() function)
    dragging = false

    // calc new position that snaps board to grid
    let newTransPosX = Math.round(transPosX / boardSize) * boardSize
    let newTransPosY = Math.round(transPosY / boardSize) * boardSize

    // set transition to .4 when stopped
    boardElementMain.style.transition = 'transform .4s cubic-bezier(.2, 1.3, .5, 1)'

    // snap board to grid
    boardElementMain.style.transform = `translate(${newTransPosX}px, ${newTransPosY}px)`

}


// eventlisteners
let handleMousemove = (event) => {
    mousePosX = event.x || event.touches[0].screenX
    mousePosY = event.y || event.touches[0].screenY
}

boardElementMain.addEventListener('mousedown', (event) => startOfTouch(event, false))
boardElementMain.addEventListener('touchstart', (event) => startOfTouch(event, true))

boardElementMain.addEventListener('mousemove', handleMousemove);
boardElementMain.addEventListener('touchmove', handleMousemove);

boardElementMain.addEventListener('mouseup', endOfTouch)
boardElementMain.addEventListener('touchend', endOfTouch)


// run this at the start
const initBoard = () => {

    // set css variable to the js value
    document.documentElement.style.setProperty('--board-grid', boardGrid)
    document.documentElement.style.setProperty('--board-size', `${boardSize}px`)

    // create board array
    for (let i = 0; i < boardGrid; i++) {
        board.push([])
        for (let j = 0; j < boardGrid; j++) board[i].push(0)
    }

    // run through the 2-dimensional board array and create the DOM version
    board.forEach((row) => {

        // create a span element for each row
        let rowElement = document.createElement('span')
        rowElement.classList.add('board_row')

        // create a span element for each col inside each of the rows
        row.forEach((col) => {
            let colElement = document.createElement('span')
            colElement.classList.add('board_col')
            colElement.innerHTML = '<p class="board_content">0</p>'
            rowElement.append(colElement)
        })

        // append the rows (that contain the cols) to the boardElementMain in the DOM
        boardElementMain.append(rowElement)

    })

}

// build board
initBoard()


// update css variable on resize
const appHeight = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
window.addEventListener('resize', () => {
    appHeight()
    setTimeout(appHeight, 500)
})
appHeight()