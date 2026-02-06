// app/admin/page.tsx
import { db, users } from "../db";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { deleteUser, addUser, togglePermission, updateRole } from "./actions";
import Link from "next/link";

export default async function AdminPage() {
    const session = await auth();
    const currentUsername = session?.user?.username || "";

    if (!["dev", "rio"].includes(currentUsername)) redirect("/dashboard");

    const allUsers = await db.select().from(users);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <Link href="/dashboard" className="text-sm font-medium border px-4 py-2 rounded-lg hover:bg-gray-50">← Dashboard</Link>
            </div>

            <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Create New User</h2>
                <form action={addUser} className="flex flex-col md:flex-row gap-4">
                    <input name="username" placeholder="Username" className="flex-1 p-2 border rounded-lg outline-none" required />
                    <input name="password" type="password" placeholder="Password" className="flex-1 p-2 border rounded-lg outline-none" required />
                    <select name="role" className="p-2 border rounded-lg bg-white outline-none">
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
                            <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50/50">
                                <td className="p-4 font-medium">{user.username}</td>

                                <td className="p-4 text-center">
                                    <form action={updateRole} className="flex justify-center">
                                        <input type="hidden" name="userId" value={user.id} />
                                        <select
                                            name="role"
                                            defaultValue={user.role || 'user'}
                                            onChange={(e) => e.currentTarget.form?.requestSubmit()}
                                            className="text-xs font-semibold border rounded px-2 py-1 bg-transparent cursor-pointer"
                                        >
                                            <option value="user">USER</option>
                                            <option value="admin">ADMIN</option>
                                        </select>
                                    </form>
                                </td>

                                <td className="p-4">
                                    <form action={togglePermission} className="flex justify-center">
                                        <input type="hidden" name="userId" value={user.id} />
                                        <input type="hidden" name="currentStatus" value={user.coolchat || '0'} />
                                        <button className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all ${user.coolchat === '1' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-zinc-100 text-zinc-400 border-zinc-200'}`}>
                                            {user.coolchat === '1' ? '● ACCESS GRANTED' : '○ ACCESS LOCKED'}
                                        </button>
                                    </form>
                                </td>

                                <td className="p-4 text-right">
                                    {user.username !== currentUsername ? (
                                        <form
                                            action={deleteUser}
                                            onSubmit={(e) => {
                                                if (!confirm(`Are you sure you want to delete ${user.username}?`)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            <input type="hidden" name="id" value={user.id} />
                                            <button className="text-red-400 hover:text-red-600 text-sm font-medium">Delete</button>
                                        </form>
                                    ) : (
                                        <span className="text-gray-300 text-xs italic">Current Session</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}