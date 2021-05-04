// Tanishq
//Create variables here
var gameState,readState;
var b,g,w
var di1,di2;
var database;
var dog,dogImg,dogImg1;
var lastFed, fedTime;
var foodS,foodStock;
var feed;
var addFood;
var currentTime;
var foodStock;

function preload()
{
	di1=loadImage("images/dogImg.png");
  di2=loadImage("images/dogImg1.png");
  b=loadImage("images/Bed Room.png")
  w=loadImage("images/washroom.png")
  g=loadImage("images/Garden.png")
}

function setup() {
	createCanvas(800, 700);
  database=firebase.database();
  
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();
  dog=createSprite(250,300,150,150);
  dog.addImage(di1);
  dog.scale=0.15;

  readState = database.ref("gameState")
  readState.on("value",(data)=>{gameState = data.val()})

  fedTime=database.ref("FeedTime");
  fedTime.on("value",(data)=>{
    lastFed=data.val();
  });
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("add the food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
background(46,139,87);
currentTime=hour();
if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
 }else if(currentTime==(lastFed+2)){
  update("Sleeping");
    foodObj.bedroom();
 }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
    foodObj.washroom();
 }else{
  update("Hungry")
  foodObj.display();
 }
 
 if(gameState!="Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
  feed.show();
  addFood.show();
  dog.addImage(di2);
 }

}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(di1);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
