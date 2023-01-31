import {useRef, useState} from 'react';
import {BsTrash} from 'react-icons/bs';
import {AiOutlineEdit} from 'react-icons/ai';
import './App.css';

function App() {
  // states and consts

  const [tasks, setTasks] = useState([]);
  const [inputTask, setInputTask] = useState('');
  const [done, setDone] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const dragStart = useRef(null);
  const dragEnter = useRef(null);

  // handle add click button, adding a task to the board.
  const handleAddClick = () => {
    // prevent adding task without any value;
    if (!inputTask) return;

    // update main tasks array with newTask;
    setTasks((prev) => [...prev, inputTask]);

    // reset input state for each add.
    setInputTask('');
  };

  const handleClearButton = () => {
    // clear main tasks array if confirmation pass;
    if (confirmation) {
      setTasks([]);
    }

    // set confirmation timer;
    setTimeout(() => {
      // fail confirmation after timer;
      setConfirmation(false);
    }, 1000);
    // pass confirmation;
    setConfirmation(true);
  };

  // handle task element click, toggling between done and undone.
  const handleTaskClick = (target) => {
    // verify if task already done or undone to toggle bettewn done and undone;
    if (done.some((d) => d === target)) {
      const newDone = done.filter((d) => d !== target);
      // update done tasks array if done;
      return setDone([...newDone]);
    }
    // update done tasks array if undone.
    return setDone((prev) => [...prev, target]);
  };

  // handle delete button click, deleting targeted task of the board.
  const handleDeleteClick = (event, e) => {
    // stop event on the children elements;
    event.stopPropagation();

    // remove and update main tasks array.
    setTasks(() => {
      const newTasks = tasks.filter((t) => t !== e);
      return [...newTasks];
    });
  };

  const handleEditClick = (event) => {
    // not implemented.
    event.stopPropagation();
  };

  // handle draggable status, changing position as the user drag a item.
  const handleDragEnd = () => {
    // copy tasks array;
    let newTasks = [...tasks];

    // remove and save the dragged item;
    const saved = newTasks.splice(dragStart.current, 1)[0];

    // switch positions beteewn tasks;
    newTasks.splice(dragEnter.current, 0, saved);

    // update the main array with switched tasks;
    setTasks([...newTasks]);

    // reset refs.
    dragStart.current = null;
    dragEnter.current = null;
  };

  return (
    <>
      <div className="toolsSection">
        <input
          type="text"
          name="taskInput"
          id="taskInput"
          value={inputTask}
          onChange={({target}) => setInputTask(target.value)}
          placeholder="write something"
        />
        <button
          className="addButton"
          onClick={handleAddClick}
          disabled={!!inputTask ? false : true}
        >
          ➕
        </button>
        <button
          className={confirmation ? 'confirmation' : 'clearButton'}
          disabled={tasks.length > 0 ? false : true}
          onClick={handleClearButton}
        >
          {confirmation ? '✅' : '🧹'}
        </button>
      </div>
      <div className="task-container">
        {tasks?.map((e, index) => {
          return (
            <div
              className={!!done.find((d) => d === e) ? 'done' : 'tasks'}
              draggable
              key={e + index}
              onClick={() => handleTaskClick(e)}
              onDragEnd={(e) => handleDragEnd(e, index)}
              onDragStart={() => (dragStart.current = index)}
              onDragEnter={() => (dragEnter.current = index)}
              onDragOver={(e) => e.preventDefault()}
              value={e}
            >
              <p draggable={false}>{e}</p>
              <AiOutlineEdit
                className="button editButton"
                onClick={(event) => handleEditClick(event)}
                draggable={false}
              />
              <BsTrash
                draggable={false}
                className="button deleteButton"
                onClick={(event) => handleDeleteClick(event, e)}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
