import React, {useState} from "react";
import Header from "../organismos/Header";
import Sidebar from "../organismos/Sidebar";
import GlobalTable from "../organismos/Table";
import { Area } from "../../types/area";
import Boton from "../atomos/Boton";
import { X } from "lucide-react";

interface AreasProps {
    userName?: string;
}

const Areas: React.FC<AreasProps> = ({ userName }) => {
    const [Areas, setAreas] = useState<Area[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingArea, setEditingArea] = useState<Area | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        sede: ''
    });

    const handleEdit = (Area: Area) => {
        setEditingArea(Area);
        setFormData({
            nombre: Area.nombre,
            sede: Area.sede.toString()
        });
        setShowModal(true);
    };

    const handleDelete = (Area: Area) => {
        const confirmDelete = window.confirm('¿Está seguro de eliminar este Area?');
        if (confirmDelete) {
            setAreas(Areas.filter(p => p.key !== Area.key));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newKey = Math.max(...Areas.map(p => p.key)) + 1;

        const newArea: Area = {
            key: editingArea ? editingArea.key : newKey,
            id_area: editingArea ? editingArea.id_area : newKey,
            nombre: formData.nombre,
            sede: String(formData.sede)
        };

        if (editingArea) {
            setAreas(Areas.map(p => p.key === editingArea.key ? newArea : p));
        } else {
            setAreas([...Areas, newArea]);
        }

        setEditingArea(null);
        setShowModal(false);
        setFormData({ nombre: '', sede: '' });
    };

    const handleCreate = () => {
        setEditingArea(null);
        setFormData({ nombre: '', sede: '' });
        setShowModal(true);
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header userName={userName} />
                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-white">Areas</h1>
                        <Boton color="primary" onClick={handleCreate}>Crear Area</Boton>
                    </div>
                    <GlobalTable
                        data={Areas}
                        columns={[
                            { key: 'id_area', label: 'ID', sortable: true, filterable: true },
                            { key: 'nombre', label: 'Nombre', sortable: true, filterable: true },
                            { key: 'sede', label: 'Sede', sortable: true, filterable: true },
                            {
                                key: 'acciones',
                                label: 'Acciones',
                                render: (item: Area) => (
                                    <div className="flex space-x-2">
                                        <Boton color="primary" size="sm" onClick={() => handleEdit(item)}>Editar</Boton>
                                        <Boton color="secondary" size="sm" onClick={() => handleDelete(item)}>Eliminar</Boton>
                                    </div>
                                )
                            }
                        ]}
                        rowsPerPage={10}
                        defaultSortColumn="id_area"
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
                            {editingArea ? 'Editar Area' : 'Nuevo Area'}
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
                                    <label className="block text-sm font-medium text-gray-300">Sede</label>
                                    <input
                                        type="text"
                                        value={formData.sede}
                                        onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Boton type="button" color="secondary" onClick={() => setShowModal(false)}>Cancelar</Boton>
                                <Boton type="submit" color="primary">{editingArea ? 'Actualizar' : 'Crear'}</Boton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Areas;