import { createContext,useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export function DarkModeProvoider({children}){
    const [darkMode, setDarkMode] = useState(false);
    
    const updateDarkMode = (darkMode) => {
        if(darkMode){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark');
        }
    }
    
    const toggleDarkMode = ()=>{
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        updateDarkMode(newDarkMode);
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    }
    
    useEffect(()=>{
        const isDark = localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        updateDarkMode(isDark);
    }, []);

    return(
        <DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>{children}</DarkModeContext.Provider>
    );
    }

export const useDarkMode = () => useContext(DarkModeContext);