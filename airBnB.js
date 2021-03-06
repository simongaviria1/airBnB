//By Simon Gaviria

var readline = require('readline')

var options = 'list, show n, reserve n, occupancy n max, search key-word'

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

/**ROOMS GLOBAL VARIABLE */
var rooms;

const fs = require('fs');

fs.readFile('rooms.json', (err, data) => {
    if (err) throw err;
    rooms = JSON.parse(data);
    //console.log(room);
});


// make the string exactly as long as len
function padLeft(str, len) {
    var money = str
    if (money.length > len) {
        return money.slice(0, len - 3) + '...'
    } else {
        while (money.length < len) {
            money = ' ' + money
        }
        return money;
    }
}

function padTo(str, len) {
    if (str.length > len) {
        return str.slice(0, len - 3) + '...'
    } else {
        while (str.length < len) {
            str += ' '
        }
        return str;
    }
}

function toMoney(num) {
    return '$' + num.toString()
}

function bulletPoints(list) {
    return '\n - ' + list.join('\n - ')
}

function showDetails(n) {
    var room = rooms[n]
    console.log('Details of room #' + (n + 1))
    console.log('----------------------\n')
    if (room.reserved) {
        console.log('[RESERVED]')
    }
    console.log('Location:', room.location)
    console.log('Price:', toMoney(room.price))
    console.log('Max. Occupancy:', room.maxOccupants)
    console.log('Amenities:', bulletPoints(room.amenities))
}

function reserve(n) {
    if (rooms[n].reserved) {
        console.log('Sorry, it\'s already reserved.')
        return
    }
    rooms[n].reserved = true
    console.log('Thank you for reserving')
}

function occupancy(n, max) {
    rooms[n].maxOccupants = max
    console.log('Occupants set.')
}

function list(callback) {
    console.log(
        padLeft('ID', 2),
        '...',
        padTo('Address', 30),
        ' ',
        padLeft('Price', 8)
    );
    for (var i = 0; i < rooms.length; i++) {
        if (callback(rooms[i])) {
            var counter = i + 1;
            console.log(
                padLeft(counter.toString(), 2),
                '...',
                padTo(rooms[i].location, 30),
                ' ',
                padLeft(toMoney(rooms[i].price), 8)
            );
        }
    }
}

rl.on('line', function (input) {
    var inputArr = input.split(' ')
    if (inputArr[0] === 'list') {
        list(function (room) {
            return !room.reserved
        });
    } else if (inputArr[0] === 'show') {
        showDetails(inputArr[1] - 1)
    } else if (inputArr[0] === 'reserve') {
        reserve(inputArr[1] - 1)
    } else if (inputArr[0] === 'occupancy') {
        occupancy(inputArr[1] - 1, inputArr[2])
    } else if (inputArr[0] === 'search') {
        var amenity = inputArr.slice(1).join(' ')
        list(function (room) {
            return !room.reserved && room.location.indexOf(amenity) > -1

        });
    } else {
        console.log('Unknown command: ' + input)
    }

    console.log('\n\nPlease chose one of [' + options + '] $')
})

console.log('Please chose one of [' + options + '] $')

/**
 1. Make a new command `search-location` `_loc_` and have that list out all the rooms that have `_loc_` in the location (partial match).

 2. Merge this functionality into the existing `search` command, thereby making it universal search.

 * Example#1: `search-location DC` should list out the white house. 
 * Example#2: `search DC` should list out the white house and `search wifi` should list out times square and 11 Broadway
 */