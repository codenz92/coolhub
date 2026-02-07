"use client";

import { updateRole, deleteUser, togglePermission } from "./actions";

interface User {
    id: number;
    username: string | null; // Changed from string
    role: string | null;
    coolchat: string | null;
    password?: string | null; // Added this just in case
}

export default function UserRow({ user, currentUsername }: { user: User, currentUsername: string }) {
    return (
        <tr className="border-b last:border-0 hover:bg-gray-50/50">
            <td className="p-4 font-medium text-black">{user.username}</td>

            <td className="p-4 text-center">
                <form action={updateRole} className="flex justify-center">
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                        name="role"
                        defaultValue={user.role || 'user'}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="text-xs font-semibold border rounded px-2 py-1 bg-transparent cursor-pointer text-black outline-none"
                    >
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                    </select>
                </form>
            </td>

            <td className="p-4 text-center">
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
                        <button className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors">
                            Delete
                        </button>
                    </form>
                ) : (
                    <span className="text-gray-400 text-xs italic font-bold select-none">YOU</span>
                )}
            </td>
        </tr>
    );
}
