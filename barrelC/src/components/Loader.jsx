
import { useEffect, useRef } from 'react';
import "./splashScreen.css";

const Loader = ({ progress }) => {
    const progressRef = useRef();

    useEffect(() => {
        progressRef.current.style.width = `${progress}%`
    }, [progress]);
    return (
        <div className='px-8 py-4 loader'>
            <p className='text-[#fcfcfc] font-semibold text-sm font-mono text'>Loading...</p>
            <div className='bg-[#050437] h-3.5  border border-[#B90000] rounded-full overflow-hidden progressBar'>
                <div ref={progressRef} className='loaderBg h-full rounded-full'></div>
                <div className='boltu'></div>
            </div>
        </div>
    );
}

export default Loader;
