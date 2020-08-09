console.clear();

// module aliases
const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Body,
    Events
} = Matter;

let cellsHorizonzal = 16;
let cellsVertical = 8;
// const width = window.innerWidth;
// const height = window.innerHeight;
const width = document.body.clientWidth;
const height = document.body.clientHeight - document.querySelector('.settings').clientHeight;
// TODO big refactor -- 1min video
const unitLengthX = width / cellsHorizonzal;
const unitLengthY = height / cellsVertical;

// create an engine
const engine = Engine.create();

// disable gravity on start
engine.world.gravity.y = 0;

// get world => snapshot of all the shapes we have
const { world } = engine;

// create a renderer
let render = Render.create({
    element: document.body.querySelector('.wrapper'),
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    }
});

// run the renderer
Render.run(render);

// run the runner
const runner = Runner.create();
Runner.run(runner, engine);

// Walls
const walls = [
    // (shape center from left, shape center from top, width, height)
    Bodies.rectangle(
        width / 2, 0, width, 2,
        { isStatic: true, render: { fillStyle: '#18181D' } }),

    Bodies.rectangle(
        0, height / 2, 2, height,
        { isStatic: true, render: { fillStyle: '#18181D' } }),

    Bodies.rectangle(
        width, height / 2, 2, height,
        { isStatic: true, render: { fillStyle: '#18181D' } }),

    Bodies.rectangle(
        width / 2, height, width, 2, {
        isStatic: true, render: { fillStyle: '#18181D' }
    }),
];
World.add(world, walls);

//* Building a maze🐭
//1. generate the maze
//2. pick a random starting cell
//3. for that cell, build a randomly-ordered list of neighbours
//4. if a neighbour has been visited before, remove it from the list
//5. for each remaining neighbour, 'move' to it and remove the wall between those two cells
//6. repeat for new neighbour (step 3)

//* Maze generation 🧬

// Shuffle neighbours
const shuffle = (arr) => {
    let counter = arr.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;

    };
    return arr;
};

const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizonzal).fill(false));

const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizonzal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizonzal).fill(false));

// Pick a random starting cell
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizonzal);

const stepThroughCell = (row, column) => {
    // If I have visited the cell at [row,column], then return
    if (grid[row][column]) {
        return;
    }

    // Mark that cell as being visited
    grid[row][column] = true;

    // Assemble randomly-ordered list of neighbours
    //* [00,01,02]
    //* [10,11,12]
    //* [20,21,22]

    const neighbours = shuffle([
        [row - 1, column, 'up'], // above
        [row, column + 1, 'right'], // right
        [row + 1, column, 'down'], // below
        [row, column - 1, 'left'], // left
    ]);

    // For each neighbour...
    for (let neighbour of neighbours) {
        const [nextRow, nextColumn, direction] = neighbour;

        // See if neighbour is out of bounds
        if (
            nextRow < 0 ||
            nextRow >= cellsVertical ||
            nextColumn < 0 ||
            nextColumn >= cellsHorizonzal
        ) {
            continue; // move onto next iteration/neighbour
        };

        // If we have visited that neighbour, continue to next neighbour
        if (grid[nextRow][nextColumn]) {
            continue;
        };

        // Remove a wall from either verticals or horizontals
        if (direction === 'left') {
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        } else if (direction === 'up') {
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }

        stepThroughCell(nextRow, nextColumn);
    };
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        };

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            5,
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: '#FF8A65'
                }
            }
        );

        World.add(world, wall);
    })
});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        };

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            5,
            unitLengthY,
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: '#FF8A65'
                }
            }
        );

        World.add(world, wall);
    })
});

// Goal
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * .7,
    unitLengthY * .7,
    {
        label: 'goal',
        isStatic: true,
        render: { fillStyle: '#81C784' }
    }
);
World.add(world, goal);

// Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 3;
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius,
    { label: 'ball' }
);
World.add(world, ball);

// Ball controls
document.addEventListener('keydown', (e) => {
    const key = e.keyCode;
    const { x, y } = ball.velocity;

    if (key === 87 || key === 38) {
        // W / ARROW-UP
        Body.setVelocity(ball, { x, y: y - 5 });
    } else if (key === 68 || key === 39) {
        // D / ARROW-RIGHT
        Body.setVelocity(ball, { x: x + 5, y });
    } else if (key === 83 || key === 40) {
        // S / ARROW-DOWN
        Body.setVelocity(ball, { x, y: y + 5 });
    } else if (key === 65 || key === 37) {
        // A / ARROW-LEFT
        Body.setVelocity(ball, { x: x - 5, y });
    }
});

// Win condition
Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach(collision => {
        const labels = ['ball', 'goal'];

        if (
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyA.label)
        ) {
            document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y = 1;
            gravityBtn.classList.add('pressed');
            world.bodies.forEach(body => {
                console.log(body);
                if (body.label === 'wall') {
                    console.log(body);
                    Body.setStatic(body, false);
                    // body.isStatic = false; // this makes all borders dissapear for some reason
                };
            });
        };
    });
});


//TODOS
// toggle gravity
// toggle difficulty - with slider

const gravityBtn = document.querySelector('#gravity-btn');
gravityBtn.addEventListener('click', () => {
    const { gravity } = engine.world;

    if (gravity.y) {
        gravity.y = 0;
    } else {
        gravity.y = 1;
    }

    gravityBtn.classList.toggle('pressed');
});

document.addEventListener('keyup', e => {
    const { gravity } = engine.world;

    if (e.keyCode === 71) {
        if (gravity.y) {
            gravity.y = 0;
        } else {
            gravity.y = 1;
        };
        gravityBtn.classList.toggle('pressed');
    }
})

// const difficulty = document.querySelector('input[type="range"');
// difficulty.addEventListener('input', e => {
//     let value = e.target.value;

//     cellsHorizonzal = value * 1.4;
//     cellsVertical = value;

// });

