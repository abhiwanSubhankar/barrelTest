import { useState } from "react";

function Game() {
    const [keyCode, setKeyCode] = useState(null);

    // useEffect(()=>{
    window.addEventListener("onkeydown", (e) => {  
        console.log(e);
    })
    // })
    //     },[])

    return <div>
        main game.
        key Code {":=>"} {keyCode}
    </div>
}

export default Game;