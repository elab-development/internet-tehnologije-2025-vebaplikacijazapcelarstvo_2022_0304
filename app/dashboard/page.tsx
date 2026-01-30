import Card from "@/components/Card";


export default function DashboardPage() {
return (
<div className="grid grid-cols-3 gap-4">
<Card title="Košnice">Ukupno: 5</Card>
<Card title="Aktivnosti">Zakazane: 3</Card>
<Card title="Notifikacije">Nema novih</Card>
</div>
);
}