// Possible things to do:
// Make game scalable. Do not hardcode canvas size,
// simply redraw it each time the end user 
// resizes the browser.
// Also make each square scale with canvas size
// This would let us set custom map size with
// a world.maxX and world.maxY


//Globals
var canvas = document.getElementById("game");
var game = canvas.getContext("2d");
var snakeDirection = null;
var gameOver = false;
var score = 0;
var fps = 4;
var frameTime = 1000/fps;
function baseApple()
{
	//Use -1 here so that the apple is drawn out of bounds.
	//For some reason, null == 0 when drawing it. 
	this.x = -1;
	this.y = -1;
	this.exist = false;
	this.eraseApple = function eraseApple()
	{
		// so using baseApple() here
		// does not work for some reason.
		// Why not? Technically it's a function
		// that just sets this.attribute to a
		// specific number. 
		this.x = -1;
		this.y = -1;
		this.exist = false;
	};
	this.spawn = function spawn ()
	{
		this.x = parseInt(Math.random() * 12);
		this.y = parseInt(Math.random() * 12);
		for (var i in snake.body)
		{
			if (snake.body[i].x === this.x && snake.body[i].y === this.y)
			{
				//Duplicate location? ROLL AGAIN
				this.x = parseInt(Math.random() * 12);
				this.y = parseInt(Math.random() * 12);				
				console.log("Rerolled Apple Location!");
			}
		}
		this.exist = true;
	};
}
function baseSnake() 
{
	this.direction = null;
	this.length = 0;
	this.x = 6;
	this.y = 6;
	this.body = [];
	this.die = function()
	{
		this.direction = null;
		this.length = 0;
		this.x = 6;
		this.y = 6;
		this.body.length = 0;			
	};
	this.moveBody = function ()
	{
		if (this.body.length > 0)
		{
			var bodyBeingMoved = this.body.shift();
			bodyBeingMoved.x = this.x;
			bodyBeingMoved.y = this.y;
			this.body.push(bodyBeingMoved);			
		}
	}
}
var apple = new baseApple();
var snake = new baseSnake();
function snakeMove(dir)
{
	//Put the moveBody up here because if it happens after
	//nom or snakeMove,
	snake.moveBody();
	// checkNom() itself moves the snake to the apple
	// to make room for a new body segment.
	// so if checkNom() has already moved snake,
	// dont bother doing it again. 	
	if(!checkNom())
	{
		switch(snake.direction)
		{
			case "Up":
				snake.y -= 1;
				break;
			case "Down":
				snake.y += 1;
				break;
			case "Left":
				snake.x -= 1;
				break;
			case "Right":
				snake.x += 1;
				break;
		}		
	}
	
	//commented out the non-lethal fence
	//in favor of a highly lethal fence. 
	if (snake.x < 0)
	{
		snake.die();
		apple.spawn();
		//snake.x = 0;
	}
	if (snake.x*50 > canvas.width - 50)
	{
		snake.die();
		apple.spawn();
		//snake.x = (canvas.width/50) - 1;
	}
	if (snake.y < 0)
	{
		snake.die();
		apple.spawn();
		//snake.y = 0;
	}
	if (snake.y*50 > canvas.height - 50)
	{
		snake.die();
		apple.spawn();
		//snake.y = (canvas.height/50) - 1;
	}
}
// View
function drawGame()
{
	//
	game.clearRect(0, 0, canvas.width, canvas.height);
	//Draw game box
	game.lineWidth = 5;
	game.strokeRect(0, 0, canvas.width, canvas.height);

	//Draw Snake
	game.fillStyle="#000000"
	game.fillRect(snake.x*50,snake.y*50,50,50);

	//Draw snake body
	for (var i in snake.body)
	{
		var bodX = snake.body[i].x;
		var bodY = snake.body[i].y;
		game.fillRect(bodX*50, bodY*50, 50,50);
	}


	//Draw apple
	game.fillStyle="#FF0000"
	game.fillRect(apple.x*50, apple.y*50,50,50);
	
	game.stroke();
}
//Model
function update()
{
	//Moving the snake
	if (snake.direction !== null)
	{
		snakeMove(snake.direction);
	}
	//Creating the apple
	if (!apple.exist)
	{
		apple.spawn();
	}
}
function checkNom()
{
	// Which direction is snake looking at?
	// That's the next square the snake
	// will try to eat. Aka nomlocation.
	var nomLocation = {x:null,y:null};
	switch(snake.direction)
	{
		case "Up":
			nomLocation.x = snake.x;
			nomLocation.y = snake.y - 1;
			break;
		case "Down":
			nomLocation.x = snake.x;
			nomLocation.y = snake.y + 1;
			break;
		case "Left":
			nomLocation.x = snake.x - 1;
			nomLocation.y = snake.y;
			break;
		case "Right":
			nomLocation.x = snake.x + 1;
			nomLocation.y = snake.y;
			break;
	}

	//Is snake nom-ing on itself? 
		if (snake.body.length > 0)
		{
			for (var i in snake.body)
			{
				if (snake.body[i].x === nomLocation.x && snake.body[i].y === nomLocation.y)
				{
					snake.die();
					apple.spawn();
					return true;
				}
			}	
		}

	//Is the apple located at the nom location?
	if (nomLocation.x === apple.x && nomLocation.y === apple.y)
	{
		//add the apple to snake's body and
		//push object into body at snake's old
		//location because snake head's new
		//location is going to be moved to
		//where the apple is. 
		snake.body.push({
			x:snake.x, 
			y:snake.y
		});

		// Then delete the apple and move the snake head
		// to the apple location
		apple.eraseApple();
		snake.x = nomLocation.x;
		snake.y = nomLocation.y;
		return true;
	}

	// no apple was nommed.
	return false;
}
//Controller
//changing direction of the snake
$(document).ready(
		$(document).keydown(function(event)
		{
			snake.direction = event.key;
			//event.preventDefault(); //Stops the arrow keys from scrolling the screen. 
		})
	);


//looping the game


main();
function main()
{
	update();
	drawGame();
	setTimeout(main, frameTime);
}






