import React from "react";
import { FaBookOpen } from "react-icons/fa";
import TerminalCard from "@/components/TerminalCard";
import VmattAttribution from "@/components/VmattAttribution";

const App: React.FC = () =>
{
    return (
        <div className="flex min-h-screen items-center justify-center bg-sky-100 px-6 py-16">
            <div className="relative w-full max-w-4xl space-y-6 rounded-2xl bg-white p-8 shadow-xl">
                {/* 🔗 Repo link */}
                <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-sky-600">
                    <a
                        href="https://github.com/mattvarghese/TerminalSimulator"
                        target="_blank"
                        className="inline-flex items-center gap-1 font-medium hover:underline"
                        title="View Repository"
                    >
                        <FaBookOpen className="text-base" />
                        Repo
                    </a>
                </div>


                {/* 💬 Title */}
                <h1 className="text-center text-3xl font-bold text-sky-700">
                    Matt's web based SSH Client!
                </h1>

                {/* 🙌 Attribution */}
                <VmattAttribution />

                {/* 🖥 Terminal */}
                <div className="pt-2">
                    <TerminalCard />
                </div>
            </div>
        </div>
    );
};

export default App;
