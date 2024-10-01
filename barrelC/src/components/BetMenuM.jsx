
const BetMenuM = ({
    currentCoins,
    gameMode,
    started,
    betAmount,
    setBetAmount,
    handlePlaceBet,
    setGameMode
}) => {


    return (<div style={{
        width:"100%",
        height: "100vh"
    }}>
        <div>
            <img src="/lOGO.svg" alt="logo" width={"60%"} />
        </div>

        <div>
            <div>
                <h3>Balance</h3>
                <h4 className='balance'>{currentCoins}</h4>
                <br />
                {gameMode !== "practice" && <h3>Bet Size</h3>}

                {gameMode !== "practice" && <div className='betAmountWrapper'>

                    <button className='incdecButton' disabled={started} onClick={() => {
                        betAmount > 0 && setBetAmount((pre) => pre - 1)
                    }}>
                        <img src="/minus.svg" alt="plus" />
                    </button>

                    <input
                        type="number"
                        className='balance'
                        placeholder='Enter Bet Amount'
                        min={0}
                        max={10000000}
                        disabled={started}
                        value={betAmount}
                        onKeyDown={(e) => {
                            // Prevent the 'e' key from being typed
                            if (e.key === 'e' || e.key === 'E' || e.key === "-") {
                                e.preventDefault();
                            }
                            // console.log(e.key);

                        }}
                        onChange={(e) => {

                            let val = +e.target.value;

                            if (val > 0 && val < 1000000) {
                                setBetAmount(val)
                            }

                        }} />

                    <button className='incdecButton' disabled={started} onClick={() => {
                        setBetAmount((pre) => +pre + 1)
                    }}>
                        <img src="/plus.svg" alt="plus" />
                    </button>
                </div>}

            </div>

            <br />
            {gameMode !== "practice" && <button onClick={handlePlaceBet} className='button' disabled={started}>Place Bet</button>}

            <button
                //    onClick={handlePlaceBet} 
                className='button'>connect wallet</button>

            <div>
                <h4>Selected Game Mode :- {gameMode}</h4>
                <select name="" id="" className='balance'
                    disabled={started}
                    value={gameMode}
                    onChange={(e) => {
                        setGameMode(e.target.value)
                        sessionStorage.setItem("gameMode", e.target.value);
                    }}>
                    <option value="">Selet Game mode</option>
                    <option value="practice"> practice</option>
                    <option value="normal">Normal</option>
                </select>
            </div>
        </div>
    </div>)
};

export default BetMenuM;