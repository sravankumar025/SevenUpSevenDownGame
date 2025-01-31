import React, { useState,useRef } from "react";
import axios from "axios";
import {Typography, ButtonGroup, Button, Card, CardContent} from "@mui/material";
import Box from '@mui/material/Box';
import Dice from "react-dice-roll";
import confettiGif from './confetti.gif';
import LostImg from './LostImg.jpg';

const Sevenupsevendown=()=>{
const [pointsOfPlayer, setPointsOfPlayer]=useState(5000);
const [playerBetAmount, setPlayerBetAmount]=useState(100);
const [playerBetChoice, setPlayerBetChoice]=useState("SevenUp");
const [dice, setDice]=useState({firstDice:1, secondDice:1, sumOfDice:9});
const [displayMessage, setDisplayMessage]=useState("");
const [gameStatus, setGameStatus]=useState("");

const diceRef1=useRef(null);
const diceRef2=useRef(null);

const rollDiceHandler=async ()=>{
    setGameStatus("");
    setDisplayMessage("");
    if(pointsOfPlayer<=0){
        setDisplayMessage("Game Over! As you have 0 points.");
        return;
    }
    try {
        const responseOfRoll = await axios.get("http://localhost:8080/diceroll");
        const {firstDice,secondDice,sumOfDice}=responseOfRoll.data;
        setDice({firstDice,secondDice,sumOfDice});


        diceRef1.current.rollDice(firstDice);
        diceRef2.current.rollDice(secondDice);

        const rollResponseResult=await axios.post("http://localhost:8080/playerbettingresult",{
            bettingAmount:playerBetAmount,
            userChoice: playerBetChoice,
            sumOfDice
        });


        setTimeout(()=>{
            setPointsOfPlayer(rollResponseResult.data.playerbalance);
            setDisplayMessage(`You won ${rollResponseResult.data.winnings} points`);

        if(rollResponseResult.data.isWin){
            setGameStatus("Win");
        }else{
            setGameStatus("Lost");
        }
        },1000);
        
    } catch (error) {
        console.error("Error in rolling dice please try again later on ", error);
        
    }
console.log(gameStatus,'gamestatus');

}

return(
<Box component="section" sx={{height:"100vh",backgroundColor:"#f4f4f4"}}>
<Card sx={{ maxWidth: 450, height:"100%", textAlign: "center", boxShadow: 3 }}>
<CardContent>
<Typography variant="h5" gutterBottom>
    🎲 7 Up 7 Down Game 🎲
    </Typography>
    <Box component="section" sx={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
            <Typography variant="h6">Balance: {pointsOfPlayer} points</Typography>
            
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Select your Bet Amount</Typography>
            <ButtonGroup fullWidth>
                {[100,200,500].map((amount)=>(
                    <Button 
                        key={amount}
                        variant={playerBetAmount==amount?"contained":"outlined"}
                        onClick={()=>setPlayerBetAmount(amount)}
                        sx={{borderRadius:"50px"}}>
                        {amount}
                    </Button>
                ))}
            </ButtonGroup>
            
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Select your Bet choice</Typography>
            <ButtonGroup fullWidth>
                {["SevenDown","Seven","SevenUp"].map((choice)=>(
                    <Button 
                        key={choice}
                        variant={playerBetChoice==choice?"contained":"outlined"}
                        onClick={()=>setPlayerBetChoice(choice)}
                        sx={{borderRadius:"50px"}}>
                        {choice === "SevenDown" ? "7 Down" : choice === "Seven" ? "Lucky 7" : "7 Up"}
                    </Button>
                ))}
            </ButtonGroup>


            <Box sx={{mt:3, display: "flex", justifyContent: "center", gap: 5 }}>
            
            <Dice ref={diceRef1} size={55}/>
            <Dice ref={diceRef2} size={55}/>

          </Box>
          <Typography sx={{mt:2}}>NUMBER : {dice.sumOfDice}</Typography>
          
            <Button variant="contained" color="primary"  fullWidth sx={{ mt: 3 }} disabled={pointsOfPlayer <= 0} onClick={rollDiceHandler}>
                Roll Dice
            </Button>
             </Box>

            <Box sx={{pt:"30px"}}>
             {displayMessage && (
            
              <Typography variant="h5" align="center">{displayMessage}</Typography>
            )}
              </Box>
          
          <Box>
            {gameStatus=="Win"&&(
                <div style={{position:"relative"}}>
                    
                    <img src={confettiGif} alt="Congratulations" 
                          style={{
                                 width:"100%",
                                 height:"100%"
                          }}/>
                          <Typography variant="h4" style={{top:"50%", left:"50%",position:"absolute", transform:"translate(-50%,-50%)"}}>You Won</Typography>
                </div>
            )}

            {gameStatus=="Lost" &&(
                 <div>
                 <Typography variant="h4" >You Lost 😞</Typography>
             </div>
            )}
          </Box>

</CardContent>
</Card>
</Box>
)
}

export default Sevenupsevendown;