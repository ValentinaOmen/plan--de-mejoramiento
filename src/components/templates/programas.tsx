import React, {useState} from "react";
import Header from "../organismos/Header";
import Sidebar from "../organismos/Sidebar";
import GlobalTable from "../organismos/Table";
import { Programa } from "../../types/programa";
import Boton from "../atomos/Boton";
import { X } from "lucide-react";

interface ProgramasProps {
    userName?: string;
}

const Programas: React.FC<ProgramasProps> = ({ userName }) => {
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPrograma, setEditingPrograma] = useState<Programa | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: ''
    });

    const handleEdit = (programa: Programa) => {
        setEditingPrograma(programa);
        setFormData({
            nombre: programa.nombre,
            tipo: programa.tipo.toString()
        });
        setShowModal(true);
    };

    const handleDelete = (programa: Programa) => {
        const confirmDelete = window.confirm('¿Está seguro de eliminar este programa?');
        if (confirmDelete) {
            setProgramas(programas.filter(p => p.key !== programa.key));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newKey = Math.max(...programas.map(p => p.key)) + 1;

        const newPrograma: Programa = {
            key: editingPrograma ? editingPrograma.key : newKey,
            id_programa: editingPrograma ? editingPrograma.id_programa : newKey,
            nombre: formData.nombre,
            tipo: Number(formData.tipo)
        };

        if (editingPrograma) {
            setProgramas(programas.map(p => p.key === editingPrograma.key ? newPrograma : p));
        } else {
            setProgramas([...programas, newPrograma]);
        }

        setEditingPrograma(null);
        setShowModal(false);
        setFormData({ nombre: '', tipo: '' });
    };

    const handleCreate = () => {
        setEditingPrograma(null);
        setFormData({ nombre: '', tipo: '' });
        setShowModal(true);
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header userName={userName} />
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-white">Programas</h1>
                        <Boton color="primary" onClick={handleCreate}>Crear Programa</Boton>
                    </div>
                    <GlobalTable
                        data={programas}
                        columns={[
                            { key: 'id_programa', label: 'ID', sortable: true, filterable: true },
                            { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
                            { key: 'tipo', label: 'Tipo', sortable: true, filterable: true },
                            {
                                key: 'acciones',
                                label: 'Acciones',
                                render: (item: Programa) => (
                                    <div className="flex space-x-2">
                                        <Boton color="primary" size="sm" onClick={() => handleEdit(item)}>Editar</Boton>
                                        <Boton color="secondary" size="sm" onClick={() => handleDelete(item)}>Eliminar</Boton>
                                    </div>
                                )
                            }
                        ]}
                        rowsPerPage={10}
                        defaultSortColumn="id_programa"
                    />
                </main>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {editingPrograma ? 'Editar Programa' : 'Nuevo Programa'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Nombre</label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Tipo</label>
                                    <input
                                        type="text"
                                        value={formData.tipo}
                                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Boton type="button" color="secondary" onClick={() => setShowModal(false)}>Cancelar</Boton>
                                <Boton type="submit" color="primary">{editingPrograma ? 'Actualizar' : 'Crear'}</Boton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Programas;