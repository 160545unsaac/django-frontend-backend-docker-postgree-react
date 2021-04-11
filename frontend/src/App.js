import React, { useState, useEffect } from 'react';
import './App.css';
import MaterialTable from "material-table";
import axios from 'axios';
import { Modal, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const columns = [
  { title: 'Id', field: 'id' },
  { title: 'Nombre', field: 'nombre' },
  { title: 'Apellidos', field: 'apellidos' },
];
const baseUrl = "http://localhost:8000/api/usuario";


const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  }
}));

function App() {
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
    id: "",
    nombre: "",
    apellidos: "",
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setUsuarioSeleccionado(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const peticionGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPost = async () => {
    await axios.post(baseUrl, usuarioSeleccionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPut = async () => {
    await axios.put(baseUrl + "/" + usuarioSeleccionado.id, usuarioSeleccionado)
      .then(response => {
        var dataNueva = data;
        dataNueva.map(usuario => {
          if (usuario.id === usuarioSeleccionado.id) {
            usuario.nombre = usuarioSeleccionado.nombre;
            usuario.apellido = usuarioSeleccionado.apellido;
          }
        });
        setData(dataNueva);
        abrirCerrarModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionDelete = async () => {
    await axios.delete(baseUrl + "/" + usuarioSeleccionado.id)
      .then(response => {
        setData(data.filter(usuario => usuario.id !== usuarioSeleccionado.id));
        abrirCerrarModalEliminar();
      }).catch(error => {
        console.log(error);
      })
  }

  const seleccionarusuario = (usuario, caso) => {
    setUsuarioSeleccionado(usuario);
    (caso === "Editar") ? abrirCerrarModalEditar()
      :
      abrirCerrarModalEliminar()
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }


  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  useEffect(() => {
    peticionGet();
  }, [])

  const bodyInsertar = (
    <div className={styles.modal}>
      <h3>Agregar Nuevo usuario</h3>
      <TextField className={styles.inputMaterial} label="Nombre" name="nombre" onChange={handleChange} />
      <br />
      <TextField className={styles.inputMaterial} label="Apellidos" name="apellidos" onChange={handleChange} />
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
        <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar = (
    <div className={styles.modal}>
      <h3>Editar usuario</h3>
      <TextField className={styles.inputMaterial} label="Nombre" name="nombre" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.nombre} />
      <br />
      <TextField className={styles.inputMaterial} label="Apellidos" name="apellidos" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.apellidos} />
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPut()}>Editar</Button>
        <Button onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar al usuario <b>{usuarioSeleccionado && usuarioSeleccionado.usuario}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={() => peticionDelete()}>Sí</Button>
        <Button onClick={() => abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )

  return (
    
    <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
      <br />
      <Button onClick={() => abrirCerrarModalInsertar()}>Insertar usuario</Button>
      <br /><br />
      <MaterialTable
        
        columns={columns}
        data={data}
        title="Usuarios CRUD"
        actions={[
          {
            icon: "edit",
            tooltip: 'Editar usuario',
            onClick: (event, rowData) => seleccionarusuario(rowData, "Editar")
          },
          {
            icon: "delete",
            tooltip: 'Eliminar usuario',
            onClick: (event, rowData) => seleccionarusuario(rowData, "Eliminar")
          }
        ]}
        options={{
          actionsColumnIndex: -1,
        }}
        localization={{
          header: {
            actions: "Acciones"
          }
        }}
      />


      <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>


      <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>

      <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div>
  );
}

export default App;
