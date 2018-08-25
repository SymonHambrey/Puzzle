// Global Variables
var grid_size=64;
var row_length=8;
var grid_number=[];
var player_score=0;
var computer_score=0;
var row_number=4;
var player_turn=true;

var beep=new Audio("beep.mp3");
var pop=new Audio("pop.mp3");
var score_sound=new Audio("beep2.mp3");
var negative_sound=new Audio("beep3.mp3");

// Mouse events
$(".blank_box")
  .mouseover(function(){
    if(player_turn){
      var box=$(this).attr("id");
      hover_on(box);
    }
  })
  .mouseleave(function(){
    $(".blank_box").css("border-color","#fff");
  })
  .click(function(){
    if(player_turn){
      var contents=$(this).attr("id");
      click_on(contents);
    }
  });

populate_numbers();
var random_grid_numbers=shuffle_numbers(grid_number);
place_numbers();

// Populate numbers -10 to +10
function populate_numbers(){
  var number=-10;
  for(i=0;i<grid_size;i++){
    grid_number[i]=number;
    if(number===10){
      number=-10;
    }
    if(number===-1){
      number=1;
    }
    number++;
  }
}

// Shuffle the array
function shuffle_numbers(array){
  var currentIndex=array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0!==currentIndex){

    // Pick a remaining element...
    randomIndex=Math.floor(Math.random()*currentIndex);
    currentIndex-=1;

    // And swap it with the current element.
    temporaryValue=array[currentIndex];
    array[currentIndex]=array[randomIndex];
    array[randomIndex]=temporaryValue;
  };
  return array;
};

// Place the numbers in the grid
function place_numbers(){
  var count=0;
  for(i=1;i<row_length+1;i++){
    for(j=1;j<row_length+1;j++){
      $("#column-"+i+"-"+j).text(random_grid_numbers[count]);
      if(random_grid_numbers[count]<0){
        $("#column-"+i+"-"+j).css("background-color","#E94646");
      }
      else{
        $("#column-"+i+"-"+j).css("background-color","#7CFC00");
      }
      count++;
    }
  }
}

function hover_on(box){
  // make sure only the players current row is playable
  var replace=box.substr(0,7)+row_number+box.substr(7+1)
  $("#"+replace).css("border-color","#000");
  beep.play();
}

function click_on(contents){
  var count=0;
  var replace=contents.substr(0,7)+row_number+contents.substr(7+1)
  var box_score=$("#"+replace).text();
  if(box_score===""){
    box_score=0;
  }
  var score=parseInt(box_score);
  score_increment(score, "player");
  $("#"+replace).text("").fadeOut(2000, function(){
    $(this).css("background-color","#fff").fadeIn("fast")
  });
  var column_number=parseInt(replace.charAt(9));
  if(score!==0){
    // stop player
    player_turn=false;
    setTimeout(function(){
      computer_turn(column_number);
      pop.play();
    },3000);
  }
}

function computer_turn(col_num){

  $(".blank_box").css("border-color","#fff");
  $("#player").css("color","#000").css("border-style","hidden");;
  $("#computer").css("color","#ff0000").css("border-style","solid");;
  // place values of column in array
  var column_array=[];
  var count=0;
  for(i=0;i<row_length;i++){
    var col_text=parseInt($("#column-"+(i+1)+"-"+col_num).text());
    if(isNaN(col_text)){
      col_text=-11; // -11 is below the values on the grid
      count++;
    }
    column_array[i]=col_text;
  }
  if(count===8){
    game_over();
  }

  // work out which is the largest number in the column and its position
  var largest=Math.max.apply(Math, column_array);
  var column_position=column_array.indexOf(largest)+1;

  // go to the highest number
  while(row_number!==column_position){
    if(row_number<column_position)
      row_number++;
    else
      row_number--;
    var row_column="#column-"+(row_number)+"-"+col_num;
    $(row_column).css("border-color","#000");
  }

  // remove number from grid
  $(row_column).text("").fadeOut(3000, function(){
    $(this).css("background-color","#fff").css("border-color","#000").fadeIn("fast")
  });;

  // score computer and return play to the player
  score_increment(largest, "computer");
  var check=check_play();
  if(check){
    setTimeout(function(){
      pop.play();
      $("#player").css("color","#ff0000").css("border-style","solid");
      $("#computer").css("color","#000").css("border-style","hidden");
      player_turn=true;
    },3000);
  }
  else{
    game_over();
  }
}

function game_over(){
  if(player_score<computer_score){
    alert("You Lost!");
  }
  else{
    alert("you Won!");
  }
  setTimeout(function(){
    location.reload();
  },3000);
}

function check_play(){
  var number_in_row=false;
  for(i=1;i<row_length+1;i++){
    var check=parseInt($("#column-"+row_number+"-"+i).text());
    if(!isNaN(check)){
      number_in_row=true;
    }
  }
  return number_in_row;
}

function score_increment(score_to_add, player_or_computer){
  setInterval(function(){
    if(score_to_add>0){
      if(player_or_computer==="player"){
        player_score++;
        $("#player_score").text(player_score);
      }
      if(player_or_computer==="computer"){
        computer_score++;
        $("#computer_score").text(computer_score);
      }
      score_sound.play();
      score_to_add--;
    }
    if(score_to_add<0){
      if(player_or_computer==="player"){
        player_score--;
        $("#player_score").text(player_score);
      }
      if(player_or_computer==="computer"){
        computer_score--;
        $("#computer_score").text(computer_score);
      }
      negative_sound.play();
      score_to_add++;
    }
    if(score_to_add===0){
      clearInterval(score_increment);
    }
  },200);
}
