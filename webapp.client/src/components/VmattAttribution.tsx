import React from "react";

const VmattAttribution: React.FC = () =>
{
    return (
        <div className="flex items-center justify-center gap-4 text-xs text-gray-700">
            <a
                href="https://github.com/mattvarghese"
                target="_blank"
                rel="noopener noreferrer"
                title="View Matt's profile"
            >
                <img
                    src="favicon.ico"
                    alt="Matt's profile"
                    className="h-8 w-8 rounded-full border border-gray-300 object-cover transition hover:ring-2 hover:ring-sky-500"
                />
            </a>
            <p>
                App brought to you by{" "}
                <a
                    href="https://github.com/mattvarghese"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sky-600 hover:underline"
                >
                    Matt | Varghese Mathew
                </a>
                . <br />Talk to Matt if you have feedback!
            </p>
        </div>
    );
};

export default VmattAttribution;
