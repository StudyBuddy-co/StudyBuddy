import { ImageWithFallback } from "../figma/ImageWithFallback";

export function ServiceCard({ title, description, imageUrl, gradient }) {
  return (
    <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-stone-200">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-3xl group-hover:opacity-10 transition-opacity duration-300`}
      ></div>

      <div className="relative space-y-6">
        <div className="relative overflow-hidden rounded-2xl shadow-md">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/*<div className="flex justify-center space-x-2 pt-4">
          <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
          <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
          <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
        </div>*/}
      </div>
    </div>
  );
}