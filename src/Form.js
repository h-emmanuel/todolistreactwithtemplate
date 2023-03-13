import React from 'react';
import { AppBar, Box, Card, Grid, IconButton, InputLabel, Modal, TextField, Toolbar, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { FormControl } from '@mui/material';
import { List } from '@mui/material';
// import { MenuIcon } from '@mui/material/MenuIcon';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';

//Test pour import table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';


class Form extends React.Component {

    // let[titleTask, setTitle] = "useState("")";
    // const[descriptionTask, setDescription] = useState("");

    // const [listData,- setListData] = useState(0); 
    constructor(props) {
        super(props);
        this.state = {
            titleTask: '',
            descriptionTask: '',
            tasks: [],
            detailTask: {
                idTask: '',
                title: '',
                description: ''
            },
            detailTaskUpdate: {
                idTask: '',
                title: '',
                description: '',
            },
            open: false,
            DataisLoaded: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeUpdateForm = this.handleChangeUpdateForm.bind(this);
        this.handleDetailTask = this.handleDetailTask.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit");
        console.log(e);
        let oldThis = this;
        try {
            let res = await fetch("http://localhost:5500/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titleTask: this.state.titleTask,
                    descriptionTask: this.state.descriptionTask
                }),
                dataType: 'json'
            });
            let resJson = await res.json();
            if (res.status === 201) {
                fetch("http://localhost:5500/api/tasks")
                    .then((res) => res.json())
                    .then((json) => {
                        oldThis.setState({
                            titleTask: '',
                            descriptionTask: '',
                            items: json,
                            DataisLoaded: true
                        })
                    })
                console.log("tache créer")
            }
        }
        catch (err) {
            console.log("erreur");
            console.log(err);
        }
    }

    handleChange(event) {
        console.log("handleChange");
        console.log(event.target.name);
        console.log(event.target.value);
        let index = event.target.name
        if (index === "titleTask") {
            this.setState({ titleTask: event.target.value });
        } else if (index === "descriptionTask") {
            this.setState({ descriptionTask: event.target.value });
        }

    }

    handleChangeDescription(event) {
        console.log("handleChange");
        console.log(event.target.name);
        console.log(event.target.value);
        let index = event.target.name
        this.setState({ descriptionTask: event.target.value });
    }

    handleChangeUpdateForm(event) {
        console.log("handleChangeUpdateForm");
        console.log(event.target.name);
        console.log(event.target.value);
        console.log(this);
        let index = event.target.name
        if (index === "titleUpdated") {
            this.setState({
                detailTaskUpdate: {
                    title: event.target.value,
                    description: this.state.detailTaskUpdate.description
                }
            });
        } else if (index === "descriptionUpdated") {
            this.setState({
                detailTaskUpdate: {
                    title: this.state.detailTaskUpdate.title,
                    description: event.target.value
                }
            });
        }

    }

    handleOpen(event) {
        console.log(event)
        this.setState({ open: true })
    }

    handleClose(event) {
        console.log(event)
        this.setState({ open: false })
    }

    componentDidMount() {
        fetch("http://localhost:5500/api/tasks")
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    items: json,
                    DataisLoaded: true
                })
            })
    }

    handleDelete = async (event) => {
        event.preventDefault();
        console.log("handleDelete");
        console.log(event.target);
        console.log(event.target.dataset.idtask);
        let oldThis = this;
        async function deleteTask() {
            const response = await fetch("http://localhost:5500/delete/" + event.target.dataset.idtask, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                dataType: 'json'
            })

            if (!response.ok) {
                throw 'Erreur code de reponse: '.response.status;
            } else {
                console.log("erreur?")
            }
            return await response.json();
        }

        deleteTask().then(function () {
            console.log("delete");
            fetch("http://localhost:5500/api/tasks")
                .then((res) => res.json())
                .then((json) => {
                    oldThis.setState({
                        titleTask: '',
                        descriptionTask: '',
                        items: json,
                        DataisLoaded: true
                    })
                })


        })

    }

    handleDetailTask(event) {
        console.log("Afficher detail tâche");
        console.log("event.target");
        console.log(event.target);
        console.log("event.parentNode");
        console.log(event.parentNode);
        console.log(event.target.dataset);
        console.log(event.target.dataset.idtask);
        let idTask = event.target.dataset.idtask
        let oldThis = this;
        oldThis.setState({
            detailTask: {
                idTask: "",
                title: "",
                description: ""
            }
        })
        fetch("http://localhost:5500/api/task/" + idTask, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        }).then(response => response.json()).then(function (response) {
            console.log(response.description);

            oldThis.setState({
                detailTask: {
                    idTask: response._id,
                    title: response.title,
                    description: response.description
                }
            })
            oldThis.handleOpen();
        })


    }

    handleUpdate = async (e) => {
        e.preventDefault();
        console.log("handleUpdate");
        console.log(e);
        let oldThis = this;
        // const data = new FormData(e.target);
        // console.log(data);
        let idTask = e.target.dataset.idtask;
        let title = this.state.detailTaskUpdate.title;
        let description = this.state.detailTaskUpdate.description;
        console.log(idTask);
        console.log(title);
        console.log(description);

        fetch("http://localhost:5500/update", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idtask: idTask,
                title: title,
                description: description
            }),
            dataType: 'json'

        }).then(response => response.json()).then(function (response) {
            oldThis.setState({
                detailTask: {
                    idTask: '',
                    title: '',
                    description: ''
                },
                detailTaskUpdate: {
                    idTask: '',
                    title: '',
                    description: ''
                }
            })

            fetch("http://localhost:5500/api/tasks")
                .then((res) => res.json())
                .then((json) => {
                    oldThis.setState({
                        titleTask: '',
                        descriptionTask: '',
                        detailTask: {
                            idTask: '',
                            title: '',
                            description: ''
                        },
                        items: json,
                        DataisLoaded: true
                    })
                })
            console.log("tache créer")
        })






    }






    render() {
        console.log("this.state.items");
        console.log(this.state.items);
        let tasks = this.state.items;
        let tasksDescription = this.state.detailTask;

        // const handleSubmit = (e) => {
        //     e.preventDefault();
        //     fetch('https://jsonplaceholder.typicode.com/posts', {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             title: title,
        //             body: body,
        //             userId: Math.random().toString(36).slice(2),
        //         }),
        //         headers: {
        //             'Content-type': 'application/json; charset=UTF-8',
        //         },
        //     })
        //         .then((res) => res.json())
        //         .then((post) => {
        //             setPosts((posts) => [post, ...posts]);
        //             setTitle('');
        //             setBody('');
        //         })
        //         .catch((err) => {
        //             console.log(err.message);
        //         });
        // };

        // const handleSubmit = async (e) => {
        //     e.preventDefault();
        //     console.log("handleSubmit");
        //     console.log(e);
        //     fetch('http://localhost:5000/create', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify("test"),
        //         dataType: 'json'
        //     }).then((res) => res.json())

        // };

        return (
            <div id="createTaskDiv" >
                <AppBar position="static">
                    <Toolbar variant="dense">

                        <Typography variant="h6" color="inherit" component="div">
                            To Do List App
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div class="createTaskDiv">

                    <div id="formCreateDiv" class="formCreateDiv">
                        <h2>Créer une nouvelle tache</h2>
                        <FormControl >


                            <label for="titleTask">Titre</label>
                            <TextField id="titleTask" name="titleTask" value={this.state.titleTask} onChange={this.handleChange} placeholder="Entrer un titre pour la tâche" />

                            {/* <input id="titleTask" name="titleTask" type="text" value={this.state.titleTask} onChange={this.handleChange}></input> */}
                            <label for="descriptionTask" >Description</label>
                            <TextField id="descriptionTask" name="descriptionTask" placeholder="Entrer une description pour la tâche" multiline rows={6} value={this.state.descriptionTask} onChange={this.handleChange} />
                            {/* <textarea name="descriptionTask" id="" cols="30" rows="10" value={this.state.descriptionTask} onChange={this.handleChange}></textarea> */}
                            {/* <input type="submit" value="Valider" /> */}
                            <Button type="submit" variant="contained" onClick={this.handleSubmit}>Valider</Button>

                        </FormControl>
                        <h1>Tâches</h1>
                    </div>


                    <br />
                    <br />
                    <br />

                    <div id="displayTaskDiv" class="displayTaskDiv">




                        {tasks &&


                            <TableContainer component={Paper} id="">
                                <Table sx={{ maxWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Titre</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tasks.map((task) => (
                                            <TableRow
                                                key={task._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" onClick={this.handleDetailTask} data-idTask={task._id}>
                                                    {task.title}
                                                </TableCell>
                                                <TableCell align="right"><form onSubmit={this.handleDelete} data-idTask={task._id}>
                                                    <input type="hidden" data-idTask={task._id} value={task._id} />
                                                    <Button type="submit" variant="contained"> <DeleteIcon /> </Button>
                                                </form></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            // < ul >
                            //     {
                            //         tasks.map((task) => (
                            //             <div class="lineTask">
                            //                 <li onClick={this.handleDetailTask} data-idTask={task._id}>{task.title} </li>
                            //                 <form onSubmit={this.handleDelete} data-idTask={task._id}>
                            //                     <input type="hidden" data-idTask={task._id} value={task._id} />
                            //                     <button>X</button> <Button variant="contained">X</Button>
                            //                 </form>
                            //             </div>

                            //         ))
                            //     }
                            // </ul>
                        }
                        {/* {tasks &&
        <List >
            {
                tasks.map((task) => (
                    <div>
                        <ListItem onClick={this.handleDetailTask} data-idTask={task._id}  >
                            {task.title}
                            <FormControl >
                                <input type="hidden" data-idTask={task._id} value={task._id} />
                                <Button type="submit" variant="contained" data-idTask={task._id} onClick={this.handleDelete}>X</Button>
                            </FormControl>
                        </ListItem>


                    </div>

                ))
            }
        </List>
    } */}



                        {tasksDescription.title && this.state.open &&

                            < Modal
                                open={this.handleOpen}
                                onClose={this.handleClose}
                                aria-labelledby="parent-modal-title"
                                aria-describedby="parent-modal-description"
                            >
                                <Box sx={{ width: 400 }}>
                                    <Card variant="outlined">
                                        <FormControl >
                                            <h1>Detail de la tâche</h1>
                                            <input type="hidden" name="idTask" value={this.state.detailTask.idTask} />
                                            <label for="titleUpdated">Titre</label>
                                            <TextField id="titleUpdated" name="titleUpdated" defaultValue={this.state.detailTask.title} onChange={this.handleChangeUpdateForm} />

                                            {/* <input id="titleTask" name="titleTask" type="text" value={this.state.titleTask} onChange={this.handleChange}></input> */}
                                            <label for="descriptionUpdated" >Description</label>
                                            <TextField id="descriptionUpdated" name="descriptionUpdated" placeholder="Entrer une description pour la tâche" multiline rows={6} defaultValue={this.state.detailTask.description} onChange={this.handleChangeUpdateForm} />
                                            {/* <textarea name="descriptionTask" id="" cols="30" rows="10" value={this.state.descriptionTask} onChange={this.handleChange}></textarea> */}
                                            {/* <input type="submit" value="Valider" /> */}
                                            <Button type="submit" variant="contained" data-idTask={this.state.detailTask.idTask} onClick={this.handleUpdate}>Valider</Button>

                                        </FormControl>
                                        {/* <div id="detailTaskDiv">
                                            <h1>Detail de la tâche</h1>
                                            <form method='POST' onSubmit={this.handleUpdate}>
                                                <input type="hidden" name="idTask" value={this.state.detailTask.idTask} />
                                                <label htmlFor="titleUpdated">Title:</label><br />
                                                <input type="text" id="titleUpdated" name="titleUpdated" defaultValue={this.state.detailTask.title} /><br />
                                                <label htmlFor="descriptionUpdated">Description</label><br />
                                                <textarea name="descriptionUpdated" id="descriptionUpdated" cols="30" rows="10" defaultValue={this.state.detailTask.description}></textarea><br />
                                                <input type="submit" value="Valider" />
                                            </form>
                                        </div> */}
                                        {/* <ChildModal /> */}
                                    </Card>
                                </Box>
                            </Modal>

                        }
                    </div >
                </div>


            </div >

        )
    }
}

export default Form;