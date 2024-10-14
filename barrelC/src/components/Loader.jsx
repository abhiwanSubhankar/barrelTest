
import { useEffect, useRef } from 'react';
import "./splashScreen.css";

const Loader = ({ progress }) => {
    const progressRef = useRef();

    useEffect(() => {
        progressRef.current.style.width = `${progress}%`
    }, [progress]);
    return (
        <div className=' loader'>
            <p className='' style={{
                textAlign: "center"
            }}>Loading...</p>
            <div className=''>
                <div ref={progressRef} className='loaderBg h-full rounded-full'></div>
                <div className='boltu'></div>
            </div>
        </div>
    );
}

export default Loader;
