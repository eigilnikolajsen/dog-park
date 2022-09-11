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
let mousePosX, mousePosY, startMouseX, startMouseY, curTransX, curTransY, transPosX, transPosY, loopFrame


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

            // even = is i even?
            position = i

            // push to arr with type, even and deg
            arr.push([type, position])

        }

    })

    // return the array
    return arr
}

// takes a position in the game array and turns it into a string: '11000100'
// that can be used by numToPiece() to get an array with the correct character
const getPositionNum = (x, y) => {

    // create empty string
    let str = ''

    // add to the string depending on where the other pieces lie
    board[x - 1][y + 0] == '1' ? str += '1' : str += '0'
    board[x - 1][y + 1] == '1' ? str += '1' : str += '0'
    board[x + 0][y + 1] == '1' ? str += '1' : str += '0'
    board[x + 1][y + 1] == '1' ? str += '1' : str += '0'
    board[x + 1][y + 0] == '1' ? str += '1' : str += '0'
    board[x + 1][y - 1] == '1' ? str += '1' : str += '0'
    board[x + 0][y - 1] == '1' ? str += '1' : str += '0'
    board[x - 1][y - 1] == '1' ? str += '1' : str += '0'

    return str

}



// run this loop when moving board
//let gradeThreshold = Math.sin(Math.PI / 8) / Math.cos(Math.PI / 8)
let moving = () => {
    //console.log('moving')

    transPosX = +curTransX + mousePosX - startMouseX
    transPosY = +curTransY + mousePosY - startMouseY


    let gradient = (startMouseY - mousePosY) / (mousePosX - startMouseX)
    let gradeThreshold = 0.4142

    //console.log(gradient)

    if (gradient < -2 - gradeThreshold || gradient > gradeThreshold + 2 || gradient == Infinity || gradient == -Infinity) {
        console.log(`Area 1: going S / N. Gradient: ${gradient}`)
        transPosX = +curTransX
    }
    if (gradient < gradeThreshold + 2 && gradient > gradeThreshold) {
        console.log(`Area 2: going SW / NE. Gradient: ${gradient}`)
        console.log(`transPosX: ${transPosX}. transPosY: ${transPosY}. `)
        if (transPosX > transPosY) {
            transPosY = +curTransX - mousePosX + startMouseX
        } else {
            transPosX = +curTransY - mousePosY + startMouseY
        }
    }
    if ((gradient < gradeThreshold && gradient >= 0) || (gradient <= 0 && gradient > 0 - gradeThreshold)) {
        console.log(`Area 3: going W / E. Gradient: ${gradient}`)
        transPosY = +curTransY
    }
    if (gradient < 0 - gradeThreshold && gradient > -2 - gradeThreshold) {
        console.log(`Area 4: going SE / NW. Gradient: ${gradient}`)
        if (transPosX > transPosY) {
            transPosY = transPosX
        } else {
            transPosX = transPosY
        }
    }

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


    boardElementMain.style.transform = `translate(${transPosX}px, ${transPosY}px)`



    if (grapping) {
        requestAnimationFrame(moving)
    } else {
        cancelAnimationFrame(loopFrame)
    }

}

// when user starts touching the board
let startOfTouch = (event, touch) => {
    console.log('startOfTouch')

    grapping = true

    boardElementMain.style.transition = 'transform 0.1s cubic-bezier(.2, .8, .2, 1)'


    curTransX = boardElementMain.style.transform.split('(')[1].split('px')[0]
    curTransY = boardElementMain.style.transform.split(' ')[1].split('px')[0]


    if (touch) {
        mousePosX = event.touches[0].screenX
        mousePosY = event.touches[0].screenY
    }
    startMouseX = mousePosX
    startMouseY = mousePosY

    loopFrame = requestAnimationFrame(moving)
}

// when user stops touching the board
let endOfTouch = () => {
    console.log('endOfTouch')
    grapping = false

    let newtransPosX = Math.round(transPosX / boardSize) * boardSize
    let newtransPosY = Math.round(transPosY / boardSize) * boardSize


    console.log(transPosX)
    console.log(newtransPosX)

    boardElementMain.style.transform = `translate(${newtransPosX}px, ${newtransPosY}px)`

    boardElementMain.style.transition = 'transform .4s cubic-bezier(.2, 1.5, .5, 1)'
}

// eventlisteners
boardElementMain.addEventListener('mousedown', (event) => startOfTouch(event, false))
boardElementMain.addEventListener('touchstart', (event) => startOfTouch(event, true))

let handleMousemove = (event) => {
    mousePosX = event.x || event.touches[0].screenX
    mousePosY = event.y || event.touches[0].screenY
}

boardElementMain.addEventListener('mousemove', handleMousemove);
boardElementMain.addEventListener('touchmove', handleMousemove);

boardElementMain.addEventListener('mouseup', endOfTouch)
boardElementMain.addEventListener('touchend', endOfTouch)

initBoard()


// update css variable on resize
const appHeight = () => document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
window.addEventListener('resize', () => {
    appHeight()
    setTimeout(appHeight, 500)
})
appHeight()