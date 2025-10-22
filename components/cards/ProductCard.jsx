import Image from 'next/image';

export default function ProductCard({ publication }) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const imageUrl = publication.image?.[0]?.url ? `${baseURL}${publication.image[0].url}` : null;
  const pdfUrl = publication.pdf?.[0]?.url ? `${baseURL}${publication.pdf[0].url}` : null;

  const openPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={openPdf}
      className={`cursor-${pdfUrl ? 'pointer' : 'default'} 
                  border border-gray-300 rounded-lg p-4 
                  flex flex-col items-center 
                  select-none 
                  transition-shadow duration-300
                  shadow-sm
                  hover:shadow-lg`}
    >
      <h2 className="mb-3 text-black text-center text-lg font-semibold">{publication.Name}</h2>

      {imageUrl ? (
        // Next.js Image requires width and height or layout='responsive'
        <Image
          src={imageUrl}
          alt={publication.Name}
          width={300}
          height={200}
          className="rounded-md select-none"
          unoptimized={true} // optional, if images are from external source without config
          draggable={false}
          priority={false}
        />
      ) : (
        <div
          className="w-full h-36 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 italic select-none"
          style={{ minWidth: 300 }}
        >
          No Image
        </div>
      )}
    </div>
  );
}
