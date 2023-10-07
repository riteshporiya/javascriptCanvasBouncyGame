window.onload = function () {
    // Get canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    // Timing and frames per second
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;

    // Level properties
    var level = {
        x: 1,
        y: 65,
        width: canvas.width - 2,
        height: canvas.height - 66
    };

    // The Square
    var square = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xdir: 0,
        ydir: 0,
        speed: 0
    };

    // Score and Level
    var score = 0;
    var scoreboard = document.getElementById("scoreboard");
    var levelThreshold = 30; // Score threshold to increase the level
    var currentLevel = 1;

    // Sound effect
    var bounceSound = document.getElementById("bounceSound");

    // Initialize the game
    function init() {
        // Add mouse events
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);

        // Initialize the square
        resetSquare();

        // Enter the main loop
        main(0);
    }

    // Main Loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);

        // Update and render the game
        update(tframe);
        render();
    }

    // Update the game state
    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;

        // Update the fps counter
        updateFps(dt);

        // Move the square
        square.x += dt * square.speed * square.xdir;
        square.y += dt * square.speed * square.ydir;

        // Handle collisions with the level
        if (square.x <= level.x) {
            // Left edge
            square.xdir = 1;
            square.x = level.x;
            playBounceSound();
        } else if (square.x + square.width >= level.x + level.width) {
            square.xdir = -1;
            square.x = level.x + level.width - square.width;
            playBounceSound();
        }

        if (square.y <= level.y) {
            // Top edge
            square.ydir = 1;
            square.y = level.y;
            playBounceSound();
        } else if (square.y + square.height >= level.y + level.height) {
            square.ydir = -1;
            square.y = level.y + level.height - square.height;
            playBounceSound();
        }

        // Check if the player reaches the level threshold to increase the level
        if (score >= levelThreshold * currentLevel) {
            currentLevel++;
            increaseLevel();
        }
    }

    // Update the Frames per second
    function updateFps(dt) {
        if (fpstime > 0.25) {
            // Calculate FPS
            fps = Math.round(framecount / fpstime);

            // Reset time and framecount
            fpstime = 0;
            framecount = 0;
        }

        // Increase time and framecount
        fpstime += dt;
        framecount++;
    }

    function render() {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the square
        context.fillStyle = "#ff8080";
        context.fillRect(square.x, square.y, square.width, square.height);

        // Draw a background image (you can replace 'bg.jpg' with your image)
        var backgroundImage = new Image();
        backgroundImage.src = 'bg.jpg';
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        // Update the scoreboard
        scoreboard.textContent = `Score: ${score} | Level: ${currentLevel}`;

        // Display FPS
        context.fillStyle = "#333";
        context.font = "18px Verdana";
        context.fillText(`FPS: ${fps}`, 10, 20);
    }

    // Mouse event handlers
    function onMouseMove(e) { }
    function onMouseDown(e) {
        // Get the position of the mouse
        var pos = getMousePos(canvas, e);

        // Check if we clicked the square
        if (
            pos.x >= square.x &&
            pos.x < square.x + square.width &&
            pos.y >= square.y &&
            pos.y < square.y + square.height
        ) {
            // Increase the score
            score += 1;

            // Increase the speed
            square.speed *= 1.05;

            // Give the square a random direction
            square.xdir *= -1;
            square.ydir *= -1;
        }
    }

    // Play bounce sound effect
    function playBounceSound() {
        bounceSound.currentTime = 0;
        bounceSound.play();
    }

    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width),
            y: Math.round(((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height)
        };
    }

    // Increase the level
    function increaseLevel() {
        // Reset square position and speed
        resetSquare();
        render();
    }

    // Reset the square position and speed
    function resetSquare() {
        square.width = 100;
        square.height = 100;
        square.x = level.x + (level.width - square.width) / 2;
        square.y = level.y + (level.height - square.height) / 2;
        square.xdir = 1;
        square.ydir = 1;
        square.speed = 200;
    }

    // Call the init function to start the game
    init();
};
