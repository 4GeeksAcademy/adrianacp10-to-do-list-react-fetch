import React, { useEffect, useState } from "react";

const Home = () => {
	//useState
	const [inputValue, setInputValue] = useState("");
	const [saveTask, setSaveTask] = useState([]);

	const handleKeyDown = (e) => {
		if (e.keyCode === 13) {
			updateTask(inputValue);
			setSaveTask([...saveTask, inputValue])
			setInputValue("")

		}
	}
	useEffect(() => {
		loadTask()
	}, [])

	const handleDeleteTask = async (index) => {
		await deleteTask(index);
		setSaveTask(saveTask.filter((_, currentIndex) => index !== currentIndex));
	}

	//metodos utilizados en la API 

	// lista vacia se carga por primera vez
	const loadTask = async () => {
		try {
			const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/adrianacp10');
			if (response.ok) {
				const data = await response.json();
				setSaveTask(data);
				console.log(data);
			} else {
				if (response.status === 404) {
					console.log("usuario no encontrado");
					createUser();
				} else {
					console.error("error en la solicitud", response.status)
				}
			}
		}
		catch (error) {
			console.error(error)
		}
	};
	//se agrega una nueva tarea
	const updateTask = async (value) => {
		try {
		  const newTask = {
			label: value,
			done: false, 
		  }
		  const updatedListTask = [...saveTask, newTask]
		  const putOptions = {
			method: "PUT",
			headers : {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(updatedListTask)
		  };
		  const putResponse = await fetch('https://playground.4geeks.com/apis/fake/todos/user/adrianacp10',
		  putOptions 
		  );
		  if(putResponse.ok){
			setInputValue("");
			loadTask();
		  }
		  else {console.error("error al agregar tarea")}
		} catch (error) {
		  console.error(error);
		}
	  };

	//se crea el usuario
	const createUser = async () => {
		try {
			const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/adrianacp10', {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify([]),
			});

			if (response.ok) {
				const data = await response.json();
				console.log('Usuario creado', data);
				loadTask();
			}
			else { console.error('Error al crear el usuario', response.status) }
		}

		catch (error) {
			console.error(error);
		}
	}

	//se elimina una tarea
	const deleteTask = async (id) => {
		const updatedList = saveTask.filter( (task)=> task.id !== id);
		console.log(updatedList.length)
		if (updatedList.length === 0) {
			const defaultTask = {
				id: 1,
				label: "default task",
				done: false
			}
			updatedList.push(defaultTask);
		}
		try {
			const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/adrianacp10',
				{
					method: 'PUT',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(updatedList)
				});
			if (response.ok) {
				console.log('Tarea eliminada correctamente');
				loadTask();
			} else {
				console.error('error al eliminar la tarea', response.status)}
		} catch (error) {
			console.log(error);
		}

	}

	return (
		<div className="container">
			<h1>My to do's </h1>

			<div>
				<input type="text" onChange={(e) => setInputValue(e.target.value)}
					value={inputValue}
					onKeyDown={handleKeyDown}
					placeholder="Things you need to do"></input>
			</div>

			<ul>
				{saveTask.map((t, index) => {
					return (
						<li key={index}> {`${t.label}`}
							<i className="fas fa-trash"
								onClick={() => handleDeleteTask(t.id)}>
							</i>
						</li>
					)
				})}
			</ul>

			<div>{saveTask.length} tasks to do left</div>
		</div>
	)
};

export default Home;