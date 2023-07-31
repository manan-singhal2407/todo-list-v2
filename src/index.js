import ReactDOM from "react-dom";
import { useState } from "react";

function App() {
	const [item, setItem] = useState("");
	const [priority, setPriority] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [todos, setTodos] = useState([]);
	const [editId, setEditId] = useState(-1);
	const [editItem, setEditItem] = useState("");
	const [search, setSearch] = useState("");

	const [filterPriority, setFilterPriority] = useState("");
	const [sortShow, setSortShow] = useState("");
	const [filterDueDateFrom, setFilterDueDateFrom] = useState("");
	const [filterDueDateTo, setFilterDueDateTo] = useState("");

	const addTodo = () => {
		const id = todos.length === 0 ? 0 : todos[todos.length - 1].id + 1;
		setTodos([...todos, { task: item, priority: priority, due_date: dueDate, id: id, mark_as_done: false }]);
		setItem("");
		setPriority("");
		setDueDate("");
	}

	const editTodo = (index) => {
		const updatedTodos = [...todos];
		updatedTodos[index].task = editItem;
		setTodos(updatedTodos);
		setEditId(-1);
		setEditItem("");
	}

	const deleteTodo = (index) => {
		const updatedTodos = todos.filter((_, i) => i !== index);
		setTodos(updatedTodos);
	}

	const toggleMarkTodo = (index) => {
		const updatedTodos = [...todos];
		updatedTodos[index].mark_as_done = !updatedTodos[index].mark_as_done;
		setTodos(updatedTodos);
	}

	const updatePriority = (index, value) => {
		const updatedTodos = [...todos];
		updatedTodos[index].priority = value;
		setTodos(updatedTodos);
	};

	const updateDueDate = (index, dueDateUpdated) => {
		const updatedTodos = [...todos];
		updatedTodos[index].due_date = dueDateUpdated;
		setTodos(updatedTodos);
	}

	const searchedTodos = (todos) => {
		const searchWords = search.toLowerCase().trim().split(" ");
		return todos.filter((todo) => {
			for (const word of searchWords) {
				if (!todo.task.toLowerCase().includes(word)) {
					return false;
				}
			}
			return true
		});
	}

	const filteredTodos = (todos) => {
		var searchedTodoList = searchedTodos(todos);
		if (filterPriority !== "") {
			searchedTodoList = searchedTodoList.filter(todo => todo.priority === filterPriority);
		}
		if (sortShow === "MAD") {
			searchedTodoList = searchedTodoList.filter(todo => todo.mark_as_done === true);
		} else if (sortShow === "MAU") {
			searchedTodoList = searchedTodoList.filter(todo => todo.mark_as_done === false);
		}
		if (filterDueDateFrom !== "") {
			searchedTodoList = searchedTodoList.filter(todo => todo.due_date >= filterDueDateFrom);
		}
		if (filterDueDateTo !== "") {
			searchedTodoList = searchedTodoList.filter(todo => todo.due_date <= filterDueDateTo);
		}
		return searchedTodoList;
	}

	const today = new Date().toISOString().slice(0, 10);

	return (
		<>
			<input type="text" value={item} onChange={(e) => { setItem(e.target.value) }} />
			<select value={priority} onChange={(e) => setPriority(e.target.value)}>
				<option value="">Priority</option>
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
			</select>
			<input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} min={today}/>
			<br />
			<button onClick={addTodo}>Add Todo</button>
			<br />
			<br />
			<input placeholder="Search..." type="text" value={search} onChange={(e) => { setSearch(e.target.value) }} />
			Filter:
			<select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
				<option value="">Priority</option>
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
			</select>
			<select value={sortShow} onChange={(e) => setSortShow(e.target.value)}>
				<option value="">Show</option>
				<option value="MAD">Mark as done</option>
				<option value="MAU">Mark as undone</option>
			</select>
			From:
			<input type="date" value={filterDueDateFrom} onChange={(e) => setFilterDueDateFrom(e.target.value)} min={today}/>
			To:
			<input type="date" value={filterDueDateTo} onChange={(e) => setFilterDueDateTo(e.target.value)} min={today}/>
			<ul>
				{filteredTodos(todos).map((todo, index) => {
					return <li>
						{editId === index ? (
							<>
								<input type="text" value={editItem} onChange={(e) => { setEditItem(e.target.value) }} />
								<select value={todo.priority} onChange={(e) => updatePriority(index, e.target.value)}>
									<option value="" selected={todo.priority === ""}>Priority</option>
									<option value="low" selected={todo.priority === "low"}>Low</option>
									<option value="medium" selected={todo.priority === "medium"}>Medium</option>
									<option value="high" selected={todo.priority === "high"}>High</option>
								</select>
								<input type="date" value={todo.due_date} onChange={(e) => updateDueDate(index, e.target.value)} min={today}/>
								<button onClick={() => editTodo(index)}>Done</button>
							</>
						) : (
							<>
								{todo.task}
								-{todo.priority}
								-{todo.due_date}
								<button onClick={() => { setEditId(index); setEditItem(todo.task) }}>Edit</button>
								<button onClick={() => { deleteTodo(index) }}>Delete</button>
								<button onClick={() => { toggleMarkTodo(index) }}>
									{todo.mark_as_done ? "Mark as Undone" : "Mark as Done"}
								</button>
							</>
						)}
					</li>
				})}
			</ul>
		</>
	);
}

ReactDOM.render(
	<App />,
	document.getElementById("root")
);