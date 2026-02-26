import React from "react";

interface LoginInputsProps
{
    server: string;
    username: string;
    password: string;
    onChange: (field: "server" | "username" | "password", value: string) => void;
    onConnect: () => void;
}

const LoginInputs: React.FC<LoginInputsProps> = ({
    server,
    username,
    password,
    onChange,
    onConnect,
}) =>
{
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-sm text-gray-700">
                <p>
                    This is a Web Based SSH Client Application.
                    Please enter the server, your username, and your password, and click Connect!
                </p>
            </div>

            <form
                onSubmit={(e) =>
                {
                    e.preventDefault();
                    onConnect();
                }}
                className="space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700">Server</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={server}
                        onChange={(e) => onChange("server", e.target.value)}
                        placeholder="Chronicles Operational Database Server to connect to"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={username}
                        onChange={(e) => onChange("username", e.target.value)}
                        placeholder="Your username"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={password}
                        onChange={(e) => onChange("password", e.target.value)}
                        placeholder="Your password"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    disabled={!server || !username || !password}
                >
                    Connect
                </button>
            </form>

        </div>
    );
};

export default LoginInputs;
