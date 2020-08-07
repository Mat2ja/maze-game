/* http://matterjs-demo.surge.sh/ */

// module aliases
const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Mouse,
    MouseConstraint
} = Matter;

const width = 800;
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
        wireframes: false,
        width,
        height
    }
});

// run the renderer
Render.run(render);

// run the runner
Runner.run(Runner.create(), engine);

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}))

// Walls
const walls = [
    // (shape center from left, shape center from top, width, height)
    Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
    Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
    Bodies.rectangle(800, 300, 40, 600, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
];
World.add(world, walls);

// Random shapes
for (let i = 0; i < 50; i++) {
    if (Math.random() > 0.5) {
        World.add(
            world,
            Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
        );
    } else {
        World.add(
            world,
            Bodies.circle(Math.random() * width, Math.random() * height, 35, {
                render: {
                    // fillStyle: '#5261a4'
                }
            })
        );
    }
}

