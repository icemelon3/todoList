import React, { useEffect } from 'react';
import { HiMoon, HiSun } from "react-icons/hi";
import { FaTrashAlt } from "react-icons/fa";
import {useDarkMode} from '../context/DarkModeContext';

export default function TodoList() {
    const [workItems, setWorkItems] = React.useState([()=>getLocalStorageItems()]);
    const [curFilter, setCurrentFilter] = React.useState('all');
    const [filteredItems, setFilteredItems] = React.useState([]);
    const {darkMode, toggleDarkMode} = useDarkMode();
    
    /*useEffect(() => {

        const savedItems = JSON.parse(localStorage.getItem('workItems'));

        if(savedItems){
            const parsedItems = JSON.parse(savedItems);
            setWorkItems(parsedItems);
            changeFilter(curFilter, parsedItems);
        }
    }, []);

   useEffect(() => {
    console.log('workItems changed:');
       // localStorage.setItem('workItems', JSON.stringify(workItems));
        changeFilter(curFilter, workItems);
    }, [workItems]);*/

    const handleSave = ()=>{
        const inputDesc = document.getElementById("todoDesc").value;
        console.log(inputDesc);
        if (inputDesc.trim() !== '') {
            console.log('add item');
            setWorkItems([...workItems, {'idx':workItems.length+1, 'desc':inputDesc, 'status':'active', 'completed': false}])
            document.getElementById("todoDesc").value = '';
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    }


    const handleCheckboxChange = (idx) => {
        console.log('checkbox change: ', idx);
       setWorkItems(workItems.map(item => 
            item.idx === idx 
                ? {...item, completed: !item.completed}
                : item
        ));
    } 

    const handleDel = (idx) => ()=>{
        console.log('delete item: ', idx);
        setWorkItems(workItems.filter(item=>item.idx!=idx));
    };


    const changeFilter = (filter, items)=>{
        switch(filter){
            case 'all':
                setFilteredItems(items)
                break;
            case 'active':
                setFilteredItems(items.filter(item => !item.completed));
                break;
            case 'completed':
                setFilteredItems(items.filter(item => item.completed));
                break;
;        }
    }

    const handleViewAll = () => {
        console.log('all');
        setCurrentFilter('all')
        setFilteredItems(workItems);
    }

    const handleViewActive = () => {
        console.log('active');
        setCurrentFilter('active')
        setFilteredItems(workItems.filter(item => !item.completed));
    }

    const handleViewCompleted = () => {
        console.log('completed');
        setCurrentFilter('completed');
        setFilteredItems(workItems.filter(item => item.completed));
    }

    return (
        <div className='todo-list-layer'>
            <div className={`header`} id='header'>
                <button className='mode' onClick={toggleDarkMode}>{!darkMode ? <HiMoon/> : <HiSun/>}</button>
                <ul className='filter'>
                    <button className='filter_btn' id='allBtn' onClick={handleViewAll} >All</button>
                    <button className='filter_btn' id='activeBtn' onClick={handleViewActive}>Active</button>
                    <button className='filter_btn' id='completedBtn' onClick={handleViewCompleted}>Completed</button>
                </ul>
            </div>
            <div className={`content`} id='content'>
                <ul className='todoItems'>
                    {Array.isArray(filteredItems) && filteredItems.length > 0 && filteredItems.map((e)=>(
                     <li className='todoItem' key={e.idx}>
                         <div className={`todo-content ${e.completed ? 'completed' : ''}`}>
                             <input 
                                 type="checkbox" 
                                 name={`checkbox${e.idx}`} 
                                 id={`checkbox${e.idx}`} 
                                 checked={e.completed}
                                 onChange={() => handleCheckboxChange(e.idx)} 
                             />
                             <label htmlFor = {`checkbox${e.idx}`} >{e.desc}</label>
                         </div>
                         <FaTrashAlt className='delIcon' onClick={handleDel(e.idx)}/>
                         
                     </li>
                     ))}
                </ul>
                </div>
            <div className={`footer`} id='footer'>   
                <input 
                    type="text" 
                    name="todoDesc" 
                    id="todoDesc" 
                    className={`todoDesc`}
                    onKeyDown={handleKeyDown}
                    placeholder="할 일을 입력하세요."
                />
                <input type="button" value="Add" className={`addButton`} id='addButton' onClick={handleSave}/>
            </div>
        </div>
    );
}

function getLocalStorageItems(){
    const todos = localStorage.getItem('workItems');
    return todos?JSON.parse(todos):[];
}