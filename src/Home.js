import NavBar from './components/Nav/NavBar.js'
import Keyboard from './components/Keyboard/Keyboard.js'
import Grid from "./components/Grid/Grid.js"
import GameOver from "./components/Popups/GameOver/GameOver.js"
import GetData from './components/GetData.js'
import Giveup from './components/Popups/Giveup/Giveup.js'
import Share from './components/Popups/Share/Share.js'
import React, { createContext, useState, useEffect } from "react" 
import { useNavigate } from 'react-router-dom'
import "./Home.css"

export const AppContext = createContext()

const Home = (props) =>  {

    const [grid, setGrid] = useState([
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
      ])
    const [currAttempt, setCurrAttempt] = useState({currRow: 0, currCol: 0})
    const [gameOver, setGameOver] = useState({gameOver:false, winner:false})
    const wordBank = require(`./components/WordBank.json`).wordbank
    const guessBank = require(`./components/GuessBank.json`).guessbank
    const [currWord, setCurrWord] = useState("")
    const [error, setError] = useState({errorState:false, errorMessage:""})
    const [disabledLetters, setDisabledLetters] = useState([])
    const [giveUp, setGiveUp] = useState(false)
    const [share, setShare] = useState(false)
    const [sharePage, setSharePage] = useState(props.sharePage)
    const [scrollHeight, setScrollHeight] = useState(0)
    const [okLetters, setOkLetters] = useState({green: [], yellow: []})
    const navigate = useNavigate()
    let sharedWord = props.sharedWord
    if (sharedWord !== undefined){sharedWord = sharedWord.toUpperCase()}

    useEffect(() => {
        GetData()
        if (sharePage){
            setCurrWord(sharedWord)
        }
        else{
        getWord().then((word) => {
            console.log(word)
            setCurrWord(word);
        })}
      }, []);

    useEffect(() => {
        setInterval(()=>{
            setScrollHeight(window.pageYOffset)
        }, 2000)
    }, [])


    function getWord(){
        return new Promise((resolve, reject) => {
            const randNum = Math.floor(Math.random() * wordBank.length)
            let word = wordBank[randNum]
            let letters = []
            for (let i = 0; i < word.length; i++){
                letters.push(word[i].toUpperCase())
            }
            console.log("Answer", letters.join(''))
            resolve(letters.join(''))
        })
    }
    function checkAnswer(){
        if (share === false && giveUp === false){
            let word = []
            for (let i = 0; i < grid[currAttempt.currRow].length; i++){
                word.push(grid[currAttempt.currRow][i].toLowerCase())
            }
            let valid = guessBank.includes(word.join('')) || wordBank.includes(word.join(''))
            if (currWord === grid[currAttempt.currRow].join('')){
                valid = true
            }

            if (valid){
                if (currAttempt.currRow < 6){
                    if (currWord === grid[currAttempt.currRow].join('')){
                        setGameOver({gameOver:true, winner:true})
                    }
                    else if (currWord !== grid[currAttempt.currRow].join('') && currAttempt.currRow+1 === 6){
                        setGameOver({gameOver:true, winner:false})
                    }
                    else{
                        setCurrAttempt({currRow: currAttempt.currRow + 1, currCol: 0})

                        let tmpOkLetters = okLetters // here is temporary variable to make changes in loop

                        for (let i = 0; i < grid[currAttempt.currRow].length; i++){
                            if (!disabledLetters.includes(grid[currAttempt.currRow][i])){
                                if (currWord[i] === grid[currAttempt.currRow][i]){
                                        tmpOkLetters = {...tmpOkLetters, green: [...tmpOkLetters.green, grid[currAttempt.currRow][i]]}
                                        if (okLetters.yellow.includes(grid[currAttempt.currRow][i])){
                                            // remove   grid[currAttempt.currRow][i] from yellow list
                                            tmpOkLetters = {...tmpOkLetters, yellow: tmpOkLetters.yellow.filter(letter => letter !== grid[currAttempt.currRow][i])}
                                        }
                                }
                                else if (currWord.includes(grid[currAttempt.currRow][i])){
                                    if (!okLetters.green.includes(grid[currAttempt.currRow][i])){
                                        tmpOkLetters = {...tmpOkLetters, yellow: [...tmpOkLetters.yellow, grid[currAttempt.currRow][i]]}
                                   }
                                }
                                else{
                                    setDisabledLetters(disabledLetters => [...disabledLetters, grid[currAttempt.currRow][i]])
                                }   
                            }
                        }
                        setOkLetters(tmpOkLetters)
    
                    }
                }
            }
            else if (currAttempt.currCol < 5){
                setError({errorState:true, errorMessage:"Too Short"})
            }
            else if (currAttempt.currCol === 5){
                setError({errorState:true, errorMessage:"Word Not Found"})
            }
        }



    }

    function restartGame(){
        //set everything back to default
        setGrid([
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
          ])
          // add 1 to games in localstorage
        setOkLetters({green: [], yellow: []})
        setSharePage(false)
        setError({errorState:false,errorMessage:""})
        setShare(false)
        setCurrAttempt({currRow: 0, currCol: 0})
        setGameOver({gameOver:false, winner:false})
        setGiveUp(false)
        setDisabledLetters([])
        
        // get new word
        const randNum = Math.floor(Math.random() * wordBank.length)
        let word = wordBank[randNum]
        let letters = []
        for (let i = 0; i < word.length; i++){
            letters.push(word[i].toUpperCase())
        }
        setCurrWord(letters.join(''))
        navigate('/')
    }
    
    function addKey(k){
        if (share === false && giveUp === false){
            let newGrid = [...grid]
            newGrid[currAttempt.currRow][currAttempt.currCol] = k
            setGrid(newGrid)
            setCurrAttempt({...currAttempt, currCol: currAttempt.currCol+1})
        }
    }

    function deleteKey(){
        let newGrid = [...grid]
        newGrid[currAttempt.currRow][currAttempt.currCol - 1] = ""
        setGrid(newGrid)
        setCurrAttempt({...currAttempt, currCol: currAttempt.currCol-1})
        if (error.state === true){
            setError({errorState:false, errorMessage:""})
        }
    }

    function callError(){
        if (share === false && giveUp === false){
            alert(error.errorMessage)
            setError({errorState:false,errorMessage:""})
        }
    }

    function giveup(){
        setGiveUp(true)
    }

    function shareFunc(){
        console.log('hi')
        setShare(true)
    }
    return (
        <div className="Home">
            {scrollHeight < 65 ?
            <NavBar />
            : null}
            <AppContext.Provider value=
                {{
                    grid, 
                    setGrid,
                    currAttempt,
                    setCurrAttempt,
                    wordBank,
                    currWord,
                    checkAnswer,
                    addKey,
                    deleteKey,
                    gameOver,
                    restartGame,
                    disabledLetters,
                    share,
                    setShare,
                    okLetters

                }}>
                <div className="display">
                    <div className="btn-row">
                        {!giveUp ? 
                        <button onClick={() => giveup()} class="btn" role="button">Give Up</button>
                        : null}

                        {!share && sharePage !== true ?
                        <button onClick={() => shareFunc()} class="btn" role="button">Share?</button>
                        : null}
                    </div>

                    <div className="g-pop">
                        {giveUp ? <Giveup/> : null}
                    </div>
                    <div className="s-pop">
                        {share && sharePage !== true ? <Share/> : null}
                    </div>

                    <Grid/>
                    {gameOver.gameOver ? <GameOver/> : <Keyboard/>}
                    
                </div>
            </AppContext.Provider>

            <div className="error">
                {error.errorState ?
                callError()
                // <Alert className="error"onClose={() => {setError({errorState:false,errorMessage:""})}} severity="error">
                //     <AlertTitle>{error.errorMessage}</AlertTitle>

                : null}
            </div>
            <div className="text-center p-3 footer" style={{backgroundColor: "#6e6b6b"}}>
                        © 2022 Copyright:
                        <a className="text-reset fw-bold"> Thavas Antonio</a>
                    </div>

        </div>
  )
}

export default Home