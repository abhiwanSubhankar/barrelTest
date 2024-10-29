
const BetMenuM = ({
    currentCoins,
    gameMode,
    started,
    betAmount,
    setBetAmount,
    handlePlaceBet,
    setGameMode,
    deviceType,
    handleChange,
    handleShowConnectModal,
    userData,
}) => {


    return (<div className="sidebar" style={{
        width: "100%",
        height: "100vh"
    }}>
        <div>
            <img src="/lOGO.svg" alt="logo" width={"60%"} draggable={false} />
        </div>

        <div>
            <div>
                <h3>BALANCE</h3>
                <h4 className='balance'>{currentCoins}</h4>
                <br />
                {gameMode !== "practice" && <h3>BET SIZE</h3>}

                {gameMode !== "practice" && <div className='betAmountWrapper'>

                    <button className='incdecButton' disabled={started || betAmount.status} onClick={() => {
                        betAmount.betAmount > 0 && setBetAmount((pre) => { return { ...betAmount, betAmount: +pre.betAmount - 1 } })
                    }}>
                        <img src="/minus.svg" alt="plus" />
                    </button>

                    <input
                        type="number"
                        id={"numberInput"}
                        className='balance'
                        placeholder='Enter Bet Amount'
                        min={1}
                        max={10000000}
                        disabled={started || betAmount.status}
                        value={betAmount.betAmount}
                        step="1"
                        onKeyDown={(e) => {
                            // Prevent the 'e' key from being typed
                            if (e.key === 'e' || e.key === 'E' || e.key === "-" || e.key === ".") {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) => handleChange(e)}
                    />

                    <button className='incdecButton' disabled={started || betAmount.status} onClick={() => {
                        setBetAmount((pre) => { return { ...betAmount, betAmount: +pre.betAmount + 1 } })
                    }}>
                        <img src="/plus.svg" alt="plus" />
                    </button>
                </div>}

            </div>

            <br />
            {gameMode !== "practice" && <button onClick={handlePlaceBet} className='button' disabled={started || betAmount?.status}>PLACE BET</button>}

            {gameMode === "practice" && deviceType === "mobile" && <button onClick={handlePlaceBet} className='button' disabled={started}>START PLAY</button>}

            <button
                onClick={handleShowConnectModal}
                disabled={userData ? true : false}
                className='button'>CONNECT WALLET</button>

            <div>
                <h4>SELECTED GAME MODE :- {gameMode === "normal" ? "NORMAL" : "PRACTICE"}</h4>
                <select name="" id="" className='balance'
                    disabled={started}
                    value={gameMode}
                    onChange={(e) => {
                        setGameMode(e.target.value)
                        sessionStorage.setItem("gameMode", e.target.value);
                    }}>
                    <option value="">SELECT GAME MODE</option>
                    <option value="practice"> PRACTICE </option>
                    <option value="normal">NORMAL</option>
                </select>
            </div>
        </div>
    </div>)
};

export default BetMenuM;