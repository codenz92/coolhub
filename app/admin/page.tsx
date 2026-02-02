import { db, users } from "@/app/db";
import { auth } from "@/app/auth";
import { deleteUser } from "./actions";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const session = await auth();

    // Basic Security Check
    // Note: You should eventually add a 'role' check here
    if (!session) redirect("/login");

    const allUsers = await db.select().from(users);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700">ID</th>
                            <th className="p-4 font-semibold text-gray-700">Username</th>
                            <th className="p-4 text-right font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 text-gray-600">{user.id}</td>
                                <td className="p-4 font-medium">{user.username}</td>
                                <td className="p-4 text-right">
                                    <form action={deleteUser}>
                                        <input type="hidden" name="id" value={user.id} />
                                        <button className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition border border-red-200">
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}