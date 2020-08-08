console.clear();

// module aliases
const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
} = Matter;

const cells = 3;
const width = 600;
const height = 600;

const unitLength = width / cells;

// create an engine
const engine = Engine.create();

// get world => snapshot of all the shapes we have
const { world } = engine;

// create a renderer
const render = Render.create({
    element: document.body,
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
Runner.run(Runner.create(), engine);

// Walls
const walls = [
    // (shape center from left, shape center from top, width, height)
    Bodies.rectangle(
        width / 2, 0, width, 2,
        { isStatic: true, render: { fillStyle: '#FF8A65' } }),

    Bodies.rectangle(
        0, height / 2, 2, height,
        { isStatic: true, render: { fillStyle: '#FF8A65' } }),

    Bodies.rectangle(
        width, height / 2, 2, height,
        { isStatic: true, render: { fillStyle: '#FF8A65' } }),

    Bodies.rectangle(
        width / 2, height, width, 2, {
        isStatic: true, render: { fillStyle: '#FF8A65' }
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
}

const grid = Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false));

const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false));

// Pick a random starting cell
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);
console.log(startRow, startColumn);

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
        if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
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
console.log('grid', grid);
console.log('verticals', verticals);
console.log('horizontals', horizontals);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        };

        const unitLength = width / cells;

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength,
            10,
            {
                isStatic: true,
                render: { fillStyle: '#FF8A65' }
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

        const unitLength = width / cells;

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength / 2,
            10,
            unitLength,
            {
                isStatic: true,
                render: { fillStyle: '#FF8A65' }
            }
        );

        World.add(world, wall);
    })
});

// Goal
const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength / 2,
    unitLength * .7,
    unitLength * .7,
    {
        isStatic: true,
        render: { fillStyle: '#81C784' }
    }
);
World.add(world, goal);

// Ball
const ball = Bodies.circle(
    unitLength / 2,
    unitLength / 2,
    unitLength / 4
);
World.add(world, ball);

