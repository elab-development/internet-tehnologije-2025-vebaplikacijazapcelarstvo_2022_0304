"use client";

interface HiveCardProps {
  id: number;
  name: string;
  strength: string;
  onClick?: () => void;
}

export default function HiveCard({ id, name, strength, onClick }: HiveCardProps) {
  
  const image = "/images/beehive.png";

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
    >
      {/* Slika košnice */}
      <div className="flex justify-center mb-3">
        <img 
          src={image} 
          alt={`Košnica ${name}`}
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* Naziv košnice */}
      <h3 className="text-lg font-semibold text-center mb-2 text-gray-800 dark:text-gray-100">
        {name}
      </h3>

      {/* Jačina */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-md p-2 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          <span className="font-medium">Jačina:</span> {strength}
        </p>
      </div>
    </div>
  );
}