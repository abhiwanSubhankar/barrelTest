
import { useEffect, useRef } from 'react';
import "./splashScreen.css";

const Loader = ({ progress }) => {
    const progressRef = useRef();

    useEffect(() => {
        progressRef.current.style.width = `${progress}%`
    }, [progress]);
    return (
        <div className='loader'>
            <p className='text'>Loading...</p>
            <div className='progressBar'>
                <div ref={progressRef} className='loaderBg'></div>
                <div className='boltu'></div>
            </div>
        </div>
    );
}

export default Loader;
