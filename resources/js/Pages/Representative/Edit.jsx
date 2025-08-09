import { Link, useForm, usePage } from '@inertiajs/react';
import Form from './Form';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function Edit({ model }) {
    const { auth } = usePage().props;

    const { data, setData, put, processing, errors } = useForm(model);

    function handleSubmit(e) {
        e.preventDefault();
        put(route('representatives.update', model.id));
    }

    return (
        <>
          <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Edit Representative</h2>}
        >
            <h1 className="text-2xl font-bold">Edit Representative</h1>
            <hr className="my-4" />
            <form onSubmit={handleSubmit}>
                <Form data={data} setData={setData} errors={errors} />
                <div className="mt-4">
                    {auth.user.permissions.includes('representatives_update') && (
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={processing}>
                            Update
                        </button>
                    )}
                    <Link href={route('representatives.index')} className="ml-4 text-gray-600">Cancel</Link>
                </div>
            </form>
            </AuthenticatedLayout>
        </>
    );
}
