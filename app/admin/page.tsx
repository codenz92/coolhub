import { db, users } from "../db";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { addUser } from "./actions";
import Link from "next/link";
import UserRow from "./UserRow";

export default async function AdminPage() {
    const session = await auth();
    const currentUsername = session?.user?.username || "";

    if (!["dev", "rio"].includes(currentUsername)) redirect("/dashboard");

    const allUsers = await db.select().from(users);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-black">User Management</h1>
                <Link href="/dashboard" className="text-sm font-medium border px-4 py-2 rounded-lg hover:bg-gray-50 text-black">← Dashboard</Link>
            </div>

            <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-black">Create New User</h2>
                <form action={addUser} className="flex flex-col md:flex-row gap-4">
                    <input name="username" placeholder="Username" className="flex-1 p-2 border rounded-lg outline-none text-black" required />
                    <input name="password" type="password" placeholder="Password" className="flex-1 p-2 border rounded-lg outline-none text-black" required />
                    <select name="role" className="p-2 border rounded-lg bg-white outline-none text-black">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">Add User</button>
                </form>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-500">
                        <tr>
                            <th className="p-4 font-bold">Username</th>
                            <th className="p-4 font-bold text-center">Role</th>
                            <th className="p-4 font-bold text-center">CoolChat</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map((user) => (
                            <UserRow key={user.id} user={user} currentUsername={currentUsername} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}