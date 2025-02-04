const express=require("express");
const cors=require("cors");
const {Random}=require("random-js");
//Random-js is a library that provides random numbers
const random=new Random();
const app=express();
app.use(express.json());
app.use(cors());


//This is the api call for generating two dice numbers and the sum of the numbers
app.get("/diceroll",(req,res)=>{
    const firstDice=random.integer(1,6);
    const secondDice=random.integer(1,6);
    const sumOfDice=firstDice+secondDice;

    res.json({firstDice,secondDice,sumOfDice});
})


let playerInitialPoints=5000;
//This is the api call for the player result which results in win or lost based on the bet amount and sum of the dice number
app.post("/playerbettingresult",(req,res)=>{
    const {bettingAmount,userChoice,sumOfDice}=req.body;
    console.log(req.body);
    if(playerInitialPoints<=0){
      return res.json({
            message:"You cannot place bet as your balance is 0",
            isWin:false
        })
    }
    let winningAmount=0;
    let isWin=false;
    //Here player starts with initial 5000 points and if he starts betting with 200 amount and selected 7Down
    //The bet amount will be deducted from 5000 points --
    //if he wins he gets double which is 400 which becomes 5200 of total
    playerInitialPoints-=bettingAmount;

    if((userChoice=='SevenUp' && sumOfDice>7) || (userChoice=='SevenDown' && sumOfDice<7)){
        winningAmount+=bettingAmount*2;
        isWin=true;
    }else if(userChoice=='Seven' && sumOfDice==7){
        winningAmount+=bettingAmount*5;
        isWin=true;
    }

    playerInitialPoints+=winningAmount;

    res.json({playerbalance:playerInitialPoints<=0?"You cannot place bet as your balance is 0":playerInitialPoints,
              winnings:winningAmount,
            isWin:isWin,
          message:isWin?"You Won!":"You Lost"})
})

//Server to start at a port 8080
const port=8080;
app.listen(port,()=>console.log('Server Started'));
