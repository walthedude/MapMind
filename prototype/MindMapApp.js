/* Basic 'mind map' application */

/* Create various global values */

var canvas = document.getElementById("app_canvas");
var ctx = canvas.getContext("2d");
var previous_node_x_position = 0;
var previous_node_y_position = 0;
var click_node_position = [];
var current_position = {};
var match_found = false;
var use_map_flag = false;

/* If 'local storage' contains the JSON file then load that into the array and display by calling 'use_map' function */

/* 'node_details' object, which contains 'node position', 'node text' and 'connecting line' for all the 'nodes' */

var node_details = {node_array : []};

/* Check if a 'mind map' was created previously */

if(returnedObject = localStorage.getItem('mind_map_data')) {

	node_details = JSON.parse(returnedObject);

	edit_map();

}

/* Get a click event */

canvas.addEventListener('click', (event) => {

	/* Get the position of the 'mouse' within the 'canvas' */

	var rectangle = canvas.getBoundingClientRect();

	/* Calculate the position of the 'mouse' within the 'canvas' */

	var x = event.clientX - rectangle.left;
	var y = event.clientY - rectangle.top;

	/* Check if 'new' node will be on top of old node (assume user is selecting 'old' node) */

	node_details.node_array.forEach(function(element) {

		if((element.x >= (x-40) && element.x <= (x+40)) && (element.y >= (y-40) && element.y <= (y+40)))
		{
			match_found = true;

			/* Redraw node circle in yellow to show it's highlighted */

			draw_circle(element.x, element.y, "yellow");
		}


	});

	if(use_map_flag == false) {

		/* Check if a new node is required or this is the first node (and a new node is required) */

		if(node_details.node_array.length == 0 || match_found == false) {

			draw_circle(x, y, "red");

			/* Get name of 'mind map' node from 'user' */

			var text = node_text(x, y, null);

			/* Draw arrow if there is more than one 'node' currently */

			if(node_details.node_array.length > 0)
			{
				draw_line(previous_node_x_position, previous_node_y_position, x, y);
			}

			/* Put the current 'click' position into an array */

			var current_node = {x : x, y : y, node_text : text, line_start_x : previous_node_x_position, line_start_y : previous_node_y_position, line_stop_x : x, line_stop_y : y};

			node_details.node_array.push(current_node);

		}

	}
	else
	{
		/* Redraw 'child nodes' and the user has clicked the 'paraent node' */

		edit_map();
	}

	previous_node_x_position = x;
	previous_node_y_position = y;
	
	/* Reset flag */

	match_found = false;

});

function draw_circle(x, y, colour) {
	ctx.beginPath();
	ctx.arc(x, y, 40, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.fillStyle = colour;
	ctx.fill();
}

function node_text(x, y, text) {

	if(text == null) {

		var node_name = prompt("Enter name of node", "node name");

	}
	else
	{
		node_name = text;
	}

	/* Adding Text to circles */

	ctx.fillStyle = "black";
	ctx.font = "16px sans-serif";		
	ctx.textBaseLine = 'top';
	ctx.fillText(node_name,x,y);

	return node_name;
}

function draw_line(start_x, start_y, finish_x, finish_y) {
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.moveTo(start_x, start_y);
	ctx.lineTo(finish_x, finish_y);
	ctx.stroke()
}

function use_map() {

	/* Create JSON object and put into 'local storage' (if the user has created a 'mind map') */

	if(node_details.node_array.length > 0) {

		localStorage.setItem('mind_map_data', JSON.stringify(node_details));

	}

	/* Contract all 'child nodes' to only show 'parent nodes' */

	/* Clear the 'canvas' */

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	/* Show node that is the 'first' in the list only */

	draw_circle(node_details.node_array[0].x, node_details.node_array[0].y, "red");

	/* Draw the */

	node_text(node_details.node_array[0].x, node_details.node_array[0].y, node_details.node_array[0].node_text);

	/* Set 'use_map' flag, which means when a user click on a parent node is does not generate any new nodes */

	use_map_flag = true;
}

function edit_map() {

	use_map_flag = false;

	/* Expand to show all 'child nodes' of the 'parent nodes' (which is the same as redrawing the 'mind map' from local storage) */

	var counter = 0;

	node_details.node_array.forEach(function(element) {

		/* Draw the 'node' circles */

		draw_circle(element.x, element.y, "red");

		/* Draw the 'node' text */

		node_text(element.x, element.y, element.node_text);

		if(counter > 0)
		{
			/* Draw the 'line' between each of the 'nodes' */

			draw_line(element.line_start_x, element.line_start_y, element.line_stop_x, element.line_stop_y);

		}

		counter++;

		/* Make sure the last drawn 'node' is placed in the 'previous_node' global variable */

		previous_node_x_position = element.x;

		previous_node_y_position = element.y;
		
	});

	/* Enable user to add extra 'parent' and 'child' nodes */

}