import React, { useEffect } from 'react';
import { MdOutlineLightMode  } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";


export default function TodoList() {
    const [workItems, setWorkItems] = React.useState([]);
    const [curFilter, setCurrentFilter] = React.useState('all');
    const [filteredItems, setFilteredItems] = React.useState([]);
    const [mode, setMode] = React.useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode || 'light';
    });
    
    useEffect(() => {
        const savedItems = localStorage.getItem('workItems');
        if(savedItems){
            const parsedItems = JSON.parse(savedItems);
            setWorkItems(parsedItems);
            changeFilter(curFilter, parsedItems);
        }
        
        // 다크모드 상태 복원
        if(mode === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('workItems', JSON.stringify(workItems));
        changeFilter(curFilter, workItems);
    }, [workItems, curFilter]);

    useEffect(() => {
        localStorage.setItem('darkMode', mode);
    }, [mode]);

    const handleSave = ()=>{
        const inputDesc = document.getElementById("todoDesc").value;
        console.log(inputDesc);
        if (inputDesc.trim() !== '') {
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
       setWorkItems(workItems.map(item => 
            item.idx === idx 
                ? {...item, completed: !item.completed}
                : item
        ));
    }

    const handleDel = (idx) => ()=>{
        setWorkItems(workItems.filter(item=>item.idx!=idx));
    };

    const handleModeChange = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        
        // DOM 클래스 토글
        document.body.classList.toggle('dark-mode');
    }

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
            <div className={`header ${mode === 'dark' ? 'dark-mode' : ''}`} id='header'>
                <ul className='mode' ><MdOutlineLightMode onClick={handleModeChange}/></ul>
                <ul className='filter'>
                    <button className='filter_btn' id='allBtn' onClick={handleViewAll} >All</button>
                    <button className='filter_btn' id='activeBtn' onClick={handleViewActive}>Active</button>
                    <button className='filter_btn' id='completedBtn' onClick={handleViewCompleted}>Completed</button>
                </ul>
            </div>
            <div className={`content ${mode === 'dark' ? 'dark-mode' : ''}`} id='content'>
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
            <div className={`footer ${mode === 'dark' ? 'dark-mode' : ''}`} id='footer'>   
                <input 
                    type="text" 
                    name="todoDesc" 
                    id="todoDesc" 
                    className={`todoDesc ${mode === 'dark' ? 'dark-mode' : ''}`}
                    onKeyDown={handleKeyDown}
                    placeholder="할 일을 입력하세요."
                />
                <input type="button" value="Add" className={`addButton ${mode === 'dark' ? 'dark-mode' : ''}`} id='addButton' onClick={handleSave}/>
            </div>
        </div>
    );
}

