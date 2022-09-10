const boardGrid = 25
let board = []

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



const initBoard = () => {

    // create board array
    for (let i = 0; i < boardGrid; i++) {
        board.push([])
        for (let j = 0; j < boardGrid; j++) {
            board[i].push(0)
        }
    }

}

initBoard()

console.log(board)






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

let gameArr = [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
]

// takes a position in the game array and turns it into a string: '11000100'
// that can be used by numToPiece() to get an array with the correct character
const getPositionNum = (x, y) => {

    // create empty string
    let str = ''

    // add to the string depending on where the other pieces lie
    gameArr[x - 1][y + 0] == '1' ? str += '1' : str += '0'
    gameArr[x - 1][y + 1] == '1' ? str += '1' : str += '0'
    gameArr[x + 0][y + 1] == '1' ? str += '1' : str += '0'
    gameArr[x + 1][y + 1] == '1' ? str += '1' : str += '0'
    gameArr[x + 1][y + 0] == '1' ? str += '1' : str += '0'
    gameArr[x + 1][y - 1] == '1' ? str += '1' : str += '0'
    gameArr[x + 0][y - 1] == '1' ? str += '1' : str += '0'
    gameArr[x - 1][y - 1] == '1' ? str += '1' : str += '0'

    return str

}

console.log(getPositionNum(1, 1))