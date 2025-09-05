import React from 'react';
import { MdOutlineLightMode  } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { CgLayoutGrid } from 'react-icons/cg';
import { CiTurnL1 } from 'react-icons/ci';

export default function TodoList() {
    const [workItems, setWorkItems] = React.useState([]);
    const [filteredItems, setFilteredItems] = React.useState([]);
    const [currentFilter, setCurrentFilter] = React.useState('all');
    
    // localStorage에서 데이터 불러오기
    React.useEffect(() => {
        const savedItems = localStorage.getItem('todoItems');
        if (savedItems) {
            const parsedItems = JSON.parse(savedItems);
            setWorkItems(parsedItems);
            setFilteredItems(parsedItems);
        }
    }, []);

    // workItems가 변경될 때마다 localStorage에 저장하고 필터링 적용
    React.useEffect(() => {
        localStorage.setItem('todoItems', JSON.stringify(workItems));
        applyFilter(currentFilter, workItems);
    }, [workItems, currentFilter]);
    
    const handleSave = ()=>{
        const inputDesc = document.getElementById("todoDesc").value;
        if (inputDesc.trim() !== '') {
            setWorkItems([...workItems, {'idx':workItems.length+1, 'desc':inputDesc, 'status':'active', 'completed': false}])
            document.getElementById("todoDesc").value = '';
            console.log(workItems);
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

    const handleDelete = (idx) => {
        setWorkItems(workItems.filter(item => item.idx !== idx));
    }

    const applyFilter = (filter, items) => {
        switch(filter) {
            case 'active':
                setFilteredItems(items.filter(item => !item.completed));
                break;
            case 'completed':
                setFilteredItems(items.filter(item => item.completed));
                break;
            default:
                setFilteredItems(items);
        }
    }

    const handleViewAll = () => {
        setCurrentFilter('all');
        setFilteredItems(workItems);
    }

    const handleViewActive = () => {
        setCurrentFilter('active');
        setFilteredItems(workItems.filter(item => !item.completed));
    }

    const handleViewCompleted = () => {
        setCurrentFilter('completed');
        setFilteredItems(workItems.filter(item => item.completed));
    }

    return (
        <div className='todo-list-layer'>
            <div className='header' id='header'>
                <ul className='mode' ><MdOutlineLightMode /></ul>
                <ul className='filter'>
                    <button className='filter_btn' id='allBtn' onClick={handleViewAll}>All</button>
                    <button className='filter_btn' id='activeBtn' onClick={handleViewActive}>Active</button>
                    <button className='filter_btn' id='completedBtn' onClick={handleViewCompleted}>Completed</button>
                </ul>
            </div>
            <div className='content' id='content'>
                <ul className='todoItems'>
                    {filteredItems.map((e)=>(
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
                         <FaTrashAlt className='delIcon' onClick={() => handleDelete(e.idx)} />
                         
                     </li>
                     ))}
                </ul>
                </div>
            <div className='footer' id='footer'>   
                <input 
                    type="text" 
                    name="todoDesc" 
                    id="todoDesc" 
                    className='todoDesc'
                    onKeyDown={handleKeyDown}
                    placeholder="할 일을 입력하세요"
                />
                <input type="button" value="Add" className='addButton' onClick={handleSave}/>
            </div>
        </div>
    );
}

