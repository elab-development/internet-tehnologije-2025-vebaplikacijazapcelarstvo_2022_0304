"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";


export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const router = useRouter();


function handleLogin() {
if (email && password) {
router.push("/dashboard");
}
}


return (
<div className="max-w-sm mx-auto">
<h1 className="text-xl mb-4">Prijava</h1>
<Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
<div className="my-2" />
<Input placeholder="Lozinka" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
<div className="my-4" />
<Button text="Prijavi se" onClick={handleLogin} />
</div>
);
}