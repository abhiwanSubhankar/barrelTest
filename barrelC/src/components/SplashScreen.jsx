import { useEffect, useState } from 'react';
import logo from "/lOGO.svg";
import Loader from './Loader';
import "./splashScreen.css";
import { useNavigate } from 'react-router-dom';


const SplashScreen = () => {

    const [progress, setProgress] = useState(1);
    const [showLoading, setShowLoading] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        let interval
        if (showLoading) {
            interval = setInterval(() => {
                // console.log("console running", progress);
                if (progress > 100) {
                    clearInterval(interval);
                    navigate("/game")
                    // history.replace("/home");
                } else {

                    setProgress((prev) => prev + 5)
                }
            }, 100);
        }

        return () => { clearInterval(interval) }
    }, [progress, showLoading])

    useEffect(() => {
        setTimeout(() => {
            setShowLoading(true);

        }, 1000)
    }, [])


    return (
        <div id='splashScreen' >

            <img src={logo}
                alt="logo"
                id='logoIcon'
            />

            <div className='loaderWrapper'>
                <Loader progress={progress} ></Loader>
            </div>

        </div>
    );
}

export default SplashScreen;
