import React, { useRef, useState, useEffect } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { Unicode11Addon } from "@xterm/addon-unicode11";
import LoginInputs from "./LoginInputs";
import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";

const TerminalCard: React.FC = () =>
{
    const serverDefault = "localhost";
    const [server, setServer] = useState(serverDefault);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const xterm = useRef<Terminal | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const handleConnect = () =>
    {
        if (!server || !username || !password) return;
        setError(null);
        setConnected(true);
    };

    const handleDisconnect = () =>
    {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
        {
            wsRef.current.close(1000, "User disconnected"); // Normal closure
        }
        setConnected(false);
        setError(null);
    };

    useEffect(() =>
    {
        if (!connected || !terminalRef.current || xterm.current) return;

        const terminal = new Terminal({
            // cols: 80,
            // rows: 32,
            cursorBlink: true,
            theme: {
                background: "#1e1e1e",
                foreground: "#d1d5db",
            },
            windowsMode: true,
            scrollback: 50000,
            allowProposedApi: true,
        });

        const unicodeAddon = new Unicode11Addon();
        const fitAddon = new FitAddon();

        terminal.loadAddon(unicodeAddon);
        terminal.loadAddon(fitAddon);
        terminal.loadAddon(new WebglAddon());
        terminal.open(terminalRef.current);
        terminal.unicode.activeVersion = "11";
        fitAddon.fit();
        terminal.focus();

        xterm.current = terminal;

        // Optional: refit on window resize
        const handleResize = () => fitAddon.fit();
        window.addEventListener("resize", handleResize);

        const query = new URLSearchParams({
            host: server,
            username: username,
            password: password,
        });

        const basePath = window.location.pathname.split("/")[1];
        const prefix = basePath ? `/${basePath}` : "";
        const wsUrl = `wss://${window.location.host}${prefix}/ws/terminal?${query.toString()}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () =>
        {
            terminal.writeln(`\r\n🔌 Connected to ${server} as ${username}\r\n`);
        };

        ws.onerror = () =>
        {
            setError("Connection error. Check credentials or server.");
            terminal.writeln("\r\n❌ Connection failed.");
        };

        ws.onmessage = (event) =>
        {
            terminal.write(event.data);
        };

        ws.onclose = () =>
        {
            terminal.writeln("\r\n🔒 Connection closed.");
        };

        terminal.onData((data) =>
        {
            ws.send(data);
        });

        return () =>
        {
            window.removeEventListener("resize", handleResize);
            ws.close();
            terminal.dispose();
            xterm.current = null;
        };
    }, [connected, password, server, username]);

    return (
        <div className="flex items-center justify-center">
            <div className="min-h-180 w-full space-y-6 rounded-2xl bg-white p-6 shadow-xl">

                {error && <div className="text-red-600">{error}</div>}

                {!connected ? (
                    <LoginInputs
                        server={server}
                        username={username}
                        password={password}
                        onChange={(field, value) =>
                        {
                            if (field === "server") setServer(value);
                            else if (field === "username") setUsername(value);
                            else if (field === "password") setPassword(value);
                        }}
                        onConnect={handleConnect}
                    />
                ) : (
                        <div className="space-y-4">
                            <div
                                ref={terminalRef}
                                style={{ fontFamily: "Courier, \"Courier New\", monospace" }}
                                className="m-0 h-[550px] w-full overflow-auto rounded bg-black p-0"
                            />
                            <div className="mt-4 text-right">
                                <button
                                    onClick={handleDisconnect}
                                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    Disconnect
                                </button>
                            </div>
                        </div>
                )}
            </div>
        </div>
    );
};

export default TerminalCard;
