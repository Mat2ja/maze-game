gridconsole.clear();

// module aliases

const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
} = Matter;

const cells = 5;
const width = 600;
const height = 600;

// create an engine
const engine = Engine.create();

// get world => snapshot of all the shapes we have
const { world } = engine;

// create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
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
    Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
];
World.add(world, walls);

//* Maze generation 🧬
// Bad solution bsc if we modify one, it modifies all
// i.e grid[0].push(true)) changes all 3 rows
// const grid = Array(3).fill([false,false,false]

const grid = Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false));


const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false));

// console.log(grid);
// console.log(verticals);
// console.log(horizontals);

// Pick a random starting cell
