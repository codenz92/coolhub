// app/admin/page.tsx
import { db, users } from "../db";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { deleteUser, addUser } from "./actions";
import Link from "next/link";
export default async function AdminPage() {
    const session = await auth(); //

    // Replace 'admin_user' with your actual username for security
    if (session?.user?.username !== "dev") {
        redirect("/dashboard");
    }

    const allUsers = await db.select().from(users);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* 2. Flex header to place the button next to the title */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">User Management</h1>

                <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-black border border-gray-300 px-4 py-2 rounded-lg transition-colors"
                >
                    ← Back to Dashboard
                </Link>
            </div>
            {/* Create User Form */}
            <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Create New User</h2>
                <form action={addUser} className="flex flex-col md:flex-row gap-4">
                    <input
                        name="username"
                        placeholder="Username"
                        className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                    <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Add User
                    </button>
                </form>
            </div>
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold">Username</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map((user) => (
                            <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4">{user.username}</td>
                                <td className="p-4 text-right">
                                    <form action={deleteUser}>
                                        <input type="hidden" name="id" value={user.id} />
                                        <button className="text-red-500 hover:text-red-700 font-medium px-4">
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