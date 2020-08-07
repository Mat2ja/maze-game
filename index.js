/* http://matterjs-demo.surge.sh/ */

// module aliases
const {
    Engine,
    Render,
    Runner,
    World,
nweBodies,
} = Matter;

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
