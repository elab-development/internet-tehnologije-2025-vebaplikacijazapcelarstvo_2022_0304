export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
return (
<div className="bg-gray-900 border border-yellow-400 p-4 rounded">
<h3 className="text-lg mb-2">{title}</h3>
{children}
</div>
);
}